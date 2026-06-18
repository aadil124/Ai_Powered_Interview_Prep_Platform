export const INSIGHTS_QUERY_KEYS = {
  all: ['insights'] as const,
  performance: (params: any) => [...INSIGHTS_QUERY_KEYS.all, 'performance', params] as const,
  mostImproved: (params: any) => [...INSIGHTS_QUERY_KEYS.all, 'most-improved', params] as const,
};
