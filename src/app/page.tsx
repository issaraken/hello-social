"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageCircle, Menu } from "lucide-react";
import ChatWindow from "@components/ChatWindow";
import UserSidebar from "@components/UserSidebar";
import BroadcastDialog from "@components/BroadcastDialog";
import { apiClient } from "@lib/axios";
import type { StoredUser } from "@type/line.type";

const Home = () => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await apiClient.get("/users");
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await fetchUsers();
    })();

    const interval = setInterval(fetchUsers, 5000);
    return () => clearInterval(interval);
  }, [fetchUsers]);

  const selectedUser = users.find((u) => u.id === selectedUserId);

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId);
    setSidebarOpen(false);
  };

  return (
    <div className="h-screen flex bg-zinc-100 dark:bg-zinc-900 relative">
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black/50 z-40 md:hidden cursor-default"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      <div
        className={`
          fixed md:relative inset-y-0 left-0 z-50
          w-80 shrink-0
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <UserSidebar
          selectedUserId={selectedUserId}
          onSelectUser={handleSelectUser}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-14 px-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden md:block" />
          <BroadcastDialog />
        </div>

        <div className="flex-1 p-2 sm:p-4 overflow-hidden">
          {selectedUserId ? (
            <ChatWindow
              className="h-full"
              userId={selectedUserId}
              userName={selectedUser?.displayName}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-zinc-400 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl px-4">
              <MessageCircle
                className="w-12 h-12 sm:w-16 sm:h-16 mb-4"
                strokeWidth={1.5}
              />
              <p className="text-base sm:text-lg font-medium text-center">
                Select a conversation
              </p>
              <p className="text-xs sm:text-sm text-center">
                Choose a user from the sidebar to start chatting
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
