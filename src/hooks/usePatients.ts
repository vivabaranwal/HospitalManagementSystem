import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function usePatients() {
  return useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const { data, error } = await supabase.from("patients").select("*, doctors(name)").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}
