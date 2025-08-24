"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AddMemberPopupProps {
  onClose: () => void;
  onSuccess?: () => void; // optional callback to refresh members
}

export default function AddMemberPopup({
  onClose,
  onSuccess,
}: AddMemberPopupProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState(""); // 👈 new state
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/addmember", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, role, email, pin }), // 👈 include pin
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Member added successfully!");
        onClose();
        if (onSuccess) onSuccess(); // refresh list if provided
      } else {
        alert("❌ Failed: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error adding member:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <>
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-40"
          onClick={onClose}
        />

        {/* Popup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 280, damping: 24 }}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
            w-full max-w-md bg-white shadow-lg rounded-xl z-50 p-5"
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-3">
            <h2 className="text-base font-medium text-gray-700">Add New Member</h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-100 transition"
            >
              <X size={18} className="text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <div className="mt-4">
            <form onSubmit={handleSubmit} className="space-y-5 text-sm">
              {/* Name */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                  placeholder="Enter member name"
                  required
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Role</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                  placeholder="Enter member role"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                  placeholder="Enter member email"
                  required
                />
              </div>

              {/* Employee Login Pin */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Employee Login Pin
                </label>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                  placeholder="Enter a secure PIN"
                  minLength={4}
                  required
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium disabled:opacity-50"
              >
                {loading ? "Adding..." : "Add Member"}
              </button>
            </form>
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  );
}
