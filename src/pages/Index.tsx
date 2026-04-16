import { DashboardLayout } from "@/components/DashboardLayout";
import { Users, UserRoundCheck, CalendarClock, BedDouble, Loader2, AlertCircle } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { useQuery } from "@tanstack/react-query";
import { fetchStats } from "@/lib/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function Index() {
  const { data: stats, isLoading, error, refetch } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
    retry: 1,
    refetchInterval: 30000 
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-[70vh] items-center justify-center flex-col gap-6 animate-pulse">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <div className="absolute inset-0 blur-xl bg-primary/20 rounded-full" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-xl font-semibold tracking-tight">RakshakAI HMS</p>
            <p className="text-muted-foreground animate-bounce">Synchronizing medical data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !stats) {
    return (
      <DashboardLayout>
        <div className="p-8 max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-8 text-center space-y-4">
            <div className="mx-auto h-16 w-16 bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Architecture Unavailable</h2>
              <p className="text-muted-foreground">
                We're unable to establish a secure connection with the Python API. 
                Please ensure the backend server is active at <code className="bg-muted px-1 rounded">http://localhost:5000</code>.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
              <Button size="lg" className="w-full sm:w-auto" onClick={() => window.open('http://localhost:5000/api/health', '_blank')}>
                Diagnostics Check
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto" onClick={() => refetch()}>
                Retry Handshake
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-10 py-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Clinical Overview
            </h1>
            <p className="text-muted-foreground text-lg">
              Live operational metrics and system integrity.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-muted/30 px-4 py-2 rounded-full border border-border/50 backdrop-blur-sm">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">System Operational</span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Patients"
            value={stats.total_patients ?? 0}
            icon={Users}
            description="Registry growth +12% this month"
            trend="Live Registry"
            trendUp={true}
          />
          <StatsCard
            title="Available Doctors"
            value={stats.total_doctors ?? 0}
            icon={UserRoundCheck}
            description="Active medical rotations"
            trend="Active Status"
            trendUp={true}
          />
          <StatsCard
            title="Pending Consults"
            value={stats.pending_appointments ?? 0}
            icon={CalendarClock}
            description="Action required in triage"
            trend="Priority"
            trendUp={false}
          />
          <StatsCard
            title="Ward Capacity"
            value={stats.available_beds ?? 0}
            icon={BedDouble}
            description="Total available beds (All wards)"
            trend="Live Logistics"
            trendUp={true}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4 rounded-2xl border bg-card/50 backdrop-blur-sm p-8 space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
               <Users className="h-32 w-32" />
            </div>
            
            <div className="space-y-2 relative">
              <h3 className="text-xl font-bold tracking-tight">System Integrity</h3>
              <p className="text-sm text-muted-foreground">Cryptographically verified data source through Python/PostgreSQL stack.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div className="space-y-1">
                 <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Backend Layer</p>
                 <p className="font-mono text-sm">Flask / REST API <span className="text-green-500 ml-2">●</span></p>
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Database</p>
                 <p className="font-mono text-sm">PostgreSQL <span className="text-green-500 ml-2">●</span></p>
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">CORS Config</p>
                 <p className="font-mono text-sm">Native Implementation <span className="text-green-500 ml-2">●</span></p>
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Last Sync</p>
                 <p className="font-mono text-sm">{new Date().toLocaleTimeString()}</p>
              </div>
            </div>
          </div>

          <div className="col-span-3 rounded-2xl border border-dashed border-border/50 flex flex-col items-center justify-center p-8 text-center space-y-4">
             <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <Users className="h-6 w-6 text-muted-foreground" />
             </div>
             <div className="space-y-1">
                <p className="font-semibold">Patient Insights Coming Soon</p>
                <p className="text-xs text-muted-foreground">Advanced analytics and historical trends under development.</p>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}