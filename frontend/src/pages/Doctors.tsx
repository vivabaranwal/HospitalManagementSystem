import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, Loader2, Mail, Phone, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchDoctors } from "@/lib/api";

const statusConfig: Record<string, { label: string, color: string }> = {
  Available: { 
    label: "On Duty", 
    color: "bg-green-500/10 text-green-500 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]" 
  },
  "In Surgery": { 
    label: "In Surgery", 
    color: "bg-orange-500/10 text-orange-500 border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.1)]" 
  },
  "On Leave": { 
    label: "Off Duty", 
    color: "bg-muted text-muted-foreground border-border" 
  },
};

export default function Doctors() {
  const { data: doctors, isLoading, error } = useQuery({
    queryKey: ['doctors'],
    queryFn: fetchDoctors
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-[60vh] items-center justify-center flex-col gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse font-medium">Loading medical staff directory...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-10 text-center">
           <div className="bg-destructive/10 text-destructive p-4 rounded-lg inline-block font-medium">
             Could not retrieve doctors directory.
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
            <h1 className="text-3xl font-extrabold tracking-tight">Medical Staff</h1>
            <p className="text-muted-foreground">Certified specialists and clinical practitioners.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors?.map((doc: any) => {
            const status = statusConfig[doc.status] || statusConfig["On Leave"];
            return (
              <div key={doc.doctor_id} className="group relative bg-card/50 backdrop-blur-sm rounded-2xl border p-6 transition-all hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                   <Stethoscope className="h-20 w-20" />
                </div>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.1)] group-hover:scale-110 transition-transform">
                    <Stethoscope className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold tracking-tight">Dr. {doc.name}</h3>
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary/80">{doc.department_name}</p>
                  </div>
                </div>

                <div className="space-y-4 relative">
                  <div className="flex items-center justify-between text-xs border-b border-border/50 pb-3">
                    <span className="text-muted-foreground font-medium uppercase tracking-tighter">Current Status</span>
                    <Badge className={`${status.color} py-0.5 px-3 border text-[10px] font-black uppercase tracking-widest`}>
                       {status.label}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                       <Mail className="h-3.5 w-3.5" />
                       <span>{doc.email || "staff@hospital.com"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                       <Phone className="h-3.5 w-3.5" />
                       <span>{doc.phone || "+1 (555) 000-0000"}</span>
                    </div>
                  </div>

                  <button className="w-full mt-2 py-2.5 rounded-xl bg-muted/50 hover:bg-primary/10 text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 border border-transparent hover:border-primary/20">
                     View Schedule <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}