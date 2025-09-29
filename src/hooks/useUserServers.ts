import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Server {
  id: string;
  name: string;
  icon_url: string | null;
  owner_id: string;
}

export function useUserServers(userId: string | undefined) {
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setServers([]);
      setLoading(false);
      return;
    }

    const fetchServers = async () => {
      const { data, error } = await supabase
        .from("servers")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching servers:", error);
      } else {
        setServers(data || []);
      }
      setLoading(false);
    };

    fetchServers();
  }, [userId]);

  return { servers, loading };
}
