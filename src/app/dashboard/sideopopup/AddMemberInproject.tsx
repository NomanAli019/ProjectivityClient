"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface AddMemberSidepopupProps {
  projectId: number;
  projectTitle: string;
  onClose: () => void;
  onMemberAdded?: () => void; // callback after member is added
}

export default function AddMemberSidepopup({
  projectId,
  projectTitle,
  onClose,
  onMemberAdded,
}: AddMemberSidepopupProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  // Close popup on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleAddMember = async () => {
    if (!name || !role || !email || !pin) {
      alert("⚠️ Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/addmembertoproject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          project_id: projectId,
          name,
          role,
          email,
          pin,
        }),
      });

      if (res.ok) {
        alert("✅ Member added successfully!");
        if (onMemberAdded) onMemberAdded();
        onClose();
      } else {
        const errData = await res.json();
        alert("❌ Failed to add member: " + (errData.message || "Unknown error"));
      }
    } catch (err) {
      console.error("❌ Error adding member:", err);
      alert("❌ Error adding member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-40"
        onClick={onClose}
      />

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 w-full md:w-1/3 h-full bg-white shadow-2xl z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Add Member</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <p className="text-sm text-gray-500">
            You are adding a member to:{" "}
            <span className="font-semibold">{projectTitle}</span>
          </p>

          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm"
              placeholder="Enter name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm"
              placeholder="Enter role"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm"
              placeholder="Enter email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Employee Pin</label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm"
              placeholder="Enter login pin"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <button
            onClick={handleAddMember}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Member"}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
