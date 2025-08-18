"use client";

import { Menu } from "lucide-react";

type HeaderProps = {
  username: string;
  onMenuClick: () => void;
};

export default function Header({ username, onMenuClick }: HeaderProps) {
  return (
    <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
      {/* Left - Greeting */}
      <h1 className="text-lg sm:text-xl font-semibold flex-1">
        Good Morning, <span className="font-bold">{username}</span>
      </h1>

      {/* Middle - Search */}
      <div className="flex-1 w-full sm:w-auto">
        <input
          type="text"
          placeholder="Search anything here"
          className="border border-gray-300 px-3 py-2 rounded-[20px] shadow-sm w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-700 placeholder-gray-400 placeholder:text-sm text-sm transition duration-200"
        />
      </div>

      {/* Right - Buttons + Avatar */}
      <div className="flex items-center gap-2 flex-wrap">
        <button className="border border-[#01D0FF] text-[#01D0FF] px-3 py-1 rounded-[20px] hover:bg-[#01D0FF0F] transition duration-200">
          + New Project
        </button>
        <button className="border border-[#BC73F9] text-[#BC73F9] px-3 py-1 rounded-[20px] hover:bg-[#BC73F90F] transition duration-200">
          + Create Task
        </button>
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>

        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="md:hidden text-black hover:text-gray-600"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
