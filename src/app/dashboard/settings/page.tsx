"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

        {/* Page Content */}
        <div className="mt-6">
          {/* Page Title */}
          <h1 className="text-lg font-semibold mb-4">Settings</h1>
          <hr className="border-gray-300 mb-6" />

          {/* Settings Sections */}
          <div className="space-y-6">
            {/* Profile Settings */}
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <h2 className="text-base font-semibold mb-3 text-gray-700">
                Profile Settings
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 text-sm">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Muhammad Jazib"
                    className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue="mjxdex@gmail.com"
                    className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Role
                  </label>
                  <input
                    type="text"
                    defaultValue="Frontend Developer"
                    className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    defaultValue="+92 300 1234567"
                    className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-4 text-right">
                <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md text-sm font-medium shadow">
                  Save Changes
                </button>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <h2 className="text-base font-semibold mb-3 text-gray-700">
                Security
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 text-sm">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Re-enter new password"
                    className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-4 text-right">
                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium shadow">
                  Update Password
                </button>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <h2 className="text-base font-semibold mb-3 text-gray-700">
                Preferences
              </h2>
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-sm text-gray-700">Enable Notifications</span>
                <input type="checkbox" className="w-4 h-4 accent-cyan-500" defaultChecked />
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-sm text-gray-700">Dark Mode</span>
                <input type="checkbox" className="w-4 h-4 accent-cyan-500" />
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">Auto Save Projects</span>
                <input type="checkbox" className="w-4 h-4 accent-cyan-500" defaultChecked />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
