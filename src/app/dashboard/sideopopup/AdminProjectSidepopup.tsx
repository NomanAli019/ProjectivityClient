"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Member {
  name: string;
  role: string;
  joined: string;
  email?: string;
  status?: string;
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

interface AdminProjectSidepopupProps {
  project: Project | null;
  onClose: () => void;
}

export default function AdminProjectSidepopup({
  project,
  onClose,
}: AdminProjectSidepopupProps) {
  const [members, setMembers] = useState<Member[]>([]);

  // Close popup on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Fetch employees for this project
  useEffect(() => {
    const fetchEmployees = async () => {
      if (!project) return;
      try {
        const res = await fetch("/api/getaprojectdata", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            project_id: project.id,
            project_name: project.title,
          }),
        });

       if (res.ok) {
          const data = await res.json();
          // Backend returns a single project object with "employees"
          if (data.employees) {
            setMembers(
              data.employees.map((emp: any) => ({
                name: emp.name,
                role: emp.role,
                joined: emp.added_date,
                email: emp.email,
                status: emp.status,
              }))
            );
          }
        }
        else {
                  console.error("❌ Failed to fetch project employees");
                }
              } catch (err) {
                console.error("❌ Error fetching employees:", err);
              }
            };

            fetchEmployees();
          }, [project]);

          if (!project) return null;

          return (
            <AnimatePresence>
              {project && (
                <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />

          {/* Side Popup */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 w-full md:w-1/2 h-full bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">{project.title}</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <p className="text-gray-700 mb-4">{project.description}</p>

              {/* Members */}
              <div className="mb-4">
                <h3 className="text-md font-medium mb-2">Members</h3>
                <div className="overflow-x-auto border border-gray-200">
                  <table className="w-full text-sm text-gray-700 bg-gray-100">
                    <thead>
                      <tr>
                        <th className="p-2 text-left border-b border-gray-300">
                          Name
                        </th>
                        <th className="p-2 text-left border-b border-gray-300">
                          Role
                        </th>
                        <th className="p-2 text-left border-b border-gray-300">
                          Joined
                        </th>
                        <th className="p-2 text-left border-b border-gray-300">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.length > 0 ? (
                        members.map((member, index) => (
                          <tr key={index} className="border-b border-gray-200">
                            <td className="p-2">{member.name}</td>
                            <td className="p-2">{member.role}</td>
                            <td className="p-2">{member.joined}</td>
                            <td className="p-2 text-gray-400">...</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={4}
                            className="p-2 text-center text-gray-400"
                          >
                            No members found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Static Details (NOT from API) */}
              <div>
                <h3 className="text-md font-medium mb-2">Details</h3>
                <div className="bg-gray-100 p-4 rounded">
                  <table className="w-full text-sm text-gray-700">
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2 font-medium">Total tasks</td>
                        <td className="p-2">{project.totalTasks}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-medium">Completed tasks</td>
                        <td className="p-2">{project.completedTasks}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-medium">In progress tasks</td>
                        <td className="p-2">{project.inProgressTasks}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-medium">Remaining tasks</td>
                        <td className="p-2">{project.remainingTasks}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-medium">Project created</td>
                        <td className="p-2">{project.projectCreated}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-medium">Deadline</td>
                        <td className="p-2">{project.deadline}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-medium">Progress status</td>
                        <td className="p-2">{project.progressStatus}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
