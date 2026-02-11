import { DashboardLayout } from "@/components/DashboardLayout";
import { Users, UserRoundCheck, CalendarClock, BedDouble, Loader2 } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { useQuery } from "@tanstack/react-query";
import { fetchStats } from "@/lib/api";

export default function Index() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-4 text-red-500">Error loading dashboard data. Is the backend running?</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Overview of hospital operations and key metrics.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Patients"
            value={stats.total_patients}
            icon={Users}
            description="Registered patients"
            trend="updated just now"
            trendUp={true}
          />
          <StatsCard
            title="Available Doctors"
            value={stats.available_doctors}
            icon={UserRoundCheck}
            description="Currently on duty"
            trend="real-time status"
            trendUp={true}
          />
          <StatsCard
            title="Pending Appointments"
            value={stats.pending_appointments}
            icon={CalendarClock}
            description="Requires confirmation"
            trend="needs attention"
            trendUp={false}
          />
          <StatsCard
            title="Available Beds"
            value={stats.available_beds}
            icon={BedDouble}
            description="Across all wards"
            trend="live capacity"
            trendUp={true}
          />
        </div>

        {/* Quick Actions Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="font-semibold leading-none tracking-tight mb-4">System Status</h3>
            <div className="text-sm text-muted-foreground">
              Backend Connection: <span className="text-green-500 font-medium">Active</span>
              <br />
              Database: <span className="text-green-500 font-medium">Connected</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}