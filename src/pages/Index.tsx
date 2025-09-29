import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ServerList } from "@/components/ServerList";
import { ChannelList } from "@/components/ChannelList";
import { ChatArea } from "@/components/ChatArea";
import { CreateServerDialog } from "@/components/CreateServerDialog";
import { useAuth } from "@/hooks/useAuth";
import { useUserServers } from "@/hooks/useUserServers";
import { useServerChannels } from "@/hooks/useServerChannels";
import { useRealtimeMessages } from "@/hooks/useRealtimeMessages";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { servers, loading: serversLoading } = useUserServers(user?.id);
  
  const [activeServer, setActiveServer] = useState<string | null>(null);
  const [activeChannel, setActiveChannel] = useState<string | null>(null);
  const [createServerOpen, setCreateServerOpen] = useState(false);

  const { channels } = useServerChannels(activeServer);
  const { messages, loading: messagesLoading } = useRealtimeMessages(activeChannel);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (servers.length > 0 && !activeServer) {
      setActiveServer(servers[0].id);
    }
  }, [servers, activeServer]);

  useEffect(() => {
    if (channels.length > 0 && !activeChannel) {
      const firstTextChannel = channels.find(c => c.type === 'text');
      if (firstTextChannel) {
        setActiveChannel(firstTextChannel.id);
      }
    }
  }, [channels, activeChannel]);

  const handleCreateServer = async (name: string) => {
    if (!user) return;

    try {
      // Create server
      const { data: serverData, error: serverError } = await supabase
        .from("servers")
        .insert({
          name,
          owner_id: user.id,
        })
        .select()
        .single();

      if (serverError) throw serverError;

      // Add creator as member
      const { error: memberError } = await supabase
        .from("server_members")
        .insert({
          server_id: serverData.id,
          user_id: user.id,
        });

      if (memberError) throw memberError;

      // Create default channels
      const { error: channelsError } = await supabase
        .from("channels")
        .insert([
          { server_id: serverData.id, name: "general", type: "text" },
          { server_id: serverData.id, name: "random", type: "text" },
          { server_id: serverData.id, name: "General", type: "voice" },
        ]);

      if (channelsError) throw channelsError;

      toast.success(`Server "${name}" created successfully!`);
      setActiveServer(serverData.id);
      
      // Refresh servers list
      window.location.reload();
    } catch (error) {
      console.error("Error creating server:", error);
      toast.error("Failed to create server");
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!user || !activeChannel) return;

    try {
      const { error } = await supabase
        .from("messages")
        .insert({
          channel_id: activeChannel,
          user_id: user.id,
          content,
        });

      if (error) throw error;
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  if (authLoading || serversLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Loading...</h2>
          <p className="text-muted-foreground">Getting your workspace ready</p>
        </div>
      </div>
    );
  }

  const activeServerData = servers.find(s => s.id === activeServer);
  const activeChannelData = channels.find(c => c.id === activeChannel);

  const serverList = servers.map(s => ({
    id: s.id,
    name: s.name,
    icon: s.icon_url || undefined,
    initial: s.name.charAt(0).toUpperCase(),
  }));

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <ServerList
        servers={serverList}
        activeServer={activeServer || ''}
        onServerSelect={setActiveServer}
        onCreateServer={() => setCreateServerOpen(true)}
      />
      <ChannelList
        serverName={activeServerData?.name || 'Server'}
        channels={channels}
        activeChannel={activeChannel || ''}
        onChannelSelect={setActiveChannel}
      />
      <ChatArea
        channelName={activeChannelData?.name || 'channel'}
        messages={messages}
        onSendMessage={handleSendMessage}
        loading={messagesLoading}
      />
      <CreateServerDialog
        open={createServerOpen}
        onOpenChange={setCreateServerOpen}
        onCreateServer={handleCreateServer}
      />
    </div>
  );
};

export default Index;
