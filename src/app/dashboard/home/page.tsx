"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ Store projects, summaries
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [overallSummary, setOverallSummary] = useState<any>({});
  const [projectSummaries, setProjectSummaries] = useState<any[]>([]);

  // ✅ Fetch all projects + summary on load
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/getallprojectsdata", {
          method: "POST",
          credentials: "include",
        });
        if (res.ok) {
          const result = await res.json();

          // ✅ backend gives back projects + task_summary (with overall + per project counts)
          const fetchedProjects = result.projects || [];
          setProjects(fetchedProjects);

          setOverallSummary(result.task_summary?.overall || {});
          setProjectSummaries(result.task_summary?.projects || []);

          if (fetchedProjects.length > 0) {
            setSelectedProjectId(fetchedProjects[0].project_id); // default first
          }
        } else {
          console.error("Failed to fetch projects");
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };

    fetchProjects();
  }, []);

  // ✅ Get selected project + its summary
  const selectedProject = projects.find(
    (proj) => proj.project_id === selectedProjectId
  );
  const selectedSummary = projectSummaries.find(
    (p) => p.project_id === selectedProjectId
  );

  // ✅ Chart data for selected project
  const chartData = selectedSummary
    ? [
        {
          label: "Pending",
          value: selectedSummary.pending,
          total:
            selectedSummary.pending +
            selectedSummary.completed +
            selectedSummary.in_progress,
        },
        {
          label: "Completed",
          value: selectedSummary.completed,
          total:
            selectedSummary.pending +
            selectedSummary.completed +
            selectedSummary.in_progress,
        },
        {
          label: "In Progress",
          value: selectedSummary.in_progress,
          total:
            selectedSummary.pending +
            selectedSummary.completed +
            selectedSummary.in_progress,
        },
      ]
    : [];

  return (
    <div className="min-h-screen flex bg-white text-black font-sans">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Cards - show overall summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-purple-100 text-purple-600 rounded-md p-4">
            <h2 className="text-2xl font-bold">
              {overallSummary.total_pending ?? 0}
            </h2>
            <p>Pending Tasks</p>
          </div>
          <div className="bg-blue-100 text-blue-600 rounded-md p-4">
            <h2 className="text-2xl font-bold">
              {overallSummary.total_completed ?? 0}
            </h2>
            <p>Completed Tasks</p>
          </div>
          <div className="bg-yellow-100 text-yellow-600 rounded-md p-4">
            <h2 className="text-2xl font-bold">
              {overallSummary.total_in_progress ?? 0}
            </h2>
            <p>In Progress Tasks</p>
          </div>
        </div>

        {/* Chart for selected project */}
        <div className="bg-gray-50 p-4 rounded-md shadow-sm mb-6">
          <div className="mb-2 flex items-center gap-2 flex-wrap">
            <h3 className="font-medium">Project:</h3>
            <select
              className="bg-transparent font-semibold text-black cursor-pointer focus:outline-none"
              value={selectedProjectId ?? ""}
              onChange={(e) => setSelectedProjectId(Number(e.target.value))}
            >
              {projects.map((proj) => (
                <option key={proj.project_id} value={proj.project_id}>
                  {proj.project_name}
                </option>
              ))}
            </select>
            <span className="font-bold">- Task Overview</span>
          </div>

          <div className="w-full h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip
                  formatter={(value: number, name, props) => {
                    const total = props.payload.total;
                    return `${value} out of ${total}`;
                  }}
                />
                <Bar dataKey="value" fill="#60A5FA" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Team Table */}
        <div className="bg-gray-50 p-4 rounded-md shadow-sm overflow-x-auto">
          <h3 className="mb-2 font-medium flex items-center gap-2 flex-wrap">
            Team{" "}
            <select
              className="bg-transparent font-semibold text-black cursor-pointer focus:outline-none"
              value={selectedProjectId ?? ""}
              onChange={(e) => setSelectedProjectId(Number(e.target.value))}
            >
              {projects.map((proj) => (
                <option key={proj.project_id} value={proj.project_id}>
                  {proj.project_name}
                </option>
              ))}
            </select>
          </h3>

          <table
            className="w-full text-left min-w-[600px] border-separate border-spacing-x-2 border-spacing-y-2"
            style={{ tableLayout: "fixed" }}
          >
            <thead>
              <tr>
                {["Name", "Role", "Added", "Email", "Status", "Action"].map(
                  (title) => (
                    <th
                      key={title}
                      className="bg-[#F5F5F5] px-3 py-2 rounded-md font-semibold text-sm"
                    >
                      {title}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {selectedProject?.employees?.map((member: any, idx: number) => (
                <tr key={idx}>
                  <td className="bg-[#F5F5F5] px-3 py-2 rounded-md">
                    {member.name}
                  </td>
                  <td className="bg-[#F5F5F5] px-3 py-2 rounded-md">
                    {member.role}
                  </td>
                  <td className="bg-[#F5F5F5] px-3 py-2 rounded-md">
                    {member.added_date}
                  </td>
                  <td className="bg-[#F5F5F5] px-3 py-2 rounded-md">
                    {member.email}
                  </td>
                  <td className="bg-[#F5F5F5] px-3 py-2 rounded-md">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        member.status === "Accepted"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="bg-[#F5F5F5] px-3 py-2 rounded-md">...</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
