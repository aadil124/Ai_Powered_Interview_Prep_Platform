import { useQuery } from '@tanstack/react-query';
import { insightsService } from '../../services/insights.service';
import { INSIGHTS_QUERY_KEYS } from '../../insights.query-keys';
import { MostImprovedQueryParams } from '../../types/insights.types';

export const useGetMostImproved = (params: MostImprovedQueryParams = {}) => {
  return useQuery({
    queryKey: INSIGHTS_QUERY_KEYS.mostImproved(params),
    queryFn: () => insightsService.getMostImproved(params),
  });
};
