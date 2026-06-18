import { axiosClient } from '../../../services/http/axios-client';
import { 
  CandidatePerformanceResponse, 
  CandidatePerformanceQueryParams, 
  MostImprovedResponse, 
  MostImprovedQueryParams,
  CandidatePerformance,
  ImprovedCandidate
} from '../types/insights.types';

// Toggle to easily switch between mock data and real backend endpoints
const USE_MOCK = false;

// Mock Candidate Database for FT-28-01 (Performance metrics)
const MOCK_PERFORMANCE_CANDIDATES: CandidatePerformance[] = [
  {
    candidateId: "cand-9f2d8a0c-43f1-4c1d-87be-221199ee44aa",
    fullName: "John Smith",
    profilePhotoUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    departmentName: "Mobile Development",
    technologyName: "React Developer",
    overallScorePercentage: 87.0,
    totalInterviewsAttended: 12,
    lastActiveDate: "2026-06-18T10:00:00Z"
  },
  {
    candidateId: "cand-7c1a8e9d-21b4-4b5c-98aa-332288dd44cc",
    fullName: "Rahul Sharma",
    profilePhotoUrl: null, // Test SVG placeholder
    departmentName: "Software Engineering",
    technologyName: "Java Developer",
    overallScorePercentage: 82.0,
    totalInterviewsAttended: 15,
    lastActiveDate: "2026-06-18T11:00:00Z"
  },
  {
    candidateId: "cand-alice-johnson-uuid",
    fullName: "Alice Johnson",
    profilePhotoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    departmentName: "Web Development",
    technologyName: "Angular Developer",
    overallScorePercentage: 91.0,
    totalInterviewsAttended: 8,
    lastActiveDate: "2026-06-18T09:30:00Z"
  },
  {
    candidateId: "cand-bob-garcia-uuid",
    fullName: "Bob Garcia",
    profilePhotoUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80",
    departmentName: "Software Engineering",
    technologyName: "Python Developer",
    overallScorePercentage: 73.0,
    totalInterviewsAttended: 5,
    lastActiveDate: "2026-06-17T15:00:00Z"
  },
  {
    candidateId: "cand-emma-watson-uuid",
    fullName: "Emma Watson",
    profilePhotoUrl: null, // Test SVG placeholder
    departmentName: "QA Engineering",
    technologyName: "Automation Tester",
    overallScorePercentage: 88.5,
    totalInterviewsAttended: 9,
    lastActiveDate: "2026-06-18T08:15:00Z"
  },
  {
    candidateId: "cand-david-miller-uuid",
    fullName: "David Miller",
    profilePhotoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    departmentName: "Mobile Development",
    technologyName: "Android Developer",
    overallScorePercentage: 65.0,
    totalInterviewsAttended: 3,
    lastActiveDate: "2026-06-16T14:20:00Z"
  },
  {
    candidateId: "cand-sarah-connor-uuid",
    fullName: "Sarah Connor",
    profilePhotoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    departmentName: "Web Development",
    technologyName: "React Developer",
    overallScorePercentage: 95.0,
    totalInterviewsAttended: 11,
    lastActiveDate: "2026-06-18T12:00:00Z"
  },
  {
    candidateId: "cand-michael-chang-uuid",
    fullName: "Michael Chang",
    profilePhotoUrl: null, // Test SVG placeholder
    departmentName: "Data Science",
    technologyName: "Data Analyst",
    overallScorePercentage: 78.0,
    totalInterviewsAttended: 6,
    lastActiveDate: "2026-06-15T10:00:00Z"
  },
  {
    candidateId: "cand-sophia-loren-uuid",
    fullName: "Sophia Loren",
    profilePhotoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    departmentName: "Design",
    technologyName: "UI/UX Designer",
    overallScorePercentage: 84.0,
    totalInterviewsAttended: 7,
    lastActiveDate: "2026-06-18T11:45:00Z"
  },
  {
    candidateId: "cand-james-bond-uuid",
    fullName: "James Bond",
    profilePhotoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    departmentName: "Security Operations",
    technologyName: "Security Specialist",
    overallScorePercentage: 89.0,
    totalInterviewsAttended: 14,
    lastActiveDate: "2026-06-17T23:00:00Z"
  }
];

