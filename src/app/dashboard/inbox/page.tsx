"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react"; // ✅ back icon
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  type: "reminder" | "task" | "application" | "message";
}

interface Message {
  id: number;
  sender: string;
  text: string;
  type: "incoming" | "outgoing";
}

const chats: Chat[] = [
  {
    id: 1,
    name: "Meeting Reminder",
    lastMessage: "In next 6 hours, Reminder sent to 24 members of this project.",
    time: "2:45 PM",
    type: "reminder",
  },
  {
    id: 2,
    name: "Task Completed",
    lastMessage: "Frontend in Next.js completed successfully ✔️",
    time: "1:20 PM",
    type: "task",
  },
  {
    id: 3,
    name: "Job Application",
    lastMessage: "Frontend Developer role has new applicants.",
    time: "Yesterday",
    type: "application",
  },
  {
    id: 4,
    name: "Client Message",
    lastMessage: "Send me the invoice by tomorrow.",
    time: "Monday",
    type: "message",
  },
];

const sampleMessages: Message[] = [
  { id: 1, sender: "Client", text: "Hey, how’s it going?", type: "incoming" },
  { id: 2, sender: "You", text: "All good bro, working on the project 🚀", type: "outgoing" },
  { id: 3, sender: "Client", text: "Perfect, let me know once done.", type: "incoming" },
];

export default function InboxPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [search, setSearch] = useState("");

  // Badge colors based on type
  const getBadgeColor = (type: Chat["type"]) => {
    switch (type) {
      case "reminder":
        return "text-red-600 bg-red-100";
      case "task":
        return "text-green-600 bg-green-100";
      case "application":
        return "text-purple-600 bg-purple-100";
      default:
        return "text-blue-600 bg-blue-100";
    }
  };

  // Filter chats based on search
  const filteredChats = chats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(search.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-white text-black font-sans">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <Header username="Muhammad Jazib" onMenuClick={() => setSidebarOpen(true)} />

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
                    key={chat.id}
                    onClick={() => setActiveChat(chat)}
                    className={`p-4 rounded-lg cursor-pointer mb-3 border transition ${
                      activeChat?.id === chat.id
                        ? "bg-blue-50 border-blue-400 shadow-md"
                        : "hover:bg-gray-100 border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(
                          chat.type
                        )}`}
                      >
                        {chat.name}
                      </span>
                      <span className="text-gray-500 text-xs">{chat.time}</span>
                    </div>
                    <p className="text-gray-700 text-sm truncate">{chat.lastMessage}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm text-center mt-10">No chats found</p>
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
                    <h3 className="font-semibold">{activeChat.name}</h3>
                  </div>
                  <span className="text-xs opacity-80">{activeChat.time}</span>
                </div>

                {/* Messages */}
                <div className="flex-1 p-6 overflow-y-auto space-y-5">
                  {sampleMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.type === "outgoing" ? "items-end" : "items-start"
                      }`}
                    >
                      {/* Sender Name */}
                      <span className="text-xs text-gray-500 font-semibold mb-1">
                        {msg.sender}
                      </span>

                      {/* Message Bubble */}
                      <div
                        className={`px-4 py-2 rounded-2xl shadow max-w-xs ${
                          msg.type === "outgoing"
                            ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                            : "bg-gray-200 text-black"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <div className="p-4 border-t bg-white flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg font-medium">
                    Send
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                👈 Select a chat to start messaging
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
