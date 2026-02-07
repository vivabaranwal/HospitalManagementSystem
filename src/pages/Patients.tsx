import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePatients } from "@/hooks/usePatients";
import { Skeleton } from "@/components/ui/skeleton";

const statusColor: Record<string, string> = {
  Admitted: "bg-info/15 text-info border-info/20",
  Outpatient: "bg-success/15 text-success border-success/20",
  Discharged: "bg-muted text-muted-foreground border-border",
};

export default function Patients() {
  const { data: patients, isLoading } = usePatients();

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

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search patients..." className="pl-9" />
        </div>

        {isLoading ? (
          <Skeleton className="h-64 rounded-lg" />
        ) : (
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
                {patients?.map((p) => (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="p-3 text-muted-foreground font-mono text-xs">{p.patient_id}</td>
                    <td className="p-3 font-medium">{p.name}</td>
                    <td className="p-3 text-muted-foreground">{p.age}</td>
                    <td className="p-3 text-muted-foreground">{p.gender}</td>
                    <td className="p-3 text-muted-foreground">{p.department}</td>
                    <td className="p-3 text-muted-foreground">{(p.doctors as any)?.name ?? "—"}</td>
                    <td className="p-3">
                      <Badge variant="outline" className={statusColor[p.status] ?? ""}>{p.status}</Badge>
                    </td>
                  </tr>
                ))}
                {patients?.length === 0 && (
                  <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No patients found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
