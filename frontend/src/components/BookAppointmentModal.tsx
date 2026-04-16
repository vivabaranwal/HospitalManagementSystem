import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAppointment, fetchPatients, fetchDoctors } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarPlus, Loader2, Calendar, Clock } from "lucide-react";
import { toast } from "sonner";

const INITIAL = { patient_id: "", doctor_id: "", date: "", time: "" };

export function BookAppointmentModal() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(INITIAL);
  const queryClient = useQueryClient();

  const { data: patients = [] } = useQuery({
    queryKey: ["patients"],
    queryFn: fetchPatients,
    enabled: open,
  });

  const { data: doctors = [] } = useQuery({
    queryKey: ["doctors"],
    queryFn: fetchDoctors,
    enabled: open,
  });

  const mutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast.success("Appointment scheduled successfully!");
      setForm(INITIAL);
      setOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to schedule appointment");
    },
  });

  const set = (key: string) => (val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.patient_id || !form.doctor_id) {
      toast.error("Please select both a patient and a doctor.");
      return;
    }
    mutation.mutate(form);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setForm(INITIAL); }}>
      <DialogTrigger asChild>
        <Button className="gap-2 shadow-[0_0_20px_rgba(var(--primary),0.2)]">
          <CalendarPlus className="h-4 w-4" /> Book Appointment
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] border-primary/20 bg-card/95 backdrop-blur-xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tight">
              Schedule Consultation
            </DialogTitle>
            <DialogDescription>
              Assign a patient to a specialist and lock in a time slot.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-6">
            {/* Patient */}
            <div className="space-y-2">
              <Label className="font-semibold">Patient</Label>
              <Select value={form.patient_id} onValueChange={set("patient_id")} required>
                <SelectTrigger className="bg-muted/30">
                  <SelectValue placeholder="Select patient…" />
                </SelectTrigger>
                <SelectContent className="max-h-56 overflow-y-auto">
                  {(patients as any[]).map((p: any) => (
                    <SelectItem key={p.patient_id} value={String(p.patient_id)}>
                      {p.name} <span className="text-muted-foreground text-xs ml-1">#{p.patient_id}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Doctor */}
            <div className="space-y-2">
              <Label className="font-semibold">Specialist / Doctor</Label>
              <Select value={form.doctor_id} onValueChange={set("doctor_id")} required>
                <SelectTrigger className="bg-muted/30">
                  <SelectValue placeholder="Assign physician…" />
                </SelectTrigger>
                <SelectContent className="max-h-56 overflow-y-auto">
                  {(doctors as any[]).map((d: any) => (
                    <SelectItem key={d.doctor_id} value={String(d.doctor_id)}>
                      Dr. {d.name}
                      {d.department_name && (
                        <span className="text-muted-foreground text-xs ml-1">
                          · {d.department_name}
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date + Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-semibold flex items-center gap-2">
                  <Calendar className="h-3 w-3" /> Preferred Date
                </Label>
                <Input
                  type="date"
                  className="bg-muted/30"
                  value={form.date}
                  onChange={(e) => set("date")(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold flex items-center gap-2">
                  <Clock className="h-3 w-3" /> Time Slot
                </Label>
                <Input
                  type="time"
                  className="bg-muted/30"
                  value={form.time}
                  onChange={(e) => set("time")(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => { setOpen(false); setForm(INITIAL); }}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending} className="min-w-[140px]">
              {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mutation.isPending ? "Scheduling…" : "Confirm Schedule"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
