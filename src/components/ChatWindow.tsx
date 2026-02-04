"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, Loader2, Check, AlertCircle, Send } from "lucide-react";
import { apiClient, isAxiosError } from "@lib/axios";
import { cn } from "@lib/utils";
import { Button } from "@/components/ui/button";
import type { ChatMessage } from "@type/line.type";

interface ChatWindowProps {
  readonly className?: string;
  readonly userId: string;
  readonly userName?: string;
}

const ChatWindow = ({ className = "", userId, userName }: ChatWindowProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([]);
    setError(null);
  }, [userId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = useCallback(async () => {
    try {
      const { data } = await apiClient.get(`/messages?userId=${userId}`);

      if (!data.success) return;

      const fetchedMessages: ChatMessage[] = data.messages.map(
        (msg: {
          id: string;
          text: string;
          timestamp: number;
          direction: "incoming" | "outgoing";
        }) => ({
          id: msg.id,
          text: msg.text,
          sender:
            msg.direction === "outgoing"
              ? ("user" as const)
              : ("line" as const),
          timestamp: new Date(msg.timestamp),
          status: "sent" as const,
        })
      );

      setMessages((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const localUserTexts = new Set(
          prev
            .filter((m) => m.id.startsWith("local_") && m.sender === "user")
            .map((m) => m.text)
        );

        const localMessages = prev.filter((m) => m.id.startsWith("local_"));
        const serverMessages = fetchedMessages.filter((m) => {
          if (existingIds.has(m.id)) return false;
          if (m.sender === "user" && localUserTexts.has(m.text)) return false;
          return true;
        });

        const allServerIds = new Set(fetchedMessages.map((m) => m.id));
        const existingServerMessages = prev.filter(
          (m) => !m.id.startsWith("local_") && allServerIds.has(m.id)
        );

        return [
          ...existingServerMessages,
          ...serverMessages,
          ...localMessages,
        ].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      });
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  }, [userId]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const messageText = inputText.trim();
    setInputText("");
    setError(null);

    const newMessage: ChatMessage = {
      id: `local_${Date.now()}`,
      text: messageText,
      sender: "user",
      timestamp: new Date(),
      status: "sending",
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const { data } = await apiClient.post("/send", {
        message: messageText,
        userId,
      });

      if (data.success) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === newMessage.id ? { ...msg, status: "sent" } : msg
          )
        );
      } else {
        throw new Error(data.error || "Failed to send message");
      }
    } catch (err) {
      const errorMessage = isAxiosError(err)
        ? err.response?.data?.error || err.message
        : "Failed to send message";
      setError(errorMessage);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: "failed" } : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const retryMessage = (message: ChatMessage) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== message.id));
    setInputText(message.text);
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden",
        className
      )}
    >
      <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-3 sm:py-4 bg-linear-to-r from-green-500 to-green-600 text-white">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center font-semibold text-sm sm:text-base shrink-0">
          {userName?.[0]?.toUpperCase() || userId.slice(-2).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="font-semibold text-base sm:text-lg truncate">
            {userName || `User ${userId.slice(-6)}`}
          </h1>
          <p className="text-xs sm:text-sm text-white/80">LINE Chat</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 sm:space-y-4 bg-zinc-50 dark:bg-zinc-800">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-400 px-4">
            <MessageCircle
              className="w-12 h-12 sm:w-16 sm:h-16 mb-4"
              strokeWidth={1.5}
            />
            <p className="text-center text-sm sm:text-base">
              No messages yet.
              <br />
              Start a conversation!
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.sender === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] sm:max-w-[80%] rounded-2xl px-3 sm:px-4 py-2",
                  message.sender === "user"
                    ? "bg-green-500 text-white rounded-br-md"
                    : "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white rounded-bl-md shadow-sm"
                )}
              >
                <p className="wrap-break-words text-sm sm:text-base">
                  {message.text}
                </p>
                <div
                  className={cn(
                    "flex items-center gap-1 mt-1 text-xs",
                    message.sender === "user"
                      ? "text-white/70"
                      : "text-zinc-400"
                  )}
                >
                  <span>
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {message.sender === "user" && (
                    <>
                      {message.status === "sending" && (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      )}
                      {message.status === "sent" && (
                        <Check className="w-3 h-3" />
                      )}
                      {message.status === "failed" && (
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => retryMessage(message)}
                          className="text-red-300 hover:text-white h-auto p-0"
                        >
                          <AlertCircle className="w-3 h-3" />
                          <span>Retry</span>
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="p-2 sm:p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-700">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            disabled={isLoading}
            className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-zinc-100 dark:bg-zinc-800 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-green-500 text-zinc-900 dark:text-white placeholder-zinc-400 disabled:opacity-50 text-sm sm:text-base"
          />
          <Button
            onClick={sendMessage}
            disabled={!inputText.trim() || isLoading}
            size="icon-lg"
            className="rounded-full bg-green-500 hover:bg-green-600 w-10 h-10 sm:w-12 sm:h-12 shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            ) : (
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
