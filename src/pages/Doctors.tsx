import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchDoctors } from "@/lib/api";

const statusColor: Record<string, string> = {
  Available: "bg-success/15 text-success border-success/20",
  "In Surgery": "bg-warning/15 text-warning border-warning/20",
  "On Leave": "bg-muted text-muted-foreground border-border",
};

export default function Doctors() {
  const { data: doctors, isLoading, error } = useQuery({
    queryKey: ['doctors'],
    queryFn: fetchDoctors
  });

  if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;
  if (error) return <div className="p-10 text-red-500">Error loading doctors</div>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Doctors</h1>
          <p className="text-muted-foreground text-sm mt-1">Medical staff directory</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors?.map((doc: any) => (
            <div key={doc.id} className="bg-card rounded-lg border p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-11 w-11 rounded-full bg-accent flex items-center justify-center">
                  <Stethoscope className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{doc.name}</h3>
                  <p className="text-xs text-muted-foreground">{doc.specialty}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Experience</span>
                  <span className="font-medium">{doc.experience}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="outline" className={statusColor[doc.status]}>{doc.status}</Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}