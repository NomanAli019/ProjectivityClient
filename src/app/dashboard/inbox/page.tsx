"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react"; 
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

interface Chat {
  notification_id: number;
  message: string;
  project_title: string | null;
  task_title: string | null;
  task_description: string | null;
  created_at: string;
  is_read: number;
}

export default function InboxPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [search, setSearch] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);

  // ✅ Fetch notifications dynamically
  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const res = await fetch("/api/admingetibx", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) throw new Error("Failed to fetch inbox");

        const data = await res.json();
        // 👇 FIX: setChats only with notifications array
        setChats(data.notifications || []);
      } catch (err) {
        console.error("❌ Error fetching inbox:", err);
      }
    };

    fetchInbox();
  }, []);

  // Badge color (read/unread)
  const getBadgeColor = (isRead: number) => {
    return isRead === 0
      ? "text-red-600 bg-red-100"
      : "text-green-600 bg-green-100";
  };

  // Filter chats based on search
  const filteredChats = chats.filter(
    (chat) =>
      chat.message.toLowerCase().includes(search.toLowerCase()) ||
      (chat.task_title || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-white text-black font-sans">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <Header username="Admin Panel" onMenuClick={() => setSidebarOpen(true)} />

        {/* Inbox Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 h-[calc(100vh-100px)]">
          {/* Chat List */}
          <div
            className={`bg-gray-50 rounded-xl shadow p-4 flex flex-col overflow-hidden ${
              activeChat ? "hidden md:flex" : "flex"
            }`}
          >
            <h2 className="text-lg font-bold mb-4">📥 Inbox</h2>

            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search chats..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full mb-4 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="overflow-y-auto">
              {filteredChats.length > 0 ? (
                filteredChats.map((chat) => (
                  <div
                    key={chat.notification_id}
                    onClick={() => setActiveChat(chat)}
                    className={`p-4 rounded-lg cursor-pointer mb-3 border transition ${
                      activeChat?.notification_id === chat.notification_id
                        ? "bg-blue-50 border-blue-400 shadow-md"
                        : "hover:bg-gray-100 border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(
                          chat.is_read
                        )}`}
                      >
                        {chat.message}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {new Date(chat.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm truncate">
                      Status: {chat.is_read === 0 ? "Unread" : "Read"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm text-center mt-10">
                  No notifications found
                </p>
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div
            className={`md:col-span-2 bg-gray-50 rounded-xl shadow flex flex-col ${
              activeChat ? "flex" : "hidden md:flex"
            }`}
          >
            {activeChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-t-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Back button (only on mobile) */}
                    <button
                      onClick={() => setActiveChat(null)}
                      className="md:hidden p-2 rounded-full hover:bg-blue-600 transition"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <h3 className="font-semibold">
                      {activeChat.project_title || "No Project"}
                    </h3>
                  </div>
                  <span className="text-xs opacity-80">
                    {new Date(activeChat.created_at).toLocaleString()}
                  </span>
                </div>

                {/* Task Info */}
                <div className="flex-1 p-6 overflow-y-auto space-y-5">
                  <div className="bg-white shadow rounded-xl p-4">
                    <h4 className="font-bold text-lg text-gray-800">
                      {activeChat.task_title || "No Task Title"}
                    </h4>
                    <p className="text-gray-600 mt-2">
                      {activeChat.task_description || "No Task Description"}
                    </p>
                  </div>
                </div>

                {/* Input (Disabled since it's just notifications) */}
                <div className="p-4 border-t bg-white flex justify-center text-gray-400 text-sm">
                  🔔 This is a notification view (no replies)
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                👈 Select a notification to view details
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
