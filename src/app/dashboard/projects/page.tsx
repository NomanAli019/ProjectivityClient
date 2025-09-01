"use client";

import { useState, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import AdminProjectSidepopup from "@/app/dashboard/sideopopup/AdminProjectSidepopup";
import CreateProjectPopup from "@/app/dashboard/projectpopup/CreateProjectPopUp";
import AddMemberSidepopup from "@/app/dashboard/sideopopup/AddMemberInproject";

interface Member {
  name: string;
  role: string;
  joined: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  members: number;
  membersList: Member[];
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  remainingTasks: number;
  projectCreated: string;
  deadline: string;
  progressStatus: string;
}

export default function ProjectsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [addMemberProject, setAddMemberProject] = useState<Project | null>(null);

  // ✅ Fetch projects dynamically
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/adminallprojects", {
          method: "POST",
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setProjects(data.projects || []);
        } else {
          console.error("❌ Failed to fetch projects");
        }
      } catch (err) {
        console.error("❌ Error fetching projects:", err);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen flex bg-white text-black font-sans">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Page Title with Plus Button */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-bold">Projects</h1>
          <button
            onClick={() => setIsPopupOpen(true)}
            className="text-lg font-bold px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200"
          >
            +
          </button>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="relative bg-gray-50 rounded-xl shadow p-4 flex flex-col hover:shadow-md transition"
            >
              {/* Title + Menu */}
              <div className="flex justify-between items-start mb-2">
                <h2 className="font-semibold">{project.title}</h2>
                <div className="relative">
                  <button
                    onClick={() =>
                      setMenuOpen(menuOpen === project.id ? null : project.id)
                    }
                    className="p-1 rounded-full hover:bg-gray-200"
                  >
                    <MoreVertical size={18} />
                  </button>

                  {/* Dropdown Menu */}
                  {menuOpen === project.id && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-10">
                      <button
                        onClick={() => {
                          setSelectedProject(project);
                          setMenuOpen(null);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Open Details
                      </button>
                      <button
                        onClick={() => {
                          setAddMemberProject(project);
                          setMenuOpen(null);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Add Members
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {project.description}
              </p>

              {/* Members */}
              <div className="flex items-center gap-2 mt-auto">
                <div className="flex -space-x-2">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white"
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  {project.members}+ Members
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Project Side Popup */}
      {selectedProject && (
        <AdminProjectSidepopup
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {/* Add Member Side Popup */}
      {addMemberProject && (
        <AddMemberSidepopup
          projectId={addMemberProject.id}
          projectTitle={addMemberProject.title}
          onClose={() => setAddMemberProject(null)}
          onMemberAdded={() => {
            console.log("🔔 Refresh project members if needed");
          }}
        />
      )}

      {/* Create Project Popup */}
      {isPopupOpen && (
        <CreateProjectPopup onClose={() => setIsPopupOpen(false)} />
      )}
    </div>
  );
}
