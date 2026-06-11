# Backend Persona (Core System Architecture)

## System Profile
- **Framework:** Spring Boot 3
- **Language:** Java 21
- **DB:** PostgreSQL (Relational) + Redis (Cache/Rate Limiting) + Elasticsearch (Search Index)
- **Auth model:** Stateless JWT (JSON Web Tokens) with OTP for candidate verification and Role-Based Access Control (RBAC).

## Validation Layer
- **DTO examples (Java records):**
  ```java
  public record CreateSessionRequest(
      @NotBlank(message = "Department ID is required") String departmentId,
      @NotNull(message = "Experience level is required") ExperienceLevel experienceLevel,
      @Min(value = 1, message = "Question count must be at least 1")
      @Max(value = 20, message = "Question count cannot exceed 20") int questionCount
  ) {}

  public record SubmitAnswerRequest(
      @NotBlank(message = "Question ID is required") String questionId,
      @NotNull(message = "Response type is required") ResponseType responseType,
      String transcribedText,
      @URL(message = "Audio URL must be valid if provided") String audioUrl
  ) {}
  ```
- **Constraints:** Jakarta Bean Validation (Hibernate Validator) applied at controller level via `@Valid`. Global `@ControllerAdvice` maps `MethodArgumentNotValidException` to standard 400 JSON schemas.

## Database Schema (PostgreSQL)
- **Tables with UUID primary keys:**
  ```sql
  CREATE TABLE users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      role VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE departments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      subdomain VARCHAR(255) NOT NULL
  );

  CREATE TABLE interview_sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      candidate_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      department_id UUID NOT NULL REFERENCES departments(id),
      status VARCHAR(50) NOT NULL,
      started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  ```
- **Foreign keys:** Strictly enforced with appropriate `ON DELETE CASCADE` or `RESTRICT` rules to maintain referential integrity.
- **Indexes:** B-Tree indexes on highly queried fields like `candidate_id`, `department_id`, and `email`.

## Rate Limiting
- **Endpoint-based limits:** Token bucket algorithm implemented via Redis and Spring AOP/Filters.
  - Candidate Answer Submission: 10 requests per minute.
  - Admin Bulk Ingestion: 5 requests per hour.
- **429 response format:**
  ```json
  {
    "status": 429,
    "error": "Too Many Requests",
    "message": "Rate limit exceeded. Please try again in 45 seconds.",
    "retryAfterSeconds": 45
  }
  ```

## Security Standards
- **OWASP Top 10:** Prepared statements (Spring Data JPA) prevent SQL injection. Output sanitization on React client prevents XSS.
- **JWT rotation:** Short-lived Access Tokens (15 minutes). Long-lived Refresh Tokens (7 days) stored securely and rotatable upon compromise.
- **Password hashing:** BCrypt/Argon2id for Admin credentials (if applicable outside of OTP flows).
- **CSRF protection:** CSRF disabled for stateless REST APIs using JWT, but strict CORS configurations applied to allow only the specific Web Admin domain.

## Logging Standards
- **SLF4J levels:**
  - `ERROR`: System failures, database down, external API timeouts (Whisper/OpenAI).
  - `WARN`: Rate limits hit, unauthorized access attempts.
  - `INFO`: Lifecycle events (Session started, Bulk ingest completed).
  - `DEBUG`: Request/Response payloads (disabled in production).
- **MDC correlation ID:** A unique `X-Request-ID` is generated via a Web Filter and added to MDC to trace a single request across threads and micro-services/logs.

## Monitoring
- **Metrics (Micrometer to Prometheus):**
  - **CPU/RAM:** JVM memory usage and GC pauses.
  - **Latency:** API `@Timed` latency distributions (p95, p99). Alert if `ai_evaluation_duration_seconds` > 10s.
  - **DB thresholds:** Connection pool exhaustion (HikariCP active connections).

## Disaster Recovery
- **RPO / RTO:** 
  - Recovery Point Objective (RPO): 1 Hour (Transaction log backups).
  - Recovery Time Objective (RTO): 4 Hours.
- **Backup strategy:** Automated daily RDS snapshots + Continuous WAL (Write-Ahead Logging) archiving to S3.
- **Replication:** Multi-AZ (Availability Zone) deployment for PostgreSQL.

## Async Jobs
- **Job list with triggers:**
  - `DocumentIngestionJob`: Triggered on Admin file upload. Parses text, calls AI to extract Q&A, and persists to DB/Elasticsearch.
  - `AudioCleanupJob`: Cron job running daily at 02:00 UTC to hard-delete audio files older than 30 days.
  - `EvaluationProcessingJob`: Triggered when an interview session completes. Calls OpenAI, generates rubric scores, and saves to DB.
- **Concurrency control strategy:** `@Async` configured with specific ThreadPoolTaskExecutors. Redis Distributed Locks (ShedLock/Redisson) ensure cron jobs like `AudioCleanupJob` only run on a single backend instance simultaneously.
