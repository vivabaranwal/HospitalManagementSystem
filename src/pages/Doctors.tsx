import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Stethoscope } from "lucide-react";

const doctors = [
  { id: 1, name: "Dr. Smith", specialty: "Cardiology", experience: "15 years", patients: 42, status: "Available" },
  { id: 2, name: "Dr. Patel", specialty: "Neurology", experience: "12 years", patients: 38, status: "Available" },
  { id: 3, name: "Dr. Kim", specialty: "Orthopedics", experience: "8 years", patients: 29, status: "In Surgery" },
  { id: 4, name: "Dr. Adams", specialty: "Oncology", experience: "20 years", patients: 51, status: "Available" },
  { id: 5, name: "Dr. Lee", specialty: "Dermatology", experience: "6 years", patients: 35, status: "On Leave" },
  { id: 6, name: "Dr. Wang", specialty: "Gynecology", experience: "10 years", patients: 44, status: "Available" },
];

const statusColor: Record<string, string> = {
  Available: "bg-success/15 text-success border-success/20",
  "In Surgery": "bg-warning/15 text-warning border-warning/20",
  "On Leave": "bg-muted text-muted-foreground border-border",
};

export default function Doctors() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Doctors</h1>
          <p className="text-muted-foreground text-sm mt-1">Medical staff directory</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map((doc) => (
            <div key={doc.id} className="bg-card rounded-lg border p-5 hover:shadow-sm transition-shadow animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-11 w-11 rounded-full bg-accent flex items-center justify-center">
                  <Stethoscope className="h-5 w-5" style={{ stroke: "url(#pink-gradient)" }} />
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
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Patients</span>
                  <span className="font-medium">{doc.patients}</span>
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
