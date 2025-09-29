import { Hash, Volume2, ChevronDown, Settings, UserPlus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice';
}

interface ChannelListProps {
  serverName: string;
  channels: Channel[];
  activeChannel: string;
  onChannelSelect: (channelId: string) => void;
}

export function ChannelList({ serverName, channels, activeChannel, onChannelSelect }: ChannelListProps) {
  const textChannels = channels.filter(c => c.type === 'text');
  const voiceChannels = channels.filter(c => c.type === 'voice');

  return (
    <div className="w-60 flex flex-col bg-[hsl(var(--channel-bar))] border-r border-border">
      <div className="h-12 px-4 flex items-center justify-between border-b border-border shadow-sm">
        <h2 className="font-bold text-foreground truncate">{serverName}</h2>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          <div className="flex items-center justify-between px-2 py-1 mb-1">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase">Text Channels</h3>
            <Button variant="ghost" size="icon" className="h-4 w-4">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          {textChannels.map((channel) => (
            <Button
              key={channel.id}
              variant="ghost"
              className={`w-full justify-start gap-2 mb-0.5 ${
                activeChannel === channel.id
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
              onClick={() => onChannelSelect(channel.id)}
            >
              <Hash className="h-4 w-4" />
              <span className="truncate">{channel.name}</span>
            </Button>
          ))}

          <div className="flex items-center justify-between px-2 py-1 mb-1 mt-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase">Voice Channels</h3>
            <Button variant="ghost" size="icon" className="h-4 w-4">
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {voiceChannels.map((channel) => (
            <Button
              key={channel.id}
              variant="ghost"
              className={`w-full justify-start gap-2 mb-0.5 ${
                activeChannel === channel.id
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
              onClick={() => onChannelSelect(channel.id)}
            >
              <Volume2 className="h-4 w-4" />
              <span className="truncate">{channel.name}</span>
            </Button>
          ))}
        </div>
      </ScrollArea>

      <div className="p-2 border-t border-border bg-[hsl(var(--server-bar))]">
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-sm font-semibold text-primary-foreground">U</span>
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-[hsl(var(--online))] rounded-full border-2 border-[hsl(var(--server-bar))]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">User</p>
            <p className="text-xs text-muted-foreground truncate">#0001</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
