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

const data = [
  { date: "7/8", tasks: 60 },
  { date: "7/9", tasks: 20 },
  { date: "7/10", tasks: 55 },
  { date: "7/11", tasks: 45 },
  { date: "7/12", tasks: 50 },
  { date: "7/13", tasks: 80 },
  { date: "7/14", tasks: 15 },
  { date: "7/15", tasks: 55 },
  { date: "7/16", tasks: 55 },
  { date: "7/17", tasks: 50 },
  { date: "7/18", tasks: 90 },
  { date: "7/19", tasks: 65 },
];

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ State for projects
  const [projects, setProjects] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");

  // ✅ Fetch all projects on load
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/getallprojectsdata", {
          method: "GET",
          credentials: "include",
        });
        if (res.ok) {
          const result = await res.json();
          // assuming API returns like: { projects: ["Handymanfast", "ProjectX"] }
          const projectNames = result.projects || [];
          setProjects(projectNames);
          if (projectNames.length > 0) {
            setSelectedProject(projectNames[0]); // default to first project
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

  return (
    <div className="min-h-screen flex bg-white text-black font-sans">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <Header
          username="Muhammad Jazib"
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-purple-100 text-purple-600 rounded-md p-4">
            <h2 className="text-2xl font-bold">18</h2>
            <p>Pending Tasks</p>
          </div>
          <div className="bg-blue-100 text-blue-600 rounded-md p-4">
            <h2 className="text-2xl font-bold">289</h2>
            <p>Completed Tasks</p>
          </div>
          <div className="bg-red-100 text-red-600 rounded-md p-4 sm:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <h2 className="text-2xl font-bold">6</h2>
                <p>Priority Tasks</p>
              </div>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="bg-gray-50 p-4 rounded-md shadow-sm mb-6">
          <div className="mb-2 flex items-center gap-2 flex-wrap">
            <h3 className="font-medium">Project:</h3>
            <select
              className="bg-transparent font-semibold text-black cursor-pointer focus:outline-none"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              {projects.map((proj, idx) => (
                <option key={idx} value={proj}>
                  {proj}
                </option>
              ))}
            </select>
            <span className="font-bold">- Completed Tasks Overview</span>
          </div>

          <div className="w-full h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="tasks" fill="#60A5FA" />
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
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              {projects.map((proj, idx) => (
                <option key={idx} value={proj}>
                  {proj}
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
              {[
                {
                  name: "Muhammad Jazib",
                  role: "Frontend",
                  date: "7 July 2025",
                  email: "mjxdex@gmail.com",
                  status: "Invited",
                },
                {
                  name: "Basit Isz",
                  role: "Backend",
                  date: "7 July 2025",
                  email: "mjxdex@gmail.com",
                  status: "Accepted",
                },
                {
                  name: "Haya Fatima",
                  role: "Unit Testing",
                  date: "28 July 2025",
                  email: "mjxdex@gmail.com",
                  status: "Accepted",
                },
              ].map((member, idx) => (
                <tr key={idx}>
                  <td className="bg-[#F5F5F5] px-3 py-2 rounded-md">
                    {member.name}
                  </td>
                  <td className="bg-[#F5F5F5] px-3 py-2 rounded-md">
                    {member.role}
                  </td>
                  <td className="bg-[#F5F5F5] px-3 py-2 rounded-md">
                    {member.date}
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
