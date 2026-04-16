import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { BedDouble, Loader2, TrendingUp, Activity } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { fetchWards } from "@/lib/api";

const typeConfig: Record<string, { label: string, color: string }> = {
  General: { label: "General Registry", color: "bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]" },
  ICU: { label: "Critical Care (ICU)", color: "bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]" },
  Pediatric: { label: "Pediatric Wing", color: "bg-green-500/10 text-green-500 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]" },
  Maternity: { label: "Maternity Ward", color: "bg-pink-500/10 text-pink-500 border-pink-500/20 shadow-[0_0_10px_rgba(236,72,153,0.1)]" },
  Private: { label: "Private Suites", color: "bg-orange-500/10 text-orange-500 border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.1)]" },
};

export default function Beds() {
  const { data: wards, isLoading, error } = useQuery({
    queryKey: ['wards'],
    queryFn: fetchWards
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-[60vh] items-center justify-center flex-col gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse font-medium">Scanning logistics and ward capacity...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-10 text-center">
           <div className="bg-destructive/10 text-destructive p-4 rounded-lg inline-block font-medium">
             Logistics error: Could not synchronize with the ward management system.
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
            <h1 className="text-3xl font-extrabold tracking-tight">Capacity & Logistics</h1>
            <p className="text-muted-foreground">Real-time bed availability and ward utilization.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wards?.map((ward: any) => {
            const occupied = ward.capacity - ward.available_beds;
            const occupancyRate = Math.round((occupied / ward.capacity) * 100);
            const config = typeConfig[ward.ward_type] || { label: ward.ward_type, color: "bg-muted text-muted-foreground" };

            return (
              <div key={ward.ward_id} className="group relative bg-card/50 backdrop-blur-sm rounded-2xl border p-6 transition-all hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                   <Activity className="h-20 w-20" />
                </div>

                <div className="flex items-center justify-between mb-6 relative">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.1)] group-hover:rotate-12 transition-transform">
                      <BedDouble className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold tracking-tight">{ward.ward_name}</h3>
                      <Badge className={`${config.color} py-0 px-2 text-[9px] font-black uppercase tracking-widest border`}>
                        {config.label}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-5 relative">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                      <span className="text-muted-foreground">Utilization</span>
                      <span className={occupancyRate > 80 ? "text-destructive" : "text-primary"}>
                        {occupancyRate}%
                      </span>
                    </div>
                    <div className="relative h-2.5 w-full bg-muted rounded-full overflow-hidden border border-border/50">
                       <div 
                         className={`h-full transition-all duration-1000 ease-out rounded-full ${
                           occupancyRate > 90 ? "bg-destructive shadow-[0_0_10px_rgba(239,68,68,0.5)]" : 
                           occupancyRate > 70 ? "bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" : 
                           "bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                         }`}
                         style={{ width: `${occupancyRate}%` }}
                       />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="bg-muted/30 p-3 rounded-xl border border-border/50">
                       <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Available</p>
                       <p className="text-xl font-bold tracking-tight text-primary">{ward.available_beds}</p>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-xl border border-border/50">
                       <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Beds</p>
                       <p className="text-xl font-bold tracking-tight">{ward.capacity}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest pt-2">
                     <TrendingUp className="h-3 w-3" />
                     Live Logistics Feedback Enabled
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}