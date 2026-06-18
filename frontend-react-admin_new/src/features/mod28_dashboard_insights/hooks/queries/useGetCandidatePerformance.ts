import { useQuery } from '@tanstack/react-query';
import { insightsService } from '../../services/insights.service';
import { INSIGHTS_QUERY_KEYS } from '../../insights.query-keys';
import { CandidatePerformanceQueryParams } from '../../types/insights.types';

export const useGetCandidatePerformance = (params: CandidatePerformanceQueryParams) => {
  return useQuery({
    queryKey: INSIGHTS_QUERY_KEYS.performance(params),
    queryFn: () => insightsService.getCandidatePerformance(params),
    placeholderData: (previousData) => previousData, // keep previous data while fetching new pages/filters
  });
};
