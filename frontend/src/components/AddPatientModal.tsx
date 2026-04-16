import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPatient } from "@/lib/api";
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
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

const INITIAL = {
  name: "",
  age: "",
  gender: "",
  contact: "",
  address: "",
  blood_group: "",
};

export function AddPatientModal() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(INITIAL);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast.success("Patient registered successfully!");
      setForm(INITIAL);
      setOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to register patient");
    },
  });

  const set = (key: string) => (val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.gender || !form.blood_group) {
      toast.error("Please fill in all required fields.");
      return;
    }
    mutation.mutate({
      name: form.name,
      age: parseInt(form.age),
      gender: form.gender,
      contact: form.contact,
      address: form.address,
      blood_group: form.blood_group,
    });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setForm(INITIAL); }}>
      <DialogTrigger asChild>
        <Button className="gap-2 shadow-[0_0_20px_rgba(var(--primary),0.2)]">
          <Plus className="h-4 w-4" /> Add Patient
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] border-primary/20 bg-card/95 backdrop-blur-xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tight">Register New Patient</DialogTitle>
            <DialogDescription>
              Enter patient demographics to create a permanent medical record.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-6">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-semibold">Full Name</Label>
              <Input
                className="col-span-3"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => set("name")(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-semibold">Age</Label>
              <Input
                className="col-span-3"
                type="number"
                placeholder="45"
                min={0}
                max={150}
                value={form.age}
                onChange={(e) => set("age")(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-semibold">Gender</Label>
              <div className="col-span-3">
                <Select value={form.gender} onValueChange={set("gender")} required>
                  <SelectTrigger className="bg-muted/30">
                    <SelectValue placeholder="Select gender…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-semibold">Blood Group</Label>
              <div className="col-span-3">
                <Select value={form.blood_group} onValueChange={set("blood_group")} required>
                  <SelectTrigger className="bg-muted/30">
                    <SelectValue placeholder="Select blood group…" />
                  </SelectTrigger>
                  <SelectContent>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                      <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-semibold">Contact</Label>
              <Input
                className="col-span-3"
                placeholder="+91 98765 43210"
                value={form.contact}
                onChange={(e) => set("contact")(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-semibold">Address</Label>
              <Input
                className="col-span-3"
                placeholder="123 Medical Way"
                value={form.address}
                onChange={(e) => set("address")(e.target.value)}
              />
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
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mutation.isPending ? "Registering…" : "Finalize Registration"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
