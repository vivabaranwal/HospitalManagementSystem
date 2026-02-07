import { DashboardLayout } from "@/components/DashboardLayout";
import { StatsCard } from "@/components/StatsCard";
import { Users, CalendarCheck, BedDouble, Stethoscope, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { usePatients } from "@/hooks/usePatients";
import { useAppointments } from "@/hooks/useAppointments";
import { useDoctors } from "@/hooks/useDoctors";
import { useWards } from "@/hooks/useWards";
import { Skeleton } from "@/components/ui/skeleton";

const statusColor: Record<string, string> = {
  Admitted: "bg-info/15 text-info border-info/20",
  Outpatient: "bg-success/15 text-success border-success/20",
  Discharged: "bg-muted text-muted-foreground border-border",
};

const Index = () => {
  const { data: patients, isLoading: pLoading } = usePatients();
  const { data: appointments, isLoading: aLoading } = useAppointments();
  const { data: doctors, isLoading: dLoading } = useDoctors();
  const { data: wards, isLoading: wLoading } = useWards();

  const loading = pLoading || aLoading || dLoading || wLoading;

  const totalPatients = patients?.length ?? 0;
  const todayAppointments = appointments?.filter((a) => a.date === new Date().toISOString().split("T")[0])?.length ?? 0;
  const totalBeds = wards?.reduce((s, w) => s + w.total, 0) ?? 0;
  const occupiedBeds = wards?.reduce((s, w) => s + w.occupied, 0) ?? 0;
  const availableBeds = totalBeds - occupiedBeds;
  const activeDoctors = doctors?.filter((d) => d.status === "Available").length ?? 0;
  const onLeave = doctors?.filter((d) => d.status === "On Leave").length ?? 0;

  const recentPatients = patients?.slice(0, 5) ?? [];
  const todayAppts = appointments?.slice(0, 4) ?? [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-serif">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Welcome back. Here's today's overview.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24 rounded-lg" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard title="Total Patients" value={String(totalPatients)} change="" changeType="neutral" icon={Users} />
            <StatsCard title="Appointments Today" value={String(todayAppointments)} change="" changeType="neutral" icon={CalendarCheck} />
            <StatsCard title="Available Beds" value={`${availableBeds} / ${totalBeds}`} change={totalBeds ? `${Math.round((availableBeds / totalBeds) * 100)}% available` : ""} changeType={availableBeds < 10 ? "negative" : "neutral"} icon={BedDouble} />
            <StatsCard title="Active Doctors" value={String(activeDoctors)} change={onLeave ? `${onLeave} on leave` : ""} changeType="neutral" icon={Stethoscope} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card rounded-lg border">
            <div className="p-5 border-b flex items-center justify-between">
              <h3 className="font-semibold font-serif">Recent Patients</h3>
              <a href="/patients" className="text-xs text-primary flex items-center gap-1 hover:underline font-medium">
                View all <ArrowRight className="h-3 w-3" />
              </a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-medium text-muted-foreground">Name</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Age</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Department</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPatients.map((p) => (
                    <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-medium">{p.name}</td>
                      <td className="p-3 text-muted-foreground">{p.age}</td>
                      <td className="p-3 text-muted-foreground">{p.department}</td>
                      <td className="p-3">
                        <Badge variant="outline" className={statusColor[p.status] ?? ""}>{p.status}</Badge>
                      </td>
                    </tr>
                  ))}
                  {recentPatients.length === 0 && (
                    <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No patients yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-card rounded-lg border">
            <div className="p-5 border-b flex items-center justify-between">
              <h3 className="font-semibold">Today's Appointments</h3>
              <a href="/appointments" className="text-xs text-primary flex items-center gap-1 hover:underline font-medium">
                View all <ArrowRight className="h-3 w-3" />
              </a>
            </div>
            <div className="divide-y">
              {todayAppts.map((apt) => (
                <div key={apt.id} className="p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{(apt.patients as any)?.name ?? "Unknown"}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {apt.time}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{(apt.doctors as any)?.name ?? "—"} · {apt.type}</p>
                </div>
              ))}
              {todayAppts.length === 0 && <p className="p-4 text-sm text-muted-foreground text-center">No appointments.</p>}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
