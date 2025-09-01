"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import CreateProjectPopup from "@/app/dashboard/projectpopup/CreateProjectPopUp";

type HeaderProps = {
  onMenuClick: () => void;
};

export default function Header({ onMenuClick }: HeaderProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profilePic, setProfilePic] = useState<string | null>(null);

  // ✅ Greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // ✅ Fetch admin profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/getadminprofile", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
        setProfilePic(data.profile_pic || null);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
      {/* Left - Greeting */}
      <h1 className="text-lg sm:text-xl font-semibold flex-1">
        {getGreeting()},{" "}
        <span className="font-bold">
          {firstName} {lastName}
        </span>
      </h1>

      {/* Middle - Search */}
      <div className="flex-1 w-full sm:w-auto">
        <input
          type="text"
          placeholder="Search anything here"
          className="border border-gray-300 px-3 py-2 rounded-[20px] shadow-sm 
                     w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 
                     bg-gray-50 text-gray-700 placeholder-gray-400 placeholder:text-sm text-sm 
                     transition duration-200"
        />
      </div>

      {/* Right - Buttons + Avatar */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* ✅ New Project Button shows popup */}
        <button
          onClick={() => setShowPopup(true)}
          className="border border-[#01D0FF] text-[#01D0FF] px-3 py-1 rounded-[20px] 
                     hover:bg-[#01D0FF0F] transition duration-200"
        >
          + New Project
        </button>

        {/* Create Task Button */}
        <button
          className="border border-[#BC73F9] text-[#BC73F9] px-3 py-1 rounded-[20px] 
                           hover:bg-[#BC73F90F] transition duration-200"
        >
          + Create Task
        </button>

        {/* Avatar */}
        {profilePic ? (
          <img
            src={profilePic}  // ✅ Already a full URL
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover border"
          />
        ) : (
          <div className="w-8 h-8 bg-gray-300 rounded-full" />
        )}

        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="md:hidden text-black hover:text-gray-600"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* ✅ Popup Render */}
      {showPopup && <CreateProjectPopup onClose={() => setShowPopup(false)} />}
    </div>
  );
}
