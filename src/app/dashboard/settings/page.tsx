"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);

  // Profile states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  // Security states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Preferences
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);

  // Handle profile picture change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  // Save Profile Changes
  const handleSaveChanges = async () => {
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    try {
      const response = await fetch("/api/profilesetting", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const result = await response.json();
      console.log("Server response:", result);
      alert(result.message || "Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile settings:", error);
      alert("Failed to save changes. Check console for details.");
    }
  };

  // Update Password
 const handlePasswordUpdate = async () => {
  if (!currentPassword || !newPassword || !confirmPassword) {
    alert("All password fields are required!");
    return;
  }
  if (newPassword !== confirmPassword) {
    alert("New password and Confirm password do not match!");
    return;
  }

  try {
    const response = await fetch("/api/adminpasswordset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword,
        newPassword,
        confirmPassword,
      }),
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const result = await response.json();
    console.log("Password update response:", result);
    alert(result.message || "Password updated successfully!");

    // reset fields
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  } catch (error) {
    console.error("Error updating password:", error);
    alert("Failed to update password. Check console for details.");
  }
};


  return (
    <div className="min-h-screen flex bg-white text-black font-sans">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <Header
         
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Page Content */}
        <div className="mt-6">
          <h1 className="text-lg font-semibold mb-4">Settings</h1>
          <hr className="border-gray-300 mb-6" />

          <div className="space-y-6">
            {/* Profile Settings */}
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <h2 className="text-base font-semibold mb-3 text-gray-700">
                Profile Settings
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 text-sm">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Upload Profile Picture */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Profile Picture
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full text-sm"
                  />
                  {profileImage && (
                    <img
                      src={URL.createObjectURL(profileImage)}
                      alt="Preview"
                      className="mt-2 w-20 h-20 rounded-full object-cover border"
                    />
                  )}
                </div>
              </div>

              <div className="mt-4 text-right">
                <button
                  onClick={handleSaveChanges}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md text-sm font-medium shadow"
                >
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
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
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
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-4 text-right">
                <button
                  onClick={handlePasswordUpdate}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium shadow"
                >
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
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="w-4 h-4 accent-cyan-500"
                />
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-sm text-gray-700">Dark Mode</span>
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                  className="w-4 h-4 accent-cyan-500"
                />
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">Auto Save Projects</span>
                <input
                  type="checkbox"
                  checked={autoSave}
                  onChange={(e) => setAutoSave(e.target.checked)}
                  className="w-4 h-4 accent-cyan-500"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
