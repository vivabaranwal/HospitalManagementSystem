import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const appointments = [
  { id: 1, patient: "Alice Brown", doctor: "Dr. Smith", department: "Cardiology", date: "2026-02-06", time: "09:00 AM", type: "Follow-up", status: "Confirmed" },
  { id: 2, patient: "Robert Lee", doctor: "Dr. Patel", department: "Neurology", date: "2026-02-06", time: "10:30 AM", type: "Consultation", status: "Confirmed" },
  { id: 3, patient: "Diana Ross", doctor: "Dr. Kim", department: "Orthopedics", date: "2026-02-06", time: "11:15 AM", type: "Check-up", status: "Pending" },
  { id: 4, patient: "Tom Harris", doctor: "Dr. Adams", department: "Oncology", date: "2026-02-06", time: "02:00 PM", type: "Surgery Prep", status: "Confirmed" },
  { id: 5, patient: "Jane Foster", doctor: "Dr. Lee", department: "Dermatology", date: "2026-02-07", time: "09:30 AM", type: "Consultation", status: "Pending" },
  { id: 6, patient: "Mark Evans", doctor: "Dr. Wang", department: "Gynecology", date: "2026-02-07", time: "11:00 AM", type: "Follow-up", status: "Cancelled" },
];

const statusColor: Record<string, string> = {
  Confirmed: "bg-success/15 text-success border-success/20",
  Pending: "bg-warning/15 text-warning border-warning/20",
  Cancelled: "bg-destructive/15 text-destructive border-destructive/20",
};

export default function Appointments() {
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

        <div className="grid gap-4">
          {appointments.map((apt) => (
            <div key={apt.id} className="bg-card rounded-lg border p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-sm transition-shadow animate-fade-in">
              <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                <CalendarCheck className="h-5 w-5 text-accent-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{apt.patient}</span>
                  <Badge variant="outline" className={statusColor[apt.status]}>{apt.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{apt.doctor} · {apt.department} · {apt.type}</p>
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
