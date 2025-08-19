"use client";

import { useState } from "react";
import { Plus, MoreHorizontal } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

type Member = {
  name: string;
  role: string;
  added: string;
  email: string;
  status: "Invited" | "Accepted" | "Denied";
};

const initialMembers: Member[] = [
  {
    name: "Muhammad Jazib",
    role: "Frontend",
    added: "7 July 2025",
    email: "mjxdex@gmail.com",
    status: "Invited",
  },
  {
    name: "Basit Ijaz",
    role: "Backend",
    added: "7 July 2025",
    email: "mjxdex@gmail.com",
    status: "Accepted",
  },
  {
    name: "Haya Fatima",
    role: "Unit Testing",
    added: "28 July 2025",
    email: "mjxdex@gmail.com",
    status: "Accepted",
  },
  {
    name: "Sara",
    role: "UI & UX",
    added: "1 July 2025",
    email: "mjxdex@gmail.com",
    status: "Denied",
  },
];

export default function MembersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [members] = useState<Member[]>(initialMembers);

  return (
    <div className="min-h-screen flex bg-white text-black font-sans">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <Header
          username="Muhammad Jazib"
          onMenuClick={() => setSidebarOpen(true)}
        />

        <div className="mt-6">
          {/* Page Title Row */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-semibold">Members</h1>
            <button className="flex items-center gap-1 bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-2 rounded-lg text-sm font-medium shadow">
              <Plus size={16} /> Add Member
            </button>
          </div>

          {/* Divider */}
          <hr className="border-gray-300 mb-4" />

          {/* Members Table */}
          <div className="overflow-x-auto">
            <div className="min-w-[600px] bg-white p-3 rounded-lg">
              {/* Header */}
              <div className="grid grid-cols-6 gap-[5px] text-gray-700 font-semibold text-sm">
                <div className="bg-gray-100 px-2 py-2 rounded">Name</div>
                <div className="bg-gray-100 px-2 py-2 rounded">Role</div>
                <div className="bg-gray-100 px-2 py-2 rounded">Added</div>
                <div className="bg-gray-100 px-2 py-2 rounded">Email</div>
                <div className="bg-gray-100 px-2 py-2 rounded">Status</div>
                <div className="bg-gray-100 px-2 py-2 rounded">Action</div>
              </div>

              {/* Rows */}
              <div className="mt-2 flex flex-col gap-2">
                {members.map((member, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-6 gap-[5px] text-sm"
                  >
                    <div className="bg-gray-100 px-2 py-2 rounded">{member.name}</div>
                    <div className="bg-gray-100 px-2 py-2 rounded">{member.role}</div>
                    <div className="bg-gray-100 px-2 py-2 rounded">{member.added}</div>
                    <div className="bg-gray-100 px-2 py-2 rounded">{member.email}</div>
                    <div className="bg-gray-100 px-2 py-2 rounded">
                      <span
                        className={`${
                          member.status === "Invited"
                            ? "text-purple-500"
                            : member.status === "Accepted"
                            ? "text-cyan-600"
                            : "text-red-500"
                        }`}
                      >
                        {member.status}
                      </span>
                    </div>
                    <div className="bg-gray-100 px-2 py-2 rounded">
                      <button className="p-1 rounded hover:bg-gray-200">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
