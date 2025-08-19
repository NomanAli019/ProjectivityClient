"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

// Define Task type
type Task = {
  assignee: string;
  title: string;
  description: string;
  status: "In Progress" | "Pending" | "Completed";
};

const initialTasks: Task[] = [
  {
    assignee: "Haya Fatima",
    title: "Change the colour scheme of handymanfast.",
    description: "Update the overall UI theme colors to match the new branding.",
    status: "In Progress",
  },
  {
    assignee: "Haya Fatima",
    title: "Solve responsive issue.",
    description: "Fix issues on mobile screens where layout breaks.",
    status: "Pending",
  },
  {
    assignee: "Muhammad Usman",
    title: "Make admin panel.",
    description:
      "Include CRUD for services, blogs, banners, projects, and other modules.",
    status: "In Progress",
  },
  {
    assignee: "Iran Malik",
    title: "Setup OTP authentication.",
    description:
      "Integrate OTP-based authentication for secure login via SMS/email.",
    status: "Pending",
  },
];

const groupTasks = (tasks: Task[]) => {
  return tasks.reduce((acc: Record<string, Task[]>, task) => {
    if (!acc[task.assignee]) acc[task.assignee] = [];
    acc[task.assignee].push(task);
    return acc;
  }, {});
};

export default function AdTaskEmp() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState("Handymanfast");
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  // Track expanded tasks
  const [expandedTask, setExpandedTask] = useState<number | null>(null);

  // Track which employee is adding a task
  const [addingTaskFor, setAddingTaskFor] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({ title: "", description: "" });

  const groupedTasks = groupTasks(tasks);

  const handleAddTask = (assignee: string) => {
    if (!newTask.title.trim()) return;
    const newTaskObj: Task = {
      assignee,
      title: newTask.title,
      description: newTask.description,
      status: "Pending",
    };
    setTasks((prev) => [...prev, newTaskObj]);
    setNewTask({ title: "", description: "" });
    setAddingTaskFor(null);
  };

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

        <div className="mt-4">
          {/* Title Row */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">📋 Tasks</h1>
            <button className="flex items-center gap-1 bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-2 rounded-lg text-sm font-medium shadow">
              <Plus size={16} /> Add Task
            </button>
          </div>

          <hr className="border-gray-200 mb-6" />

          {/* Dropdown for selecting Project */}
          <div className="mb-6">
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="Handymanfast">Handymanfast</option>
              <option value="Ecommerce">Ecommerce</option>
              <option value="Portfolio">Portfolio</option>
              <option value="CRM">CRM</option>
            </select>
          </div>

          {/* Horizontal Scrollable Employees Columns */}
          <div className="overflow-x-auto">
            <div className="flex space-x-6 min-w-max">
              {Object.entries(groupedTasks).map(([assignee, empTasks]) => (
                <div
                  key={assignee}
                  className="w-96 flex-shrink-0 bg-gray-50 rounded-xl shadow p-4 flex flex-col"
                >
                  {/* Assignee Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-gray-800">
                      {assignee}
                    </h2>
                    <button
                      onClick={() =>
                        setAddingTaskFor(
                          addingTaskFor === assignee ? null : assignee
                        )
                      }
                      className="p-1 rounded-full bg-cyan-500 hover:bg-cyan-600 text-white"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Inline Add Task Form */}
                  {addingTaskFor === assignee && (
                    <div className="mb-4 space-y-2 bg-white p-3 rounded-md border">
                      <input
                        type="text"
                        placeholder="Task title"
                        value={newTask.title}
                        onChange={(e) =>
                          setNewTask({ ...newTask, title: e.target.value })
                        }
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                      <textarea
                        placeholder="Task description"
                        value={newTask.description}
                        onChange={(e) =>
                          setNewTask({ ...newTask, description: e.target.value })
                        }
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                      <button
                        onClick={() => handleAddTask(assignee)}
                        className="w-full bg-cyan-500 hover:bg-cyan-600 text-white text-sm px-2 py-1 rounded"
                      >
                        Save Task
                      </button>
                    </div>
                  )}

                  {/* Status Labels */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {["In Progress", "Pending", "Completed"].map((status) => (
                      <span
                        key={status}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          status === "In Progress"
                            ? "bg-cyan-100 text-cyan-700"
                            : status === "Pending"
                            ? "bg-red-100 text-red-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {status}
                      </span>
                    ))}
                  </div>

                  {/* Tasks List */}
                  <div className="space-y-3 overflow-y-auto">
                    {empTasks.map((task, index) => {
                      const isExpanded =
                        expandedTask === index + assignee.length; // unique key
                      return (
                        <div
                          key={index}
                          onClick={() =>
                            setExpandedTask(
                              isExpanded ? null : index + assignee.length
                            )
                          }
                          className={`p-3 rounded-lg shadow hover:shadow-md transition cursor-pointer ${
                            task.status === "In Progress"
                              ? "bg-cyan-100 text-cyan-700"
                              : task.status === "Pending"
                              ? "bg-red-100 text-red-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          <p className="text-xs opacity-80">{task.status}</p>
                          <p className="mt-1 text-sm font-medium">
                            {task.title}
                          </p>
                          <p className="mt-1 text-xs">
                            {isExpanded
                              ? task.description
                              : task.description.slice(0, 40) + "..."}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
