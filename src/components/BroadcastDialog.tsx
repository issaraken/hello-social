"use client";

import { useState } from "react";
import { Megaphone, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { apiClient } from "@lib/axios";
import { cn } from "@lib/utils";

const BroadcastDialog = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleBroadcast = async () => {
    if (!message.trim()) return;

    setIsSending(true);
    setResult(null);

    try {
      const { data } = await apiClient.post("/broadcast", {
        message: message.trim(),
      });

      if (data.success) {
        setResult({
          success: true,
          message: "Broadcast sent successfully!",
        });
        setMessage("");
        setTimeout(() => {
          setOpen(false);
          setResult(null);
        }, 1000);
      } else {
        setResult({
          success: false,
          message: data.error || "Failed to send broadcast",
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to send broadcast",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-500 hover:bg-green-600">
          <Megaphone className="w-4 h-4 mr-2" />
          Broadcast
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Broadcast Message</DialogTitle>
          <DialogDescription>
            Send a message to all your LINE followers at once.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            placeholder="Type your broadcast message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            disabled={isSending}
            className="resize-none"
          />
          {result && (
            <p
              className={cn(
                "mt-2 text-sm",
                result.success ? "text-green-600" : "text-red-600"
              )}
            >
              {result.message}
            </p>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleBroadcast}
            disabled={!message.trim() || isSending}
            className="bg-green-500 hover:bg-green-600"
          >
            {isSending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Broadcast"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BroadcastDialog;
