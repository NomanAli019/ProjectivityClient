"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/empcomponents/siderbar"; // ✅ employee sidebar
import EmployeeHeader from "@/empcomponents/Header"; // ✅ employee header

// Task type
type Task = {
  task_id: number;
  title: string;
  description: string;
  status: "Pending" | "In Progress" | "Completed";
};

// Project type
export type Project = {
  project_id: number;
  admin_id: number; // ✅ added admin_id
  project_title: string;
  tasks: Task[];
};

// Backend API response type
type EmployeeTasksResponse = {
  message: string;
  tasks: Project[];
};

export default function EmployeeTasks() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch tasks from backend on page load
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/empgetasks", {
          method: "POST",
          credentials: "include", // ✅ important for session cookies
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          console.error("Failed to fetch tasks:", res.status);
          setProjects([]);
          return;
        }

        const data: EmployeeTasksResponse = await res.json();
        console.log("📥 API response:", data);

        // ✅ Normalize: projects are inside data.tasks
        if (Array.isArray(data.tasks)) {
          setProjects(
            data.tasks.map((proj: Project) => ({
              project_id: proj.project_id,
              admin_id: proj.admin_id, // ✅ include admin_id
              project_title: proj.project_title,
              tasks: proj.tasks || [],
            }))
          );
        } else {
          setProjects([]);
        }
      } catch (err) {
        console.error("❌ Error fetching tasks:", err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // ✅ Function to update task status with backend call
  const updateTaskStatus = async (
    projectId: number,
    adminId: number, // ✅ take adminId also
    taskId: number,
    currentStatus: Task["status"]
  ) => {
    const newStatus: Task["status"] =
      currentStatus === "Pending"
        ? "In Progress"
        : currentStatus === "In Progress"
        ? "Completed"
        : "Completed";

    try {
      const res = await fetch("/api/empupdatetask", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: projectId,
          admin_id: adminId, // ✅ send admin_id too
          task_id: taskId,
          status: newStatus,
        }),
      });

      if (!res.ok) {
        console.error("❌ Failed to update task:", res.status);
        return;
      }

      const result = await res.json();
      console.log("✅ Task updated response:", result);

      // Update frontend state only if backend confirms
      setProjects((prevProjects: Project[]): Project[] =>
        prevProjects
          .map((project): Project => {
            if (project.project_id !== projectId) return project;

            const updatedTasks: Task[] = project.tasks.map((task): Task =>
              task.task_id === taskId ? { ...task, status: newStatus } : task
            );

            return { ...project, tasks: updatedTasks };
          })
          .filter((project) =>
            project.tasks.some((task) => task.status !== "Completed")
          )
      );
    } catch (err) {
      console.error("❌ Error updating task:", err);
    }
  };

  return (
    <div className="min-h-screen flex bg-white text-black font-sans">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <EmployeeHeader onMenuClick={() => setSidebarOpen(true)} />

        <div className="mt-4">
          <h1 className="text-xl font-bold mb-6">📋 My Tasks</h1>

          {loading ? (
            <p className="text-center text-gray-500">⏳ Loading tasks...</p>
          ) : projects.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">
              ✅ All tasks completed! 🎉
            </p>
          ) : (
            <div className="overflow-x-auto">
              <div className="flex space-x-6 min-w-max">
                {projects.map((project) => (
                  <div
                    key={project.project_id}
                    className="w-96 flex-shrink-0 bg-gray-50 rounded-xl shadow p-4 flex flex-col"
                  >
                    {/* Project Header */}
                    <h2 className="text-sm font-semibold text-cyan-600 mb-3">
                      {project.project_title}
                    </h2>

                    {/* Task List */}
                    <div className="space-y-3 overflow-y-auto">
                      {project.tasks.length === 0 && (
                        <p className="text-xs text-gray-400">
                          No tasks assigned yet.
                        </p>
                      )}
                      {project.tasks.map((task) => (
                        <div
                          key={task.task_id}
                          className={`p-3 rounded-lg shadow hover:shadow-md transition ${
                            task.status === "Pending"
                              ? "bg-red-50 border border-red-200"
                              : task.status === "In Progress"
                              ? "bg-yellow-50 border border-yellow-200"
                              : "bg-green-50 border border-green-200"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">
                                {task.title}
                              </p>
                              <p className="text-xs text-gray-600 break-words whitespace-pre-line">
                                {task.description}
                              </p>
                              <span
                                className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                                  task.status === "Pending"
                                    ? "bg-red-100 text-red-700"
                                    : task.status === "In Progress"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-green-100 text-green-700"
                                }`}
                              >
                                {task.status}
                              </span>
                            </div>

                            {/* Status Update Button */}
                            {task.status !== "Completed" && (
                              <button
                                onClick={() =>
                                  updateTaskStatus(
                                    project.project_id,
                                    project.admin_id, // ✅ pass admin_id
                                    task.task_id,
                                    task.status
                                  )
                                }
                                className="ml-3 px-3 py-1 rounded-lg text-xs bg-cyan-500 hover:bg-cyan-600 text-white"
                              >
                                Mark as{" "}
                                {task.status === "Pending"
                                  ? "In Progress"
                                  : "Completed"}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
