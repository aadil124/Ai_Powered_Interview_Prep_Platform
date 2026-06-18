import { useGetMostImproved } from '../hooks/queries/useGetMostImproved';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';

// Helper to get initials from candidate's name
const getInitials = (name: string): string => {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0].substring(0, 2).toUpperCase();
};

// Generates avatar background color based on name hash
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

export default function MostImprovedWidget() {
  const { data: improvedResponse, isLoading, isError, error, refetch } = useGetMostImproved({ limit: 5 });

  const candidates = improvedResponse?.data?.improvedCandidates || [];

  return (
    <Card padding="lg" className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-5 border-b border-outline-variant/30 pb-4">
        <div>
          <h4 className="font-headline-sm text-headline-sm font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]" data-icon="trending_up">trending_up</span>
            Progression Velocity
          </h4>
          <p className="text-body-sm text-on-surface-variant mt-1">
            Top 5 candidates by positive preparation delta.
          </p>
        </div>
        <button 
          className="text-on-surface-variant hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-surface-container flex items-center justify-center"
          title="Refresh list"
          onClick={() => refetch()}
        >
          <span className="material-symbols-outlined text-[20px]" data-icon="refresh">refresh</span>
        </button>
      </div>

      {/* List States */}
      {isLoading ? (
        <div className="flex-1 space-y-4 py-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse border border-outline-variant/20 rounded-lg p-3">
              <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                <div className="h-3 bg-slate-200 rounded w-3/4"></div>
              </div>
              <div className="w-12 h-6 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-rose-50/50 rounded-lg border border-rose-100 gap-3">
          <span className="material-symbols-outlined text-rose-500 text-[32px]">error_outline</span>
          <p className="font-headline-sm text-[16px] text-on-surface font-semibold">Could Not Load Progression</p>
          <p className="text-body-sm text-on-surface-variant">
            {error?.message || "Error loading candidate performance trends."}
          </p>
        </div>
      ) : candidates.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-surface-container-lowest rounded-lg border border-outline-variant/40 gap-3">
          <span className="material-symbols-outlined text-on-surface-variant/40 text-[40px]">trending_flat</span>
          <p className="font-headline-sm text-[16px] text-on-surface font-semibold">No Progression Data</p>
          <p className="text-body-sm text-on-surface-variant">
            No candidates have completed multiple sessions to compute progress delta yet.
          </p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-3">
          {candidates.map((candidate, idx) => (
            <div 
              key={candidate.candidateId} 
              className="group flex items-center justify-between p-3 rounded-lg border border-outline-variant/30 bg-surface-container-lowest hover:bg-surface-container-low hover:-translate-y-0.5 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
            >
              {/* Profile details */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  {candidate.profilePhotoUrl ? (
                    <img 
                      src={candidate.profilePhotoUrl} 
                      alt={candidate.fullName} 
                      className="w-11 h-11 rounded-full object-cover border border-outline-variant/30"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        const fallback = (e.target as HTMLImageElement).nextSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}

                  {/* Initials Fallback */}
                  <div 
                    className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-label-md shadow-sm border border-outline-variant/20 ${getAvatarBgColor(candidate.fullName)}`}
                    style={{ display: candidate.profilePhotoUrl ? 'none' : 'flex' }}
                  >
                    {getInitials(candidate.fullName)}
                  </div>

                  {/* Rank Badge */}
                  <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center font-code text-[10px] font-bold border border-white dark:border-zinc-800">
                    {idx + 1}
                  </div>
                </div>

                <div>
                  <p className="font-body-md font-bold text-on-surface group-hover:text-primary transition-colors">
                    {candidate.fullName}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-code text-body-sm text-on-surface-variant font-semibold">
                      {candidate.previousAverageScore.toFixed(0)}%
                    </span>
                    <span className="material-symbols-outlined text-on-surface-variant text-[14px]">arrow_right_alt</span>
                    <span className="font-code text-body-sm text-primary font-bold">
                      {candidate.currentAverageScore.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Delta / Trend */}
              <div className="text-right flex flex-col items-end gap-1">
                <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full text-body-sm font-bold font-code border border-emerald-500/20">
                  <span className="material-symbols-outlined text-[14px] font-bold">arrow_upward</span>
                  +{candidate.improvementPercentage.toFixed(1)}%
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse"></span>
                  {candidate.trend}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
