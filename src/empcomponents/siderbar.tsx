"use client";

import {
  Home,
  List,
  Settings,
  MessageSquare,
  LogOut,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const menuItems = [
  { label: "Home", icon: <Home className="w-4 h-4" />, href: "/employeedashboard/home" },
  { label: "Tasks", icon: <List className="w-4 h-4" />, href: "/employeedashboard/task" },
];

export default function EmployeeSidebar({ isOpen, onClose }: Props) {
  const pathname = usePathname();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/employee/logout", {
        method: "POST",
        credentials: "include", // 👈 ensures Flask session cookie is cleared
      });

      if (res.ok) {
        // ✅ Redirect to employee login after logout
        window.location.href = "/emplogin";
      } else {
        const data = await res.json();
        alert(data.message || "Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-white text-black flex flex-col px-4 py-6 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Top logo + close */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2">
            <div className="bg-black text-white rounded-full w-6 h-6 flex items-center justify-center font-bold">
              P
            </div>
            <h1 className="text-lg font-semibold">Projectivity</h1>
          </div>
          <button
            onClick={onClose}
            className="md:hidden text-black hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Main Menu */}
        <nav className="flex flex-col gap-2 mb-6">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-black text-white"
                    : "text-black hover:bg-black/10"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <hr className="border-gray-200 my-4" />

        {/* Bottom links */}
        <div className="mt-auto flex flex-col gap-2 text-sm">
          <Link
            href="/employeedashboard/settings"
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              pathname === "/employeedashboard/settings"
                ? "bg-black text-white"
                : "text-black hover:bg-black/10"
            }`}
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>
          <Link
            href="/employee/feedback"
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              pathname === "/employee/feedback"
                ? "bg-black text-white"
                : "text-black hover:bg-black/10"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Feedback
          </Link>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-red-500 hover:bg-red-100 transition-colors text-left"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Confirm Logout
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm rounded-md bg-red-500 hover:bg-red-600 text-white"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
