"use client";

import Link from "next/link";
import { useState } from "react";
import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EmployeeLoginPage() {
  const [form, setForm] = useState({ email: "", login_pin: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ Call Flask via Next.js rewrite proxy
      const res = await fetch("/api/employee/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 👈 ensures session cookie is stored
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log("Employee Login response:", data);

      if (res.ok) {
        alert("Login successful!");
        router.push("/dashboard/home"); // 👈 redirect after login
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-md rounded-2xl p-8">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-cyan-100 text-cyan-600 p-3 rounded-full">
            <LogIn size={28} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-center text-2xl font-bold text-gray-800">
          Employee Sign In
        </h1>
        <p className="text-center text-gray-500 mt-1 mb-6 text-sm">
          Welcome to{" "}
          <span className="font-semibold text-cyan-600">Projectivity</span> — 
          please enter your credentials.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address *"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none"
            required
          />
          <input
            type="text"
            name="login_pin"
            placeholder="Login PIN *"
            value={form.login_pin}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none"
            required
          />

          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded-lg font-medium shadow"
            disabled={loading}
          >
            {loading ? "Processing..." : "SIGN IN"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Are you an admin?{" "}
          <Link href="/login" className="text-cyan-600 hover:underline">
            Admin Login
          </Link>
        </p>
      </div>
    </div>
  );
}
