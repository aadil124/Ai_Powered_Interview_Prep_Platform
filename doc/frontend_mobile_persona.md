# Frontend Mobile Persona (Candidate App)

## Persona Profile
- **Device assumptions:** Android mobile devices (Minimum API 26 / Android 8.0). Functional microphone required.
- **UI toolkit:** Jetpack Compose, Material Design 3.
- **User type:** Candidate / Job Seeker practicing technical interviews.

## Screen Wireframes (for each screen)

### 1. Onboarding & Login Screen
- **Primary goal:** Secure authentication and consent capture.
- **Layout hierarchy:** App Logo -> Welcome Text -> Phone/Email Input -> OTP Verify Button -> Audio Consent Checkbox.
- **Interaction flow:**
  ```mermaid
  graph TD
      A[Enter Phone/Email] --> B[Request OTP]
      B --> C[Enter OTP]
      C --> D[Validate Token]
      D --> E[Dashboard]
  ```
- **Animations & transitions:** Slide up for OTP modal.

### 2. Interview Setup Screen
- **Primary goal:** Allow candidate to configure the mock session.
- **Layout hierarchy:** Header -> Department Dropdown -> Experience Level Selector -> Question Count Slider -> Start Session Button.
- **Interaction flow:**
  ```mermaid
  graph TD
      A[Select Department] --> B[Select Level]
      B --> C[Set Question Count]
      C --> D[Initialize Mock Session]
  ```
- **Animations & transitions:** Crossfade on selection changes.

### 3. Mock Assessment Session Screen
- **Primary goal:** Present questions and capture voice/text answers.
- **Layout hierarchy:** Question Header (Timer/Progress) -> Active Question Text -> Microphone Button (Hold to talk) / Keyboard Toggle -> Submit Answer Button.
- **Interaction flow:**
  ```mermaid
  graph TD
      A[Display Question] --> B[Start Voice Record / Type]
      B --> C[Convert STT (Whisper)]
      C --> D[Review Transcribed Text]
      D --> E[Submit Answer]
      E --> F[Next Question or End]
  ```
- **Animations & transitions:** Pulsating microphone icon during audio capture. Swipe left for next question.

### 4. Evaluation Dashboard Screen
- **Primary goal:** Display AI feedback and scores.
- **Layout hierarchy:** Overall Score Ring -> Strengths/Weaknesses Cards -> Question-by-Question Breakdown -> Back to Home Button.
- **Interaction flow:**
  ```mermaid
  graph TD
      A[Calculate AI Score] --> B[Load Evaluation Details]
      B --> C[Expand Question Breakdown]
  ```
- **Animations & transitions:** Circular progress fill animation for the score ring.

## Styling (Material Design 3)
- **Color system:** Dynamic Color enabled. Primary (Deep Blue/Teal), Secondary (Amber/Coral for alerts), Surface (Off-white/Dark Grey for dark mode).
- **Typography system:** Roboto/Inter. Large titles for scores, readable body medium for long interview texts.

## Component States
- **Button:** Enabled (Solid Primary), Disabled (Greyed out, 50% opacity), Pressed (Ripple effect).
- **Input:** Idle (Outline), Focused (Thick Primary Outline), Error (Red outline with helper text).
- **Card:** Elevated (2dp), Clickable (Ripple), Selected (Primary border).

## Empty States
- **No data:** "You haven't completed any mock interviews yet." with a prominent "Start Practice" CTA.
- **Offline:** "No internet connection. Interview sessions require an active connection."
- **No permission:** "Microphone access is required to use voice input."

## Error States
- **401/403:** "Session expired. Please log in again." -> Redirect to Login.
- **Timeout/Network:** "Unable to reach servers. Please try again." -> Retry button.
- **Transcription Failure:** "Could not transcribe audio clearly. Please type your response or try again."

## Responsive Breakpoints
- **Compact:** < 600dp (Standard Phones) - Full width vertical stacking.
- **Medium/Expanded:** Tablets not explicitly targeted, but cards will max-width at 600dp and center on larger displays to prevent UI stretching.

## Accessibility
- **Touch targets:** Minimum 48x48dp for all interactable elements (e.g., mic button, submission).
- **Semantics:** Clear content descriptions on all icons (e.g., `contentDescription = "Start Voice Recording"`).
- **Screen reader support:** Proper Compose `semantics` traversal order (Question text first, then input methods).
