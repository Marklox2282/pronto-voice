import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";

interface Message {
  id: string;
  channel_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles?: {
    username: string;
    avatar_url: string | null;
  };
}

export function useRealtimeMessages(channelId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!channelId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    let channel: RealtimeChannel;

    const setupRealtimeSubscription = async () => {
      // Fetch initial messages
      const { data, error } = await supabase
        .from("messages")
        .select(`
          *,
          profiles (
            username,
            avatar_url
          )
        `)
        .eq("channel_id", channelId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
      } else {
        setMessages(data || []);
      }
      setLoading(false);

      // Subscribe to new messages
      channel = supabase
        .channel(`messages:${channelId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `channel_id=eq.${channelId}`,
          },
          async (payload) => {
            // Fetch the profile data for the new message
            const { data: profileData } = await supabase
              .from("profiles")
              .select("username, avatar_url")
              .eq("id", payload.new.user_id)
              .single();

            const newMessage = {
              ...payload.new,
              profiles: profileData,
            } as Message;

            setMessages((current) => [...current, newMessage]);
          }
        )
        .subscribe();
    };

    setupRealtimeSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [channelId]);

  return { messages, loading };
}
