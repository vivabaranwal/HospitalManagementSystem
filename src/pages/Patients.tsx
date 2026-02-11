import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchPatients } from "@/lib/api";

const statusColor: Record<string, string> = {
  Admitted: "bg-info/15 text-info border-info/20",
  Outpatient: "bg-success/15 text-success border-success/20",
  Discharged: "bg-muted text-muted-foreground border-border",
};

export default function Patients() {
  const { data: patients, isLoading, error } = useQuery({
    queryKey: ['patients'],
    queryFn: fetchPatients
  });

  if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;
  if (error) return <div className="p-10 text-red-500">Error loading patients</div>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Patients</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage patient records</p>
          </div>
          <Button className="gap-2 self-start">
            <Plus className="h-4 w-4" /> Add Patient
          </Button>
        </div>

        <div className="bg-card rounded-lg border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 font-medium text-muted-foreground">ID</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Name</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Age</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Gender</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Department</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Doctor</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {patients?.map((p: any) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-3 text-muted-foreground font-mono text-xs">{p.id}</td>
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3 text-muted-foreground">{p.age}</td>
                  <td className="p-3 text-muted-foreground">{p.gender}</td>
                  <td className="p-3 text-muted-foreground">{p.department}</td>
                  <td className="p-3 text-muted-foreground">{p.doctor_name}</td>
                  <td className="p-3">
                    <Badge variant="outline" className={statusColor[p.status]}>{p.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}