"use client";

import { useEffect, useState } from "react";

export default function ProjectTasks() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    // ✅ Fetch projects + tasks
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/getprojects");
        const data = await res.json();
        setProjects(data.projects || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchData();
  }, []);

  // ✅ Update task status
  const updateTaskStatus = async (
    projectId: string,
    adminId: string,
    taskId: string,
    currentStatus: string
  ) => {
    let newStatus =
      currentStatus === "Pending"
        ? "In Progress"
        : currentStatus === "In Progress"
        ? "Completed"
        : currentStatus;

    try {
      const res = await fetch("/api/admin/updatetaskstatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: projectId,
          admin_id: adminId,
          task_id: taskId,
          status: newStatus,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        // ✅ Update state
        setProjects((prev) =>
          prev.map((p) =>
            p.project_id === projectId
              ? {
                  ...p,
                  tasks: p.tasks.map((t: any) =>
                    t.task_id === taskId ? { ...t, status: newStatus } : t
                  ),
                }
              : p
          )
        );
      } else {
        alert(data.message || "Failed to update task status");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-cyan-600">Projects & Tasks</h1>

      {/* ✅ Grid Layout instead of horizontal scroll */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div
            key={project.project_id}
            className="bg-gray-50 rounded-xl shadow-md p-4"
          >
            {/* Project Header */}
            <h2 className="text-lg font-semibold mb-3 text-cyan-600">
              {project.project_title}
            </h2>

            {/* Task List */}
            <div className="space-y-3">
              {project.tasks.map((task: any) => (
                <div
                  key={task.task_id}
                  className={`p-3 rounded-lg border transition ${
                    task.status === "Pending"
                      ? "bg-red-50 border-red-200"
                      : task.status === "In Progress"
                      ? "bg-yellow-50 border-yellow-200"
                      : "bg-green-50 border-green-200"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium">{task.title}</p>
                      <p className="text-xs text-gray-600 break-words whitespace-normal">
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
                            project.admin_id,
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
  );
}
