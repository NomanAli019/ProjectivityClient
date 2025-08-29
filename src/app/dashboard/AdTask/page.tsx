"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

// -----------------------------
// Backend response types
// -----------------------------
interface BackendTask {
  task_id: number;
  title: string;
  description?: string;
  status?: string;
}

interface BackendEmployee {
  employee_id: number;
  employee_name: string;
  employee_email: string;
  tasks: BackendTask[];
}

interface BackendProject {
  project_id: number;
  project_title: string;
  employees: BackendEmployee[];
}

// -----------------------------
// Frontend types
// -----------------------------
type Task = {
  id: number;
  assignee: string;
  title: string;
  description: string;
  status: "In Progress" | "Pending" | "Completed";
  employeeId: number;
  projectId: number;
};

type Project = {
  id: number;
  name: string;
  employees: {
    id: number;
    name: string;
    tasks: Task[];
  }[];
};

// -----------------------------
// Helpers
// -----------------------------
const transformProjects = (data: BackendProject[]): Project[] => {
  if (!Array.isArray(data)) return [];
  return data.map((proj) => ({
    id: proj.project_id,
    name: proj.project_title,
    employees: proj.employees.map((emp) => ({
      id: emp.employee_id,
      name: emp.employee_name,
      tasks: emp.tasks.map((t) => ({
        id: t.task_id,
        assignee: emp.employee_name,
        title: t.title,
        description: t.description ?? "",
        status: (t.status as Task["status"]) || "Pending",
        employeeId: emp.employee_id,
        projectId: proj.project_id,
      })),
    })),
  }));
};

// -----------------------------
// Component
// -----------------------------
export default function AdTaskEmp() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [expandedTask, setExpandedTask] = useState<number | null>(null);
  const [addingTaskFor, setAddingTaskFor] = useState<number | null>(null); // employeeId
  const [newTask, setNewTask] = useState({ title: "", description: "" });

  // ✅ Fetch projects + tasks from backend
  useEffect(() => {
    fetch("/api/admingetasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((resJson) => {
        console.log("📌 raw backend response:", resJson);

        const transformed = transformProjects(resJson.data || []);
        console.log("✅ transformed projects:", transformed);

        setProjects(transformed);
        if (transformed.length > 0) {
          setSelectedProject(transformed[0].id);
        }
      })
      .catch((err) => console.error("❌ Error fetching tasks:", err));
  }, []);

  // Find selected project data
  const selectedProjectData = projects.find(
    (p) => p.id === selectedProject
  );

  // ✅ Add new task (POST to backend)
  const handleAddTask = async (employeeId: number, assignee: string) => {
    if (!newTask.title.trim() || !selectedProject) return;

    try {
      const payload = {
        project_id: selectedProject,
        employee_id: employeeId,
        title: newTask.title,
        description: newTask.description,
      };

      const res = await fetch("/api/addtaskinproject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resJson = await res.json();
      console.log("✅ Task added:", resJson);

      // update UI locally
      const newTaskObj: Task = {
        id: Date.now(), // temporary ID for UI
        assignee,
        title: newTask.title,
        description: newTask.description,
        status: "Pending",
        employeeId,
        projectId: selectedProject,
      };

      setProjects((prev) =>
        prev.map((project) =>
          project.id === selectedProject
            ? {
                ...project,
                employees: project.employees.map((emp) =>
                  emp.id === employeeId
                    ? { ...emp, tasks: [...emp.tasks, newTaskObj] }
                    : emp
                ),
              }
            : project
        )
      );

      setNewTask({ title: "", description: "" });
      setAddingTaskFor(null);
    } catch (err) {
      console.error("❌ Error adding task:", err);
    }
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
          </div>

          <hr className="border-gray-200 mb-6" />

          {/* Dropdown for selecting Project */}
          <div className="mb-6">
            <select
              value={selectedProject ?? ""}
              onChange={(e) => setSelectedProject(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {/* Horizontal Scrollable Employees Columns */}
          <div className="overflow-x-auto">
            <div className="flex space-x-6 min-w-max">
              {selectedProjectData?.employees.map((emp) => (
                <div
                  key={emp.id}
                  className="w-96 flex-shrink-0 bg-gray-50 rounded-xl shadow p-4 flex flex-col"
                >
                  {/* Assignee Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-gray-800">
                      {emp.name}
                    </h2>
                    <button
                      onClick={() =>
                        setAddingTaskFor(
                          addingTaskFor === emp.id ? null : emp.id
                        )
                      }
                      className="p-1 rounded-full bg-cyan-500 hover:bg-cyan-600 text-white"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Inline Add Task Form */}
                  {addingTaskFor === emp.id && (
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
                          setNewTask({
                            ...newTask,
                            description: e.target.value,
                          })
                        }
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                      <button
                        onClick={() => handleAddTask(emp.id, emp.name)}
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
                    {emp.tasks.length === 0 && (
                      <p className="text-xs text-gray-400">
                        No tasks assigned yet.
                      </p>
                    )}
                    {emp.tasks.map((task, index) => {
                      const isExpanded =
                        expandedTask === index + emp.id;
                      return (
                        <div
                          key={task.id}
                          onClick={() =>
                            setExpandedTask(
                              isExpanded ? null : index + emp.id
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
                          {task.description && (
                            <p className="mt-1 text-xs">
                              {isExpanded
                                ? task.description
                                : task.description.slice(0, 40) + "..."}
                            </p>
                          )}
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
