import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { BedDouble, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { fetchWards } from "@/lib/api";

const typeColor: Record<string, string> = {
  General: "bg-info/15 text-info border-info/20",
  Critical: "bg-destructive/15 text-destructive border-destructive/20",
  Pediatric: "bg-success/15 text-success border-success/20",
  Maternity: "bg-accent text-accent-foreground border-border",
  Surgical: "bg-warning/15 text-warning border-warning/20",
};

export default function Beds() {
  const { data: wards, isLoading, error } = useQuery({
    queryKey: ['wards'],
    queryFn: fetchWards
  });

  if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;
  if (error) return <div className="p-10 text-red-500">Error loading wards</div>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Beds & Wards</h1>
          <p className="text-muted-foreground text-sm mt-1">Monitor bed availability</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wards?.map((ward: any) => {
            const available = ward.total_beds - ward.occupied_beds;
            const occupancy = Math.round((ward.occupied_beds / ward.total_beds) * 100);
            return (
              <div key={ward.id} className="bg-card rounded-lg border p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                      <BedDouble className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{ward.name}</h3>
                      <Badge variant="outline" className={`text-[10px] ${typeColor[ward.type]}`}>{ward.type}</Badge>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <Progress value={occupancy} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{occupancy}% occupied</span>
                    <span className="font-medium text-primary">{available} available</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{ward.occupied_beds} occupied</span>
                    <span>{ward.total_beds} total</span>
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