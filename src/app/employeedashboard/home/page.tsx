"use client";

import { useState } from "react";
import Sidebar from "@/empcomponents/siderbar"; // ✅ sidebar
import EmployeeHeader from "@/empcomponents/Header"; // ✅ header

export default function EmployeeDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Static data for now
  const employeeData = {
    projects: 3,
    remainingTasks: 7,
  };

  const taskHistory = [
    { date: "7/13", tasks: 2 },
    { date: "7/14", tasks: 1 },
    { date: "7/15", tasks: 3 },
    { date: "7/16", tasks: 0 },
    { date: "7/17", tasks: 4 },
    { date: "7/18", tasks: 1 },
    { date: "7/19", tasks: 2 },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-white to-blue-50 text-gray-800 font-sans">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        {/* Header */}
        <EmployeeHeader
          username="John Doe"
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Projects card */}
          <div className="rounded-2xl p-6 shadow-md bg-gradient-to-r from-blue-100 to-blue-50 hover:shadow-lg transition">
            <h2 className="text-3xl font-bold text-blue-600">{employeeData.projects}</h2>
            <p className="text-gray-600 mt-1">Projects Assigned</p>
          </div>

          {/* Remaining tasks card */}
          <div className="rounded-2xl p-6 shadow-md bg-gradient-to-r from-purple-100 to-purple-50 hover:shadow-lg transition">
            <h2 className="text-3xl font-bold text-purple-600">{employeeData.remainingTasks}</h2>
            <p className="text-gray-600 mt-1">Remaining Tasks</p>
          </div>
        </div>

        {/* Recent tasks section */}
        <div className="bg-white p-6 rounded-2xl shadow-md mb-8 border border-gray-100">
          <h3 className="mb-4 font-semibold text-lg text-gray-800">📌 Recent Task Activity</h3>
          <table className="w-full text-left border-separate border-spacing-y-3">
            <thead>
              <tr>
                <th className="px-4 py-2 text-sm font-semibold text-gray-600">Date</th>
                <th className="px-4 py-2 text-sm font-semibold text-gray-600">Tasks Completed</th>
              </tr>
            </thead>
            <tbody>
              {taskHistory.map((entry, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700">
                    {entry.date}
                  </td>
                  <td className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium">
                    {entry.tasks}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Assigned Projects */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 overflow-x-auto">
          <h3 className="mb-4 font-semibold text-lg text-gray-800">🚀 Assigned Projects</h3>
          <table
            className="w-full text-left min-w-[600px] border-separate border-spacing-y-3"
            style={{ tableLayout: "fixed" }}
          >
            <thead>
              <tr>
                {["Project Name", "Role", "Deadline", "Status"].map((title) => (
                  <th
                    key={title}
                    className="px-4 py-2 text-sm font-semibold text-gray-600"
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {
                  name: "Handymanfast",
                  role: "Frontend",
                  deadline: "25 Aug 2025",
                  status: "Ongoing",
                },
                {
                  name: "ProjectX",
                  role: "UI Developer",
                  deadline: "30 Aug 2025",
                  status: "Pending",
                },
                {
                  name: "AppTracker",
                  role: "Testing",
                  deadline: "5 Sep 2025",
                  status: "Completed",
                },
              ].map((proj, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-50 transition rounded-lg"
                >
                  <td className="px-4 py-2 bg-gray-100 rounded-lg">{proj.name}</td>
                  <td className="px-4 py-2 bg-gray-100 rounded-lg">{proj.role}</td>
                  <td className="px-4 py-2 bg-gray-100 rounded-lg">{proj.deadline}</td>
                  <td className="px-4 py-2 bg-gray-100 rounded-lg">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        proj.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : proj.status === "Ongoing"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {proj.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
