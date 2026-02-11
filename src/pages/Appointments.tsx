import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck, Clock, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchAppointments } from "@/lib/api";

const statusColor: Record<string, string> = {
  Confirmed: "bg-success/15 text-success border-success/20",
  Pending: "bg-warning/15 text-warning border-warning/20",
  Cancelled: "bg-destructive/15 text-destructive border-destructive/20",
};

export default function Appointments() {
  const { data: appointments, isLoading, error } = useQuery({
    queryKey: ['appointments'],
    queryFn: fetchAppointments
  });

  if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;
  if (error) return <div className="p-10 text-red-500">Error loading appointments</div>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Appointments</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage scheduling</p>
          </div>
          <Button className="gap-2 self-start">
            <Plus className="h-4 w-4" /> New Appointment
          </Button>
        </div>

        <div className="grid gap-4">
          {appointments?.map((apt: any) => (
            <div key={apt.id} className="bg-card rounded-lg border p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-sm transition-shadow">
              <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                <CalendarCheck className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{apt.patient_name}</span>
                  <Badge variant="outline" className={statusColor[apt.status]}>{apt.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{apt.doctor_name} · {apt.department} · {apt.type}</p>
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-1 shrink-0">
                <Clock className="h-3.5 w-3.5" />
                {apt.date} at {apt.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}