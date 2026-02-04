"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, Loader2, Check, AlertCircle, Send } from "lucide-react";
import { apiClient, isAxiosError } from "@lib/axios";
import { cn } from "@lib/utils";
import { Button } from "@/components/ui/button";
import type { ChatMessage } from "@type/line.type";

interface ChatWindowProps {
  readonly className?: string;
}

const ChatWindow = ({ className = "" }: ChatWindowProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastFetchTimestamp = useRef<number>(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchNewMessages = useCallback(async () => {
    try {
      const { data } = await apiClient.get(
        `/messages?since=${lastFetchTimestamp.current}`
      );

      if (!data.success) return;

      lastFetchTimestamp.current = data.timestamp;
      if (data.messages.length > 0) {
        const newMessages: ChatMessage[] = data.messages.map(
          (msg: {
            id: string;
            text: string;
            timestamp: number;
            userId: string;
          }) => ({
            id: msg.id,
            text: msg.text,
            sender: msg.userId === "me" ? ("user" as const) : ("line" as const),
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

          const uniqueNewMessages = newMessages.filter((m) => {
            if (existingIds.has(m.id)) return false;
            if (m.sender === "user" && localUserTexts.has(m.text)) return false;
            return true;
          });
          return [...prev, ...uniqueNewMessages];
        });
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchNewMessages, 3000);
    return () => clearInterval(interval);
  }, [fetchNewMessages]);

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
      const { data } = await apiClient.post("/send", { message: messageText });

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
      <div className="flex items-center gap-3 px-6 py-4 bg-linear-to-r from-green-500 to-green-600 text-white">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
          </svg>
        </div>
        <div>
          <h1 className="font-semibold text-lg">LINE Chat</h1>
          <p className="text-sm text-white/80">Send messages to LINE OA</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50 dark:bg-zinc-800">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-400">
            <MessageCircle className="w-16 h-16 mb-4" strokeWidth={1.5} />
            <p className="text-center">
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
                  "max-w-[80%] rounded-2xl px-4 py-2",
                  message.sender === "user"
                    ? "bg-green-500 text-white rounded-br-md"
                    : "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white rounded-bl-md shadow-sm"
                )}
              >
                <p className="wrap-break-words">{message.text}</p>
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

      <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-700">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-green-500 text-zinc-900 dark:text-white placeholder-zinc-400 disabled:opacity-50"
          />
          <Button
            onClick={sendMessage}
            disabled={!inputText.trim() || isLoading}
            size="icon-lg"
            className="rounded-full bg-green-500 hover:bg-green-600"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
