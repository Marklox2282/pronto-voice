import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreateServerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateServer: (name: string) => void;
}

export function CreateServerDialog({ open, onOpenChange, onCreateServer }: CreateServerDialogProps) {
  const [serverName, setServerName] = useState("");

  const handleCreate = () => {
    if (serverName.trim()) {
      onCreateServer(serverName);
      setServerName("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle>Create Your Server</DialogTitle>
          <DialogDescription>
            Give your server a name and start inviting your friends!
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Server Name</Label>
            <Input
              id="name"
              value={serverName}
              onChange={(e) => setServerName(e.target.value)}
              placeholder="My Awesome Server"
              className="bg-secondary border-border"
              onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90">
            Create Server
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
