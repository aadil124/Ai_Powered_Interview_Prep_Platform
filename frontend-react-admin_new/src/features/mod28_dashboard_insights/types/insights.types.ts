export interface CandidatePerformance {
  candidateId: string;
  fullName: string;
  profilePhotoUrl: string | null;
  departmentName: string;
  technologyName: string;
  overallScorePercentage: number;
  totalInterviewsAttended: number;
  lastActiveDate: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface CandidatePerformanceResponse {
  success: boolean;
  data: {
    candidates: CandidatePerformance[];
    pagination: PaginationInfo;
  } | null;
  error: any | null;
  meta: {
    requestId: string;
    timestamp: string;
  };
}

export interface CandidatePerformanceQueryParams {
  departmentId?: string;
  technologyId?: string;
  sortBy?: 'score_desc' | 'score_asc' | 'attended_desc';
  page?: number;
  limit?: number;
}

export interface ImprovedCandidate {
  candidateId: string;
  fullName: string;
  profilePhotoUrl: string | null;
  previousAverageScore: number;
  currentAverageScore: number;
  improvementPercentage: number;
  trend: 'UPWARD' | 'DOWNWARD' | 'STABLE';
}

export interface MostImprovedResponse {
  success: boolean;
  data: {
    improvedCandidates: ImprovedCandidate[];
  } | null;
  error: any | null;
  meta: {
    requestId: string;
    timestamp: string;
  };
}

export interface MostImprovedQueryParams {
  limit?: number;
}
