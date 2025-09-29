import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Channel {
  id: string;
  server_id: string;
  name: string;
  type: 'text' | 'voice';
}

export function useServerChannels(serverId: string | null) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!serverId) {
      setChannels([]);
      setLoading(false);
      return;
    }

    const fetchChannels = async () => {
      const { data, error } = await supabase
        .from("channels")
        .select("*")
        .eq("server_id", serverId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching channels:", error);
      } else {
        setChannels((data || []) as Channel[]);
      }
      setLoading(false);
    };

    fetchChannels();
  }, [serverId]);

  return { channels, loading };
}