// Mock Most Improved Candidates for FT-28-02
const MOCK_IMPROVED_CANDIDATES: ImprovedCandidate[] = [
  {
    candidateId: "cand-7c1a8e9d-21b4-4b5c-98aa-332288dd44cc",
    fullName: "Rahul Sharma",
    profilePhotoUrl: null,
    previousAverageScore: 58.0,
    currentAverageScore: 82.0,
    improvementPercentage: 24.0,
    trend: "UPWARD"
  },
  {
    candidateId: "cand-bob-garcia-uuid",
    fullName: "Bob Garcia",
    profilePhotoUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80",
    previousAverageScore: 60.0,
    currentAverageScore: 78.0,
    improvementPercentage: 18.0,
    trend: "UPWARD"
  },
  {
    candidateId: "cand-david-miller-uuid",
    fullName: "David Miller",
    profilePhotoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    previousAverageScore: 50.0,
    currentAverageScore: 65.0,
    improvementPercentage: 15.0,
    trend: "UPWARD"
  },
  {
    candidateId: "cand-9f2d8a0c-43f1-4c1d-87be-221199ee44aa",
    fullName: "John Smith",
    profilePhotoUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    previousAverageScore: 78.0,
    currentAverageScore: 87.0,
    improvementPercentage: 9.0,
    trend: "UPWARD"
  },
  {
    candidateId: "cand-sophia-loren-uuid",
    fullName: "Sophia Loren",
    profilePhotoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    previousAverageScore: 80.0,
    currentAverageScore: 84.0,
    improvementPercentage: 4.0,
    trend: "UPWARD"
  }
];

export const insightsService = {
  async getCandidatePerformance(params: CandidatePerformanceQueryParams): Promise<CandidatePerformanceResponse> {
    if (USE_MOCK) {
      // Delay mock response slightly to test loader states
      await new Promise(resolve => setTimeout(resolve, 300));

      const { departmentId, technologyId, sortBy = 'score_desc', page = 1, limit = 10 } = params;

      // Note: In real setup, the backend filters by UUID. For mock, we map UUIDs to text names or filter matches.
      // If we don't have department/tech definitions matching UUIDs, we can just match loosely.
      let filtered = [...MOCK_PERFORMANCE_CANDIDATES];

      // Simulated department filtering: check if departmentName contains keywords or is not empty
      if (departmentId && departmentId !== 'all') {
        // Just as an example, we can map some dummy UUIDs or use departmentId directly if matched
        filtered = filtered.filter(c => c.departmentName.toLowerCase().replace(/\s+/g, '-') === departmentId || departmentId === 'all');
      }
      if (technologyId && technologyId !== 'all') {
        filtered = filtered.filter(c => c.technologyName.toLowerCase().replace(/\s+/g, '-') === technologyId || technologyId === 'all');
      }

      // Sorting
      if (sortBy === 'score_desc') {
        filtered.sort((a, b) => b.overallScorePercentage - a.overallScorePercentage);
      } else if (sortBy === 'score_asc') {
        filtered.sort((a, b) => a.overallScorePercentage - b.overallScorePercentage);
      } else if (sortBy === 'attended_desc') {
        filtered.sort((a, b) => b.totalInterviewsAttended - a.totalInterviewsAttended);
      }

      // Pagination
      const total = filtered.length;
      const totalPages = Math.max(1, Math.ceil(total / limit));
      const startIndex = (page - 1) * limit;
      const paginated = filtered.slice(startIndex, startIndex + limit);

      return {
        success: true,
        data: {
          candidates: paginated,
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrevious: page > 1
          }
        },
        error: null,
        meta: {
          requestId: `mock-perf-request-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString()
        }
      };
    }

    const response = await axiosClient.get<CandidatePerformanceResponse>('/api/v1/admin/dashboard/candidate-performance', { params });
    return response.data;
  },

  async getMostImproved(params: MostImprovedQueryParams): Promise<MostImprovedResponse> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const { limit = 5 } = params;

      return {
        success: true,
        data: {
          improvedCandidates: MOCK_IMPROVED_CANDIDATES.slice(0, limit)
        },
        error: null,
        meta: {
          requestId: `mock-improved-request-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString()
        }
      };
    }

    const response = await axiosClient.get<MostImprovedResponse>('/api/v1/admin/dashboard/most-improved', { params });
    return response.data;
  }
};
