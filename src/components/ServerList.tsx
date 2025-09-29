import { Plus, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Server {
  id: string;
  name: string;
  icon?: string;
  initial: string;
}

interface ServerListProps {
  servers: Server[];
  activeServer: string;
  onServerSelect: (serverId: string) => void;
  onCreateServer: () => void;
}

export function ServerList({ servers, activeServer, onServerSelect, onCreateServer }: ServerListProps) {
  return (
    <div className="w-[72px] flex flex-col items-center py-3 gap-2 bg-[hsl(var(--server-bar))] border-r border-border">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-[24px] bg-primary hover:bg-primary hover:rounded-[16px] transition-all duration-200"
            onClick={() => onServerSelect('home')}
          >
            <Hash className="w-6 h-6 text-primary-foreground" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">Home</TooltipContent>
      </Tooltip>

      <div className="w-8 h-0.5 bg-border rounded-full mb-2" />

      <ScrollArea className="flex-1 w-full">
        <div className="flex flex-col items-center gap-2 px-3">
          {servers.map((server) => (
            <Tooltip key={server.id}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`w-12 h-12 rounded-[24px] hover:rounded-[16px] transition-all duration-200 ${
                    activeServer === server.id
                      ? 'bg-primary text-primary-foreground rounded-[16px]'
                      : 'bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground'
                  }`}
                  onClick={() => onServerSelect(server.id)}
                >
                  {server.icon ? (
                    <img src={server.icon} alt={server.name} className="w-full h-full rounded-[inherit]" />
                  ) : (
                    <span className="text-lg font-semibold">{server.initial}</span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">{server.name}</TooltipContent>
            </Tooltip>
          ))}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-12 h-12 rounded-[24px] hover:rounded-[16px] bg-secondary hover:bg-[hsl(var(--online))] text-[hsl(var(--online))] hover:text-foreground transition-all duration-200"
                onClick={onCreateServer}
              >
                <Plus className="w-6 h-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Add a Server</TooltipContent>
          </Tooltip>
        </div>
      </ScrollArea>
    </div>
  );
}
