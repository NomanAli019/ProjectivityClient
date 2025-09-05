"use client";

import {
  Home,
  Mail,
  Folder,
  List,
  Users,
  PlusCircle,
  Settings,
  MessageSquare,
  LogOut,
  X,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image"; // ✅ import Image
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const menuItems = [
  { label: "Home", icon: <Home className="w-4 h-4" />, href: "/dashboard/home" },
  { label: "Inbox", icon: <Mail className="w-4 h-4" />, href: "/dashboard/inbox" },
  { label: "Projects", icon: <Folder className="w-4 h-4" />, href: "/dashboard/projects" },
  { label: "Tasks", icon: <List className="w-4 h-4" />, href: "/dashboard/AdTask" },
  { label: "Members", icon: <Users className="w-4 h-4" />, href: "/dashboard/members" },
];

export default function Sidebar({ isOpen, onClose }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      // ✅ Call through Next.js proxy → Flask backend
      const res = await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include", // ensure session cookie is cleared
      });

      const data = await res.json();
      console.log("Logout response:", data);

      if (res.ok) {
        router.push("/login"); // redirect to login
      } else {
        alert(data.message || "Logout failed");
      }
    } catch (err) {
      console.error("Error during logout:", err);
      alert("Something went wrong while logging out.");
    }
    setLoading(false);
    setShowLogoutConfirm(false);
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
            {/* ✅ Logo Image */}
            <Image
              src="/Pictureproj.png"
              alt="Projectivity Logo"
              width={32} // adjust as needed
              height={32}
              className="rounded-md"
            />
            <h1 className="text-lg font-semibold">Projectivity</h1>
          </div>
          <button
            onClick={onClose}
            className="md:hidden text-black hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Create Button */}
        <button className="flex items-center gap-2 text-sm font-medium bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md mb-6">
          <PlusCircle className="w-4 h-4" />
          Create
        </button>

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
            href="/dashboard/settings"
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              pathname === "/dashboard/settings"
                ? "bg-black text-white"
                : "text-black hover:bg-black/10"
            }`}
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>
          <Link
            href="/dashboard/feedback"
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              pathname === "/dashboard/feedback"
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
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm rounded-md bg-red-500 hover:bg-red-600 text-white disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
