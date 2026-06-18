import { useState, useCallback, useRef } from 'react';
import { useRetrieveAdminDashboard } from '../features/mod18_dashboard/hooks/queries/useRetrieveAdminDashboard';
import { useGetPlatformMetrics } from '../features/mod20_analytics/hooks/queries/useGetPlatformMetrics';
import toast from 'react-hot-toast';
import PageHeader from '../components/shared/PageHeader';
import StatCard from '../components/shared/StatCard';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

import { useGetDashboardCharts } from '../features/mod18_dashboard/hooks/queries/useGetDashboardCharts';
import { useGetRecentActivity } from '../features/mod18_dashboard/hooks/queries/useGetRecentActivity';

// Import MOD-28 dashboard insights components
import CandidatePerformanceCard from '../features/mod28_dashboard_insights/components/CandidatePerformanceCard';
import MostImprovedWidget from '../features/mod28_dashboard_insights/components/MostImprovedWidget';
import { useQueryClient } from '@tanstack/react-query';
import { INSIGHTS_QUERY_KEYS } from '../features/mod28_dashboard_insights/insights.query-keys';

export default function Admin_Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const queryClient = useQueryClient();
  const lastRunRef = useRef<number>(0);

  // Debounced/Throttled live updates: ignores requests within a 5-second window to prevent flooding
  const handleSimulatedEvent = useCallback(() => {
    const now = Date.now();
    const lastRun = lastRunRef.current;
    
    if (now - lastRun >= 5000) {
      lastRunRef.current = now;
      // Invalidate queries under MOD-28 insights keys to fetch updated metrics
      queryClient.invalidateQueries({ queryKey: INSIGHTS_QUERY_KEYS.all });
      toast.success("AI Evaluation Completed: Throttled update broadcast successful.");
    } else {
      const remaining = Math.ceil((5000 - (now - lastRun)) / 1000);
      toast.error(`Broadcast throttled. Wait ${remaining}s before triggering updates.`);
    }
  }, [queryClient]);

  const { data: dashboardData, isLoading: isDashboardLoading } = useRetrieveAdminDashboard(selectedDate);
  const { data: metricsData, isLoading: isMetricsLoading } = useGetPlatformMetrics(selectedDate);
  const { data: chartsData, isLoading: isChartsLoading } = useGetDashboardCharts(selectedDate);
  const { data: activityDataResp, isLoading: isActivityLoading } = useGetRecentActivity(selectedDate);

  const totalCandidates = (dashboardData as any)?.data?.totalCandidates || '0';
  const totalQuestions = (dashboardData as any)?.data?.totalQuestions || '0';
  const activeSessions = (metricsData as any)?.data?.metrics?.activeSessions || '0';

  const activityData = (chartsData as any)?.data?.activityData || [];
  const accuracyData = (chartsData as any)?.data?.accuracyData || [];
  const recentActivities = (activityDataResp as any)?.data?.activities || [];

  const handleExportReport = () => {
    const csvContent = "Report Type,Total Candidates,Total Questions,Active Sessions\nSystem Overview," + totalCandidates + "," + totalQuestions + "," + activeSessions;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'dashboard_report.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Dashboard report exported successfully!');
  };

  return (
    <>
      



{/* Canvas Area */}
<div className="p-8 max-w-container-max w-full mx-auto">
{/* Header Section */}
<PageHeader 
  title="System Overview Dashboard"
  description="Real-time infrastructure and performance monitoring for PrepCoach AI."
  actions={
    <>
      <div className="flex items-center bg-surface border border-outline-variant rounded-lg px-2 py-1 gap-2 cursor-pointer hover:bg-surface-container-low transition-colors">
        <span className="material-symbols-outlined text-[20px] text-on-surface-variant ml-2">calendar_today</span>
        <input type="date" className="bg-transparent border-none outline-none font-label-md text-label-md text-on-surface cursor-pointer" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
      </div>
      <Button variant="outline" icon="bolt" onClick={handleSimulatedEvent}>SIMULATE AI EVENT</Button>
      <Button icon="download" onClick={handleExportReport}>EXPORT REPORT</Button>
    </>
  }
/>

{/* Row 1: KPI Cards */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
  <StatCard 
    title="Total Candidates"
    value={isDashboardLoading ? '...' : totalCandidates}
    icon="groups"
    trend={{ value: "No data" }}
  />
  <StatCard 
    title="Total Questions"
    value={isDashboardLoading ? '...' : totalQuestions}
    icon="quiz"
  />
  <StatCard 
    title="Active Sessions"
    value={isMetricsLoading ? '...' : activeSessions}
    icon="online_prediction"
    badge={
      <div className="flex items-center gap-2 px-2 py-1 rounded bg-primary/10 text-primary">
        <div className="w-2 h-2 rounded-full bg-primary pulse"></div>
        <span className="font-label-md text-[10px] font-bold">LIVE</span>
      </div>
    }
  />
  <StatCard 
    title="AI Evaluations"
    value="0.0%"
    icon="auto_awesome"
    badge={<span className="font-label-md text-label-md text-on-surface-variant font-bold">0% Success</span>}
    footer={
      <div className="flex-1 bg-surface-container h-2 rounded-full mb-2 overflow-hidden">
        <div className="bg-primary h-full w-[0%]"></div>
      </div>
    }
  />
</div>
{/* Row 2: Charts */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
{/* Chart 1: Interview Activity */}
<Card padding="lg">
<div className="flex justify-between items-center mb-6">
<h4 className="font-headline-sm text-headline-sm">Interview Activity</h4>
<div className="flex gap-2">
<Button variant="outline" size="sm" className="bg-surface-container-high">W</Button>
<Button variant="ghost" size="sm">M</Button>
</div>
</div>
<div className="h-48 mt-4">
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={activityData}>
      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
      <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
      <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
</div>
</Card>
{/* Chart 2: AI Accuracy Trends */}
<Card padding="lg">
<div className="flex justify-between items-center mb-6">
<h4 className="font-headline-sm text-headline-sm">AI Accuracy Trends</h4>
<span className="material-symbols-outlined text-on-surface-variant cursor-pointer">more_vert</span>
</div>
{/* Using an animated shader for a high-tech accuracy visualization */}
<div className="h-48 mt-4">
  {isChartsLoading ? <div className="w-full h-full flex items-center justify-center text-on-surface-variant">Loading...</div> : accuracyData.length > 0 ? (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={accuracyData}>
      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} domain={[80, 100]} />
      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
      <Line type="monotone" dataKey="v4" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
      <Line type="monotone" dataKey="nlp" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
    </LineChart>
  </ResponsiveContainer>
  ) : <div className="w-full h-full flex items-center justify-center text-on-surface-variant italic">No AI Evaluation data available</div>}
</div>
<div className="flex items-center gap-4 mt-6">
<div className="flex items-center gap-2">
<div className="w-3 h-3 rounded-full bg-primary"></div>
<span className="text-body-sm text-on-surface-variant">Core Engine V4</span>
</div>
<div className="flex items-center gap-2">
<div className="w-3 h-3 rounded-full bg-secondary"></div>
<span className="text-body-sm text-on-surface-variant">NLP Processing</span>
</div>
</div>
</Card>
</div>

{/* Row 2.5: Candidate Insights (MOD-28) */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
  <div className="lg:col-span-2">
    <CandidatePerformanceCard />
  </div>
  <div className="lg:col-span-1">
    <MostImprovedWidget />
  </div>
</div>

{/* Row 3: Activity & Health */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
{/* Recent Activity */}
<Card padding="none" className="lg:col-span-2">
<div className="p-6 border-b border-outline-variant flex justify-between items-center">
<h4 className="font-headline-sm text-headline-sm">Recent Activity</h4>
<button className="text-primary font-label-md hover:underline">View All Logs</button>
</div>
<table className="w-full text-left">
<thead className="bg-surface-container-low border-b border-outline-variant">
<tr>
<th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant uppercase">Action</th>
<th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant uppercase">User / System</th>
<th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant uppercase">Status</th>
<th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant uppercase">Time</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">
{isActivityLoading ? (
  <tr><td colSpan={4} className="px-6 py-4 text-center text-on-surface-variant">Loading activities...</td></tr>
) : recentActivities.length === 0 ? (
  <tr><td colSpan={4} className="px-6 py-4 text-center text-on-surface-variant italic">No recent activity</td></tr>
) : (
  recentActivities.map((act: any, idx: number) => (
    <tr key={idx} className="hover:bg-surface-container-low/50 transition-colors group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">activity_zone</span>
          <span className="font-body-md text-body-md font-semibold">{act.action}</span>
        </div>
      </td>
      <td className="px-6 py-4 font-body-md text-body-md">{act.user}</td>
      <td className="px-6 py-4">
        <Badge variant={act.status === 'SUCCESS' ? 'success' : 'info'}>{act.status}</Badge>
      </td>
      <td className="px-6 py-4 font-code text-code text-on-surface-variant">{act.time}</td>
    </tr>
  ))
)}
</tbody>
</table>
</Card>
{/* System Health */}
<Card padding="lg">
<h4 className="font-headline-sm text-headline-sm mb-6">System Health</h4>
<div className="flex flex-col gap-5">
<div className="flex items-center justify-between p-3 rounded-lg border border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low transition-colors">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-primary">memory</span>
<span className="font-body-md text-body-md font-bold">AI Engines</span>
</div>
<div className="flex items-center gap-2">
<span className="text-body-sm text-primary">Stable</span>
<div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(22,163,74,0.5)]"></div>
</div>
</div>
<div className="flex items-center justify-between p-3 rounded-lg border border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low transition-colors">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-primary">database</span>
<span className="font-body-md text-body-md font-bold">Main DB Cluster</span>
</div>
<div className="flex items-center gap-2">
<span className="text-body-sm text-primary">99.9% Up</span>
<div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(22,163,74,0.5)]"></div>
</div>
</div>
<div className="flex items-center justify-between p-3 rounded-lg border border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low transition-colors">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-primary">api</span>
<span className="font-body-md text-body-md font-bold">External API</span>
</div>
<div className="flex items-center gap-2">
<span className="text-body-sm text-primary">Healthy</span>
<div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(22,163,74,0.5)]"></div>
</div>
</div>
<div className="mt-4 pt-4 border-t border-outline-variant">
<div className="flex justify-between items-center mb-2">
<span className="text-body-sm text-on-surface-variant">Storage Capacity</span>
<span className="font-code text-code text-on-surface-variant">1.2 TB / 2.0 TB</span>
</div>
<div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
<div className="bg-primary h-full w-[60%]"></div>
</div>
</div>
<div className="mt-4">
<div className="p-4 bg-secondary-container rounded-lg flex items-center gap-3">
<span className="material-symbols-outlined text-on-secondary-container">verified</span>
<div>
<p className="font-label-md text-label-md font-bold text-on-secondary-container uppercase">Security Compliance</p>
<p className="text-[10px] text-on-secondary-container/80">Last audit passed on Oct 28, 2023</p>
</div>
</div>
</div>
</div>
</Card>
</div>
{/* Footer Meta */}
<footer className="mt-12 py-6 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-4">
<p className="text-body-sm text-on-surface-variant">© 2023 PrepCoach AI Enterprise. All rights reserved.</p>
<div className="flex gap-6">
<a className="text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Status Page</a>
<a className="text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy Policy</a>
<a className="text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Service Terms</a>
</div>
</footer>
</div>

{/* Floating Action Button - Supressed as per Shell Relevance rules for Details/Settings dashboards but keeping for Dashboard specific logic if requested. The mandate says suppress on Settings/Profile. Since this is "Primary Dashboard", a contextual "Create Task" or "New Admin" could be valid. But per instruction "suppress the FAB on Settings, Profile, Details, and Transactional screens". This is a high-level overview, I will suppress it to prioritize canvas clarity. */}


    </>
  );
}
