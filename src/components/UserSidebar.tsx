"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, User, X } from "lucide-react";
import { apiClient } from "@lib/axios";
import { cn } from "@lib/utils";
import type { StoredUser } from "@type/line.type";

interface UserSidebarProps {
  readonly selectedUserId: string | null;
  readonly onSelectUser: (userId: string) => void;
  readonly onClose?: () => void;
}

const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  // Less than 24 hours
  if (diff < 24 * 60 * 60 * 1000) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  // Less than 7 days
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    return date.toLocaleDateString([], { weekday: "short" });
  }

  // More than 7 days
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
};

const UserSidebar = ({
  selectedUserId,
  onSelectUser,
  onClose,
}: UserSidebarProps) => {
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await apiClient.get("/users");
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 5000);
    return () => clearInterval(interval);
  }, [fetchUsers]);

  return (
    <div className="w-full h-full bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-700 flex flex-col">
      <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
        <h2 className="font-semibold text-base sm:text-lg flex items-center gap-2">
          <Users className="w-5 h-5" />
          Conversations
        </h2>
        {/* Close button - visible only on mobile */}
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading && (
          <div className="flex items-center justify-center h-32 text-zinc-400">
            Loading...
          </div>
        )}
        {!isLoading && users.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-zinc-400 px-4">
            <User className="w-8 h-8 mb-2" />
            <p className="text-sm text-center">
              No conversations yet.
              <br />
              Users will appear when they message you.
            </p>
          </div>
        )}
        {!isLoading &&
          users.length > 0 &&
          users.map((user) => (
            <button
              key={user.id}
              onClick={() => onSelectUser(user.id)}
              className={cn(
                "w-full px-3 sm:px-4 py-3 flex items-center gap-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left",
                selectedUserId === user.id &&
                  "bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500"
              )}
            >
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold text-sm sm:text-base shrink-0">
                {user.displayName?.[0]?.toUpperCase() ||
                  user.id.slice(-2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate text-sm sm:text-base">
                  {user.displayName || `User ${user.id.slice(-6)}`}
                </p>
                <p className="text-xs text-zinc-400 truncate">
                  {formatTime(user.lastMessageAt)}
                </p>
              </div>
            </button>
          ))}
      </div>
    </div>
  );
};

export default UserSidebar;
