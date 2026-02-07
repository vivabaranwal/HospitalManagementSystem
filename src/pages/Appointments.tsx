import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppointments } from "@/hooks/useAppointments";
import { Skeleton } from "@/components/ui/skeleton";

const statusColor: Record<string, string> = {
  Confirmed: "bg-success/15 text-success border-success/20",
  Pending: "bg-warning/15 text-warning border-warning/20",
  Cancelled: "bg-destructive/15 text-destructive border-destructive/20",
};

export default function Appointments() {
  const { data: appointments, isLoading } = useAppointments();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Appointments</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage scheduling and appointments</p>
          </div>
          <Button className="gap-2 self-start">
            <Plus className="h-4 w-4" /> New Appointment
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 rounded-lg" />)}</div>
        ) : (
          <div className="grid gap-4">
            {appointments?.map((apt) => (
              <div key={apt.id} className="bg-card rounded-lg border p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-sm transition-shadow animate-fade-in">
                <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                  <CalendarCheck className="h-5 w-5" style={{ stroke: "url(#pink-gradient)" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">{(apt.patients as any)?.name ?? "Unknown"}</span>
                    <Badge variant="outline" className={statusColor[apt.status] ?? ""}>{apt.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{(apt.doctors as any)?.name ?? "—"} · {apt.department} · {apt.type}</p>
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-1 shrink-0">
                  <Clock className="h-3.5 w-3.5" />
                  {apt.date} at {apt.time}
                </div>
              </div>
            ))}
            {appointments?.length === 0 && <p className="text-muted-foreground text-center py-8">No appointments found.</p>}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
