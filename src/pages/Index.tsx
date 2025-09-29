import { useState } from "react";
import { ServerList } from "@/components/ServerList";
import { ChannelList } from "@/components/ChannelList";
import { ChatArea } from "@/components/ChatArea";
import { CreateServerDialog } from "@/components/CreateServerDialog";
import { toast } from "sonner";

interface Server {
  id: string;
  name: string;
  icon?: string;
  initial: string;
}

interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice';
}

interface Message {
  id: string;
  user: string;
  avatar: string;
  content: string;
  timestamp: string;
}

const Index = () => {
  const [servers, setServers] = useState<Server[]>([
    { id: '1', name: 'Gaming Squad', initial: 'GS' },
    { id: '2', name: 'Study Group', initial: 'SG' },
  ]);

  const [activeServer, setActiveServer] = useState('1');
  const [activeChannel, setActiveChannel] = useState('general');
  const [createServerOpen, setCreateServerOpen] = useState(false);

  const channels: Channel[] = [
    { id: 'general', name: 'general', type: 'text' },
    { id: 'random', name: 'random', type: 'text' },
    { id: 'announcements', name: 'announcements', type: 'text' },
    { id: 'voice-general', name: 'General', type: 'voice' },
    { id: 'voice-gaming', name: 'Gaming', type: 'voice' },
  ];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      user: 'Alex',
      avatar: 'A',
      content: 'Hey everyone! Welcome to the server 🎉',
      timestamp: 'Today at 10:30 AM',
    },
    {
      id: '2',
      user: 'Jordan',
      avatar: 'J',
      content: 'Thanks for the invite! Excited to be here.',
      timestamp: 'Today at 10:32 AM',
    },
    {
      id: '3',
      user: 'Sam',
      avatar: 'S',
      content: 'Anyone up for gaming tonight?',
      timestamp: 'Today at 10:35 AM',
    },
  ]);

  const handleCreateServer = (name: string) => {
    const newServer: Server = {
      id: Date.now().toString(),
      name,
      initial: name.charAt(0).toUpperCase(),
    };
    setServers([...servers, newServer]);
    setActiveServer(newServer.id);
    toast.success(`Server "${name}" created successfully!`);
  };

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      user: 'You',
      avatar: 'Y',
      content,
      timestamp: new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }),
    };
    setMessages([...messages, newMessage]);
  };

  const activeServerData = servers.find(s => s.id === activeServer);
  const activeChannelData = channels.find(c => c.id === activeChannel);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <ServerList
        servers={servers}
        activeServer={activeServer}
        onServerSelect={setActiveServer}
        onCreateServer={() => setCreateServerOpen(true)}
      />
      <ChannelList
        serverName={activeServerData?.name || 'Server'}
        channels={channels}
        activeChannel={activeChannel}
        onChannelSelect={setActiveChannel}
      />
      <ChatArea
        channelName={activeChannelData?.name || 'channel'}
        messages={messages}
        onSendMessage={handleSendMessage}
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
