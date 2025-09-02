"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/empcomponents/siderbar";
import EmployeeHeader from "@/empcomponents/Header";

export default function EmployeeDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [employeeSummary, setEmployeeSummary] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);

  // 🔹 Pagination state
  const [taskPage, setTaskPage] = useState(0);
  const tasksPerPage = 5;

  // 🔹 Fetch employee data
  const fetchEmployeeData = async () => {
    try {
      const res = await fetch("/api/empgethome", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch employee data");
      }

      const data = await res.json();
      setEmployeeSummary(data.employee_summary);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  // 🔹 Handle Accept Invitation
  const handleAcceptInvitation = async () => {
    try {
      setAccepting(true);
      const res = await fetch("/api/acceptinvite", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Failed to accept invitation");
      }

      // Refresh data after acceptance
      await fetchEmployeeData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-600">{error}</div>;
  }

  if (!employeeSummary) {
    return <div className="flex items-center justify-center min-h-screen">No data available</div>;
  }

  // 🔹 Paginated tasks
  const tasks = employeeSummary.completed_tasks || [];
  const startIndex = taskPage * tasksPerPage;
  const currentTasks = tasks.slice(startIndex, startIndex + tasksPerPage);
  const hasNext = startIndex + tasksPerPage < tasks.length;
  const hasPrev = taskPage > 0;

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

        {/* 🔹 Invite Notification with button */}
        {employeeSummary.status?.toLowerCase() === "invited" && (
          <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded-lg shadow-md flex items-center justify-between">
            <span>📢 You have been invited to join projects. Please accept the invitation.</span>
            <button
              onClick={handleAcceptInvitation}
              disabled={accepting}
              className="ml-4 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50"
            >
              {accepting ? "Accepting..." : "Accept Invitation"}
            </button>
          </div>
        )}

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Projects card */}
          <div className="rounded-2xl p-6 shadow-md bg-gradient-to-r from-blue-100 to-blue-50 hover:shadow-lg transition">
            <h2 className="text-3xl font-bold text-blue-600">
              {employeeSummary.num_projects}
            </h2>
            <p className="text-gray-600 mt-1">Projects Assigned</p>
          </div>

          {/* Remaining tasks card */}
          <div className="rounded-2xl p-6 shadow-md bg-gradient-to-r from-purple-100 to-purple-50 hover:shadow-lg transition">
            <h2 className="text-3xl font-bold text-purple-600">
              {employeeSummary.remaining_tasks}
            </h2>
            <p className="text-gray-600 mt-1">Remaining Tasks</p>
          </div>
        </div>

        {/* Recent tasks section with pagination */}
        <div className="bg-white p-6 rounded-2xl shadow-md mb-8 border border-gray-100">
          <h3 className="mb-4 font-semibold text-lg text-gray-800">📌 Recent Task Activity</h3>
          <table className="w-full text-left border-separate border-spacing-y-3">
            <thead>
              <tr>
                <th className="px-4 py-2 text-sm font-semibold text-gray-600">Date</th>
                <th className="px-4 py-2 text-sm font-semibold text-gray-600">Task</th>
              </tr>
            </thead>
            <tbody>
              {currentTasks.length > 0 ? (
                currentTasks.map((entry: any, idx: number) => (
                  <tr key={idx} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700">
                      {entry.assigned_date}
                    </td>
                    <td className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium">
                      {entry.task_title}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="px-4 py-2 text-gray-500">
                    No completed tasks yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination buttons */}
          <div className="flex justify-end space-x-2 mt-4">
            {hasPrev && (
              <button
                onClick={() => setTaskPage((p) => p - 1)}
                className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Previous
              </button>
            )}
            {hasNext && (
              <button
                onClick={() => setTaskPage((p) => p + 1)}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next
              </button>
            )}
          </div>
        </div>

        {/* Assigned Projects (without Status) */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 overflow-x-auto">
          <h3 className="mb-4 font-semibold text-lg text-gray-800">🚀 Assigned Projects</h3>
          <table
            className="w-full text-left min-w-[500px] border-separate border-spacing-y-3"
            style={{ tableLayout: "fixed" }}
          >
            <thead>
              <tr>
                {["Project Name", "Role", "Deadline"].map((title) => (
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
              {employeeSummary.assigned_projects.length > 0 ? (
                employeeSummary.assigned_projects.map((proj: any, idx: number) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50 transition rounded-lg"
                  >
                    <td className="px-4 py-2 bg-gray-100 rounded-lg">{proj.project_name}</td>
                    <td className="px-4 py-2 bg-gray-100 rounded-lg">{proj.role}</td>
                    <td className="px-4 py-2 bg-gray-100 rounded-lg">{proj.deadline}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-4 py-2 text-gray-500">
                    No projects assigned.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
