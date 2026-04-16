import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, Clock, Filter, AlertCircle, CheckCircle2, Timer } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchAppointments } from "@/lib/api";
import { BookAppointmentModal } from "@/components/BookAppointmentModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const statusConfig: Record<string, { label: string, color: string, icon: any }> = {
  Confirmed: { 
    label: "Confirmed", 
    color: "bg-green-500/10 text-green-500 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]",
    icon: CheckCircle2 
  },
  Pending: { 
    label: "Pending", 
    color: "bg-orange-500/10 text-orange-500 border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.1)]",
    icon: Timer 
  },
  Scheduled: { 
    label: "Scheduled", 
    color: "bg-orange-500/10 text-orange-500 border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.1)]",
    icon: Timer 
  },
  Cancelled: { 
    label: "Cancelled", 
    color: "bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]",
    icon: AlertCircle 
  },
};

export default function Appointments() {
  const { data: appointments, isLoading, error } = useQuery({
    queryKey: ['appointments'],
    queryFn: fetchAppointments
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-[60vh] items-center justify-center flex-col gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse font-medium">Synchronizing clinical schedules...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-10 text-center">
           <div className="bg-destructive/10 text-destructive p-4 rounded-lg inline-block font-medium">
             Network failure: Could not retrieve appointments data.
           </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-10 py-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight">Clinical Scheduling</h1>
            <p className="text-muted-foreground">Manage consultations and triage priorities.</p>
          </div>
          <BookAppointmentModal />
        </div>

        <div className="flex items-center justify-between gap-4 bg-card/50 backdrop-blur-sm p-4 rounded-xl border">
           <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Quick Filters:</span>
              <div className="flex gap-2 ml-4">
                 {['Today', 'This Week', 'Pending'].map(f => (
                    <Badge key={f} variant="outline" className="cursor-pointer hover:bg-muted transition-colors">{f}</Badge>
                 ))}
              </div>
           </div>
           <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Total Queue: {appointments?.length || 0}
           </div>
        </div>

        <div className="rounded-2xl border bg-card/30 backdrop-blur-sm overflow-hidden transition-all hover:shadow-2xl hover:shadow-primary/5">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-bold uppercase tracking-tighter text-[10px]">Patient Information</TableHead>
                <TableHead className="font-bold uppercase tracking-tighter text-[10px]">Medical Specialist</TableHead>
                <TableHead className="font-bold uppercase tracking-tighter text-[10px]">Protocol / Dept</TableHead>
                <TableHead className="font-bold uppercase tracking-tighter text-[10px]">Schedule Details</TableHead>
                <TableHead className="font-bold uppercase tracking-tighter text-[10px]">Current Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments?.length === 0 ? (
                <TableRow>
                   <TableCell colSpan={5} className="h-48 text-center text-muted-foreground">
                      No appointments scheduled at this time.
                   </TableCell>
                </TableRow>
              ) : (
                appointments?.map((apt: any) => {
                  const status = statusConfig[apt.status] || statusConfig.Pending;
                  const StatusIcon = status.icon;
                  
                  return (
                    <TableRow key={apt.id} className="group hover:bg-primary/5 transition-colors border-b/50">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold tracking-tight text-foreground">{apt.patient_name}</span>
                          <span className="text-[10px] font-mono text-muted-foreground uppercase">ID: {apt.id}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                           <div className="h-6 w-6 rounded-full bg-accent flex items-center justify-center text-[10px]">Dr</div>
                           <span className="font-medium text-sm">Dr. {apt.doctor_name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                         <div className="flex flex-col">
                            <span className="text-xs font-semibold">{apt.department}</span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{apt.type}</span>
                         </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-xs font-medium">
                            <Calendar className="h-3 w-3 text-primary" />
                            {apt.date ? new Date(apt.date).toLocaleDateString(undefined, { dateStyle: 'medium' }) : '—'}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {apt.time ?? '—'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${status.color} py-1 px-3 border flex items-center gap-1.5 w-fit`}>
                           <StatusIcon className="h-3 w-3" />
                           <span className="text-[10px] font-black uppercase tracking-widest">{status.label}</span>
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
}