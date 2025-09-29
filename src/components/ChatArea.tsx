import { useState } from "react";
import { Hash, Users, Bell, Pin, Search, Send, Plus, Gift, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  user: string;
  avatar: string;
  content: string;
  timestamp: string;
}

interface ChatAreaProps {
  channelName: string;
  messages: Message[];
  onSendMessage: (content: string) => void;
}

export function ChatArea({ channelName, messages, onSendMessage }: ChatAreaProps) {
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="h-12 px-4 flex items-center justify-between border-b border-border shadow-sm">
        <div className="flex items-center gap-2">
          <Hash className="h-5 w-5 text-muted-foreground" />
          <h2 className="font-bold text-foreground">{channelName}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Pin className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Users className="h-5 w-5" />
          </Button>
          <div className="w-40">
            <Input
              placeholder="Search"
              className="h-8 bg-secondary border-0"
            />
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex gap-3 hover:bg-muted/50 p-2 rounded-lg transition-colors">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-primary-foreground">
                  {message.user.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-foreground">{message.user}</span>
                  <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                </div>
                <p className="text-foreground break-words">{message.content}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4">
        <div className="flex items-end gap-2 bg-muted rounded-lg p-3">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Plus className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message #${channelName}`}
              className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Gift className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Smile className="h-5 w-5" />
          </Button>
          <Button 
            size="icon" 
            className="h-8 w-8 bg-primary hover:bg-primary/90"
            onClick={handleSend}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
