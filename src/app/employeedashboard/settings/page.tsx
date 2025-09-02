"use client";

import { useState } from "react";
import Sidebar from "@/empcomponents/siderbar";
import EmployeeHeader from "@/empcomponents/Header";
import { motion } from "framer-motion";
import { Loader2, Mail, Lock } from "lucide-react";

export default function EmployeeSettings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 🔹 Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 🔹 Feedback states
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Handle settings update
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (password && password !== confirmPassword) {
      setError("❌ Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/updatesettings", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update settings");
      }

      const data = await res.json();
      setMessage(data.message || "✅ Settings updated successfully");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-white to-blue-50 text-gray-800 font-sans">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        {/* Header */}
        <EmployeeHeader
          
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Settings Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-gray-100 max-w-2xl mx-auto mt-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ⚙️ Account Settings
          </h2>
          <p className="text-gray-500 mb-6">
            Update your account details to keep your profile secure and up to date.
          </p>

          {/* Alerts */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg"
            >
              {error}
            </motion.div>
          )}
          {message && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 p-3 bg-green-50 text-green-700 border border-green-200 rounded-lg"
            >
              {message}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleUpdate} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                New Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Enter new email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Enter new password"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Re-enter new password"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 shadow-md"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} /> Updating...
                </>
              ) : (
                "Update Settings"
              )}
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
