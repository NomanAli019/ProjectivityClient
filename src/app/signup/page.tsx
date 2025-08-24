"use client";

import Link from "next/link";
import { useState } from "react";
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ Call Flask via Next.js rewrite proxy
      const res = await fetch("/api/admin/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: form.firstName,
          last_name: form.lastName,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();
      console.log("Signup response:", data);

      if (!res.ok) {
        alert(data.message || "Signup failed");
      } else {
        alert("Signup successful! Redirecting to login...");
        router.push("/login"); // 👈 redirect to login
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-cyan-100 text-cyan-600 p-3 rounded-full">
            <Lock size={28} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-center text-2xl font-bold text-gray-800">
          Sign Up
        </h1>
        <p className="text-center text-gray-500 mt-1 mb-6 text-sm">
          Welcome to{" "}
          <span className="font-semibold text-cyan-600">Projectivity</span> —  
          let’s get started with your new account.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              name="firstName"
              placeholder="First Name *"
              value={form.firstName}
              onChange={handleChange}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none w-full"
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name *"
              value={form.lastName}
              onChange={handleChange}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none w-full"
              required
            />
          </div>

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
            type="password"
            name="password"
            placeholder="Password *"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none"
            required
          />

          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded-lg font-semibold shadow transition"
            disabled={loading}
          >
            {loading ? "Processing..." : "SIGN UP"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-5">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-cyan-600 font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
