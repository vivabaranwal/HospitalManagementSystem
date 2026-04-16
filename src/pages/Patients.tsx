import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, UserCircle2, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchPatients } from "@/lib/api";
import { AddPatientModal } from "@/components/AddPatientModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Patients() {
  const [search, setSearch] = useState("");
  const { data: patients, isLoading, error } = useQuery({
    queryKey: ['patients'],
    queryFn: fetchPatients
  });

  const filteredPatients = patients?.filter((p: any) => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.patient_id.toString().includes(search)
  );

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-[60vh] items-center justify-center flex-col gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse font-medium">Retrieving patient directory...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-10 text-center space-y-4">
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg inline-block font-medium">
            Fatal error: Could not synchronize with the patients database.
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
            <h1 className="text-3xl font-extrabold tracking-tight">Patient Directory</h1>
            <p className="text-muted-foreground">Search and manage centralized medical identities.</p>
          </div>
          <AddPatientModal />
        </div>

        <div className="flex items-center gap-4 bg-card/50 backdrop-blur-sm p-4 rounded-xl border">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or global ID..." 
              className="pl-10 bg-transparent border-none focus-visible:ring-0 text-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="h-4 w-px bg-border mx-2 hidden md:block" />
          <div className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground shrink-0">
             Total Records: <span className="text-foreground">{patients?.length || 0}</span>
          </div>
        </div>

        <div className="rounded-2xl border bg-card/30 backdrop-blur-sm overflow-hidden transition-all hover:shadow-2xl hover:shadow-primary/5">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[100px] font-bold uppercase tracking-tighter text-[10px]">Registry ID</TableHead>
                <TableHead className="font-bold uppercase tracking-tighter text-[10px]">Patient Identity</TableHead>
                <TableHead className="font-bold uppercase tracking-tighter text-[10px]">Biometrics</TableHead>
                <TableHead className="font-bold uppercase tracking-tighter text-[10px]">Contact Uplink</TableHead>
                <TableHead className="font-bold uppercase tracking-tighter text-[10px]">Serology</TableHead>
                <TableHead className="font-bold uppercase tracking-tighter text-[10px]">Registry Date</TableHead>
                <TableHead className="text-right font-bold uppercase tracking-tighter text-[10px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2 opacity-50">
                       <UserCircle2 className="h-10 w-10" />
                       <p className="font-medium">No matching patient records discovered.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPatients?.map((p: any) => (
                  <TableRow key={p.patient_id} className="group hover:bg-primary/5 transition-colors border-b/50">
                    <TableCell className="font-mono text-[10px] font-bold text-muted-foreground">
                      #{p.patient_id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary border border-primary/20">
                           {p.name.charAt(0)}
                        </div>
                        <span className="font-semibold tracking-tight">{p.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-xs">
                        <Badge variant="secondary" className="bg-muted/50 text-[10px] uppercase font-bold">{p.gender}</Badge>
                        <span className="text-muted-foreground">{p.age} Yrs</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-medium text-muted-foreground">
                      {p.contact}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)] text-[10px] font-black">
                        {p.blood_group}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(p.registration_date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </TableCell>
                    <TableCell className="text-right">
                       <button className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors">
                          <ExternalLink className="h-4 w-4" />
                       </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
}