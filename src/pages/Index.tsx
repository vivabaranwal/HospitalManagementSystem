import { DashboardLayout } from "@/components/DashboardLayout";
import { StatsCard } from "@/components/StatsCard";
import { Users, CalendarCheck, BedDouble, Stethoscope, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const recentPatients = [
  { id: 1, name: "Sarah Johnson", age: 34, department: "Cardiology", status: "Admitted", date: "2026-02-06" },
  { id: 2, name: "Michael Chen", age: 52, department: "Neurology", status: "Outpatient", date: "2026-02-06" },
  { id: 3, name: "Emily Davis", age: 28, department: "Orthopedics", status: "Discharged", date: "2026-02-05" },
  { id: 4, name: "James Wilson", age: 67, department: "Oncology", status: "Admitted", date: "2026-02-05" },
  { id: 5, name: "Maria Garcia", age: 41, department: "Dermatology", status: "Outpatient", date: "2026-02-05" },
];

const upcomingAppointments = [
  { id: 1, patient: "Alice Brown", doctor: "Dr. Smith", time: "09:00 AM", type: "Follow-up" },
  { id: 2, patient: "Robert Lee", doctor: "Dr. Patel", time: "10:30 AM", type: "Consultation" },
  { id: 3, patient: "Diana Ross", doctor: "Dr. Kim", time: "11:15 AM", type: "Check-up" },
  { id: 4, patient: "Tom Harris", doctor: "Dr. Adams", time: "02:00 PM", type: "Surgery Prep" },
];

const statusColor: Record<string, string> = {
  Admitted: "bg-info/15 text-info border-info/20",
  Outpatient: "bg-success/15 text-success border-success/20",
  Discharged: "bg-muted text-muted-foreground border-border",
};

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Welcome back. Here's today's overview.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Patients" value="1,284" change="+12% from last month" changeType="positive" icon={Users} />
          <StatsCard title="Appointments Today" value="48" change="6 remaining" changeType="neutral" icon={CalendarCheck} />
          <StatsCard title="Available Beds" value="34 / 120" change="28% available" changeType="negative" icon={BedDouble} />
          <StatsCard title="Active Doctors" value="56" change="4 on leave" changeType="neutral" icon={Stethoscope} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent patients */}
          <div className="lg:col-span-2 bg-card rounded-lg border">
            <div className="p-5 border-b flex items-center justify-between">
              <h3 className="font-semibold">Recent Patients</h3>
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
                        <Badge variant="outline" className={statusColor[p.status]}>
                          {p.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Upcoming appointments */}
          <div className="bg-card rounded-lg border">
            <div className="p-5 border-b flex items-center justify-between">
              <h3 className="font-semibold">Today's Appointments</h3>
              <a href="/appointments" className="text-xs text-primary flex items-center gap-1 hover:underline font-medium">
                View all <ArrowRight className="h-3 w-3" />
              </a>
            </div>
            <div className="divide-y">
              {upcomingAppointments.map((apt) => (
                <div key={apt.id} className="p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{apt.patient}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {apt.time}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{apt.doctor} · {apt.type}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
