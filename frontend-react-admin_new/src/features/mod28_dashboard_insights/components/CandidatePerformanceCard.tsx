import React, { useState } from 'react';
import { useGetCandidatePerformance } from '../hooks/queries/useGetCandidatePerformance';
import { useListDepartments } from '../../mod03_department_management/hooks/queries/useListDepartments';
import { useListTechnologies } from '../../mod04_technology_management/hooks/queries/useListTechnologies';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';

// Helper to get initials from candidate's full name
const getInitials = (name: string): string => {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0].substring(0, 2).toUpperCase();
};

// Helper to generate a consistent premium background color based on name hash
const getAvatarBgColor = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
    'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
    'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  ];
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

// Formats UTC date string into a readable format
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch (e) {
    return dateString;
  }
};

// Determine progress bar tailwind color based on score value
const getProgressBarColor = (score: number): string => {
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 60) return 'bg-amber-500';
  return 'bg-rose-500';
};

export default function CandidatePerformanceCard() {
  const [departmentId, setDepartmentId] = useState<string>('all');
  const [technologyId, setTechnologyId] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'score_desc' | 'score_asc' | 'attended_desc'>('score_desc');
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(5); // Show 5 per page on dashboard for spacing

  // Validation state
  const [validationError, setValidationError] = useState<string | null>(null);

  // Fetch departments & technologies for filter selectors
  const { data: deptsData } = useListDepartments();
  const { data: techsData } = useListTechnologies();

  const departments = deptsData?.data?.departments || [];
  const technologies = (techsData as any)?.data?.technologies || [];

  // Query candidate performance data
  const { data: performanceResponse, isLoading, isError, error } = useGetCandidatePerformance({
    departmentId: departmentId === 'all' ? undefined : departmentId,
    technologyId: technologyId === 'all' ? undefined : technologyId,
    sortBy,
    page,
    limit,
  });

  const handlePageChange = (newPage: number) => {
    // Client-side validation: must be a positive integer
    if (newPage < 1) {
      setValidationError("Page must be a positive integer");
      return;
    }
    setValidationError(null);
    setPage(newPage);
  };

  const handleFilterChange = (type: 'dept' | 'tech', value: string) => {
    setValidationError(null);
    setPage(1); // Reset to page 1 on filter change
    if (type === 'dept') {
      setDepartmentId(value);
    } else {
      setTechnologyId(value);
    }
  };

  const handleSortChange = (value: 'score_desc' | 'score_asc' | 'attended_desc') => {
    setValidationError(null);
    setPage(1);
    setSortBy(value);
  };

  const candidateData = performanceResponse?.data?.candidates || [];
  const pagination = performanceResponse?.data?.pagination || {
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
  };

  return (
    <Card padding="lg" className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-outline-variant/30 pb-4">
        <div>
          <h4 className="font-headline-sm text-headline-sm font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]" data-icon="groups">groups</span>
            Candidate Performance Metrics
          </h4>
          <p className="text-body-sm text-on-surface-variant mt-1">
            Track evaluation averages, interview attendance, and status across cohorts.
          </p>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 bg-surface-container-low border border-outline-variant rounded-lg px-3 py-1.5 hover:bg-surface-container-high transition-colors">
          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">sort</span>
          <select 
            className="bg-transparent border-none outline-none font-label-md text-label-md text-on-surface cursor-pointer pr-1"
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value as any)}
          >
            <option value="score_desc">Score: High to Low</option>
            <option value="score_asc">Score: Low to High</option>
            <option value="attended_desc">Interviews Attended</option>
          </select>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">Department</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">corporate_fare</span>
            <select
              className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-lg text-body-md focus:ring-1 focus:ring-primary focus:border-primary outline-none cursor-pointer appearance-none"
              value={departmentId}
              onChange={(e) => handleFilterChange('dept', e.target.value)}
            >
              <option value="all">All Departments</option>
              {departments.map((d: any) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[20px]">arrow_drop_down</span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">Technology Stack</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">category</span>
            <select
              className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-lg text-body-md focus:ring-1 focus:ring-primary focus:border-primary outline-none cursor-pointer appearance-none"
              value={technologyId}
              onChange={(e) => handleFilterChange('tech', e.target.value)}
            >
              <option value="all">All Technologies</option>
              {technologies.map((t: any) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[20px]">arrow_drop_down</span>
          </div>
        </div>
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div className="p-3 mb-4 rounded-lg bg-rose-50 text-rose-700 text-body-sm flex items-center gap-2 border border-rose-200" role="alert">
          <span className="material-symbols-outlined text-[18px]">error</span>
          <span>{validationError}</span>
        </div>
      )}

      {/* Table Data States */}
      {isLoading ? (
        <div className="space-y-4 py-8">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 animate-pulse">
              <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                <div className="h-3 bg-slate-200 rounded w-1/3"></div>
              </div>
              <div className="w-24 h-4 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="p-8 text-center bg-rose-50/50 rounded-lg border border-rose-100 flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-rose-500 text-[40px]">error_outline</span>
          <p className="font-headline-sm text-on-surface font-semibold">Failed to Load Metrics</p>
          <p className="text-body-sm text-on-surface-variant max-w-sm">
            {error?.message || "An unexpected error occurred while fetching candidate metrics."}
          </p>
        </div>
      ) : candidateData.length === 0 ? (
        <div className="p-12 text-center bg-surface-container-lowest rounded-lg border border-outline-variant/40 flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-on-surface-variant/40 text-[48px]">person_off</span>
          <p className="font-headline-sm text-on-surface font-semibold">No Candidates Found</p>
          <p className="text-body-sm text-on-surface-variant max-w-sm">
            No candidates configured yet matching the current filters or query selection.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/40 bg-surface-container-low/40">
                <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant uppercase">Candidate</th>
                <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant uppercase">Department / Stack</th>
                <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant uppercase">Attendance</th>
                <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant uppercase">Performance Score</th>
                <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant uppercase">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {candidateData.map((candidate) => (
                <tr key={candidate.candidateId} className="hover:bg-surface-container-lowest transition-colors group">
                  {/* Candidate Profile Details */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      {candidate.profilePhotoUrl ? (
                        <img 
                          src={candidate.profilePhotoUrl} 
                          alt={candidate.fullName} 
                          className="w-10 h-10 rounded-full object-cover border border-outline-variant/30"
                          onError={(e) => {
                            // Fallback to SVG placeholder on load error
                            (e.target as HTMLImageElement).style.display = 'none';
                            const fallback = (e.target as HTMLImageElement).nextSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      
                      {/* SVG/Styled Initials Avatar Fallback */}
                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-label-md shadow-sm border border-outline-variant/20 ${getAvatarBgColor(candidate.fullName)}`}
                        style={{ display: candidate.profilePhotoUrl ? 'none' : 'flex' }}
                      >
                        {getInitials(candidate.fullName)}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-body-md font-bold text-on-surface">{candidate.fullName}</p>
                          {/* Pulsing indicator for active status */}
                          <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </div>
                        </div>
                        <p className="text-[11px] text-on-surface-variant font-code mt-0.5">{candidate.candidateId.substring(0, 13)}...</p>
                      </div>
                    </div>
                  </td>

                  {/* Dept and Stack info */}
                  <td className="py-3.5 px-4">
                    <p className="font-body-md text-on-surface font-semibold">{candidate.departmentName}</p>
                    <p className="text-body-sm text-on-surface-variant">{candidate.technologyName}</p>
                  </td>

                  {/* Interview count */}
                  <td className="py-3.5 px-4">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-on-surface border border-outline-variant/30">
                      <span className="material-symbols-outlined text-[14px]">school</span>
                      <span className="font-code text-body-sm font-bold">{candidate.totalInterviewsAttended} sessions</span>
                    </div>
                  </td>

                  {/* Performance percentage & bar */}
                  <td className="py-3.5 px-4 w-48">
                    <div className="flex items-center justify-between gap-3 mb-1.5">
                      <span className="font-code text-body-md font-bold text-on-surface">
                        {candidate.overallScorePercentage.toFixed(1)}%
                      </span>
                      <Badge variant={candidate.overallScorePercentage >= 80 ? 'success' : candidate.overallScorePercentage >= 60 ? 'info' : 'warning'}>
                        {candidate.overallScorePercentage >= 80 ? 'EXCELLENT' : candidate.overallScorePercentage >= 60 ? 'PASSING' : 'NEEDS IMPROVEMENT'}
                      </Badge>
                    </div>
                    <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden border border-outline-variant/20">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor(candidate.overallScorePercentage)}`}
                        style={{ width: `${candidate.overallScorePercentage}%` }}
                      ></div>
                    </div>
                  </td>

                  {/* Last active date */}
                  <td className="py-3.5 px-4">
                    <p className="font-body-md text-on-surface-variant">{formatDate(candidate.lastActiveDate)}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Toolbar */}
      {!isLoading && !isError && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-outline-variant/30 mt-6 pt-4">
          <p className="text-body-sm text-on-surface-variant font-code">
            Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total candidates)
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasPrevious}
              onClick={() => handlePageChange(pagination.page - 1)}
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasNext}
              onClick={() => handlePageChange(pagination.page + 1)}
            >
              Next
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
