"use client";

import { useState, useEffect } from "react";
import { Plus, MoreHorizontal } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import AddMemberPopup from "@/app/dashboard/Admember/page"; // 👈 import popup

type Member = {
  name: string;
  role: string;
  email: string;
  status: "Invited" | "Accepted" | "Actice" | string; // ✅ match backend
};

export default function MembersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  // ✅ Fetch data from backend
  const fetchMembers = async () => {
    try {
      const res = await fetch(`/api/getadminemps`, {
        method: "GET",
        credentials: "include", // send cookies to backend
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (res.ok && data.data && data.data.length > 0) {
        setMembers(data.data);
      } else {
        setMembers([]);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

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
            <button
              onClick={() => setShowPopup(true)} // 👈 open popup
              className="flex items-center gap-1 bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-2 rounded-lg text-sm font-medium shadow"
            >
              <Plus size={16} /> Add Member
            </button>
          </div>

          {/* Divider */}
          <hr className="border-gray-300 mb-4" />

          {/* Members Table */}
          <div className="overflow-x-auto">
            <div className="min-w-[600px] bg-white p-3 rounded-lg">
              {/* Header */}
              <div className="grid grid-cols-5 gap-[5px] text-gray-700 font-semibold text-sm">
                <div className="bg-gray-100 px-2 py-2 rounded">Name</div>
                <div className="bg-gray-100 px-2 py-2 rounded">Role</div>
                <div className="bg-gray-100 px-2 py-2 rounded">Email</div>
                <div className="bg-gray-100 px-2 py-2 rounded">Status</div>
                <div className="bg-gray-100 px-2 py-2 rounded">Action</div>
              </div>

              {/* Rows */}
              <div className="mt-2 flex flex-col gap-2">
                {loading ? (
                  <div className="text-center py-4 text-gray-500">
                    Loading members...
                  </div>
                ) : members.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No members data found
                  </div>
                ) : (
                  members.map((member, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-5 gap-[5px] text-sm"
                    >
                      <div className="bg-gray-100 px-2 py-2 rounded">
                        {member.name}
                      </div>
                      <div className="bg-gray-100 px-2 py-2 rounded">
                        {member.role}
                      </div>
                      <div className="bg-gray-100 px-2 py-2 rounded">
                        {member.email}
                      </div>
                      <div className="bg-gray-100 px-2 py-2 rounded">
                        <span
                          className={`${
                            member.status === "Active"
                              ? "text-green-600"
                              : member.status === "Inactive"
                              ? "text-red-500"
                              : member.status === "Pending"
                              ? "text-yellow-500"
                              : "text-gray-500"
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
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 👇 Add Member Popup */}
      {showPopup && (
        <AddMemberPopup
          onClose={() => setShowPopup(false)}
          onSuccess={() => {
            setShowPopup(false);
            fetchMembers(); // refresh list after adding
          }}
        />
      )}
    </div>
  );
}
