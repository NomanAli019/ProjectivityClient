"use client";

import { useState } from "react";
import Sidebar from "@/empcomponents/siderbar"; // ✅ employee sidebar
import EmployeeHeader from "@/empcomponents/Header"; // ✅ employee header

// Task type
type Task = {
  id: number;
  title: string;
  description: string;
  status: "Pending" | "In Progress" | "Completed";
};

// Project type
type Project = {
  name: string;
  tasks: Task[];
};

// Initial static projects
const initialProjects: Project[] = [
  {
    name: "Handymanfast",
    tasks: [
      {
        id: 1,
        title: "Change the colour scheme",
        description: "Update overall theme colors to match branding.",
        status: "Pending",
      },
      {
        id: 2,
        title: "Solve responsive issue",
        description: "Fix layout issues on mobile devices.",
        status: "Pending",
      },
    ],
  },
  {
    name: "CRM Dashboard",
    tasks: [
      {
        id: 3,
        title: "Setup OTP authentication",
        description: "Integrate OTP login with SMS/email.",
        status: "In Progress",
      },
    ],
  },
  {
    name: "Website Revamp",
    tasks: [
      {
        id: 4,
        title: "Migrate to Next.js",
        description: "Rebuild site using Next.js for SSR.",
        status: "Pending",
      },
    ],
  },
];

export default function EmployeeTasks() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  // Function to update task status
  const updateTaskStatus = (projectName: string, taskId: number) => {
    setProjects((prevProjects: Project[]): Project[] => {
      return prevProjects
        .map((project): Project => {
          if (project.name !== projectName) return project;

          const updatedTasks: Task[] = project.tasks.map((task): Task =>
            task.id === taskId
              ? {
                  ...task,
                  status:
                    task.status === "Pending"
                      ? "In Progress"
                      : task.status === "In Progress"
                      ? "Completed"
                      : "Completed",
                }
              : task
          );

          return { ...project, tasks: updatedTasks };
        })
        .filter((project) =>
          project.tasks.some((task) => task.status !== "Completed")
        ); // remove fully completed projects
    });
  };

  return (
    <div className="min-h-screen flex bg-white text-black font-sans">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <EmployeeHeader
          username="John Doe"
          onMenuClick={() => setSidebarOpen(true)}
        />

        <div className="mt-4">
          <h1 className="text-xl font-bold mb-6">📋 My Tasks</h1>

          {/* Projects - Horizontal scroll with snapping */}
          <div
            className="flex space-x-4 overflow-x-auto pb-3 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }} // Firefox & IE
          >
            {/* hide scrollbar for Chrome/Edge/Safari */}
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            {projects.map((project) => (
              <div
                key={project.name}
                className="bg-gray-50 rounded-xl shadow-md p-4 flex-shrink-0 snap-start min-w-[calc(100%/1.05)] sm:min-w-[calc(100%/2.1)] lg:min-w-[calc(100%/3.2)]"

              >
                {/* Project Header */}
                <h2 className="text-lg font-semibold mb-3 text-cyan-600">
                  {project.name}
                </h2>

                {/* Task List */}
                <div className="space-y-3">
                  {project.tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-3 rounded-lg border transition ${
                        task.status === "Pending"
                          ? "bg-red-50 border-red-200"
                          : task.status === "In Progress"
                          ? "bg-yellow-50 border-yellow-200"
                          : "bg-green-50 border-green-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{task.title}</p>
                          <p className="text-xs text-gray-600">
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
                              updateTaskStatus(project.name, task.id)
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

          {/* If all projects are done */}
          {projects.length === 0 && (
            <p className="text-center text-gray-500 mt-10">
              ✅ All tasks completed! 🎉
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
