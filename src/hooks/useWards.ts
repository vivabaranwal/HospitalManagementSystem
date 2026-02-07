import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useWards() {
  return useQuery({
    queryKey: ["wards"],
    queryFn: async () => {
      const { data, error } = await supabase.from("wards").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });
}
