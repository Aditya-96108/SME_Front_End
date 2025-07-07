"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ErrorBanner from "@/components/common/ErrorBanner.tsx";
import OtpModal from "@/components/common/OtpModal.tsx";
import Link from "next/link";

const BACKEND_URL = "http://localhost:8080";

export default function AdminSignInPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [otpRequired, setOtpRequired] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const email = sessionStorage.getItem("adminEmail");
    if (email) {
      setFormData((prev) => ({ ...prev, email }));
      sessionStorage.removeItem("adminEmail"); // Clear after retrieval
    } else {
      router.push("/auth/signin"); // Redirect if no email in sessionStorage
    }
  }, [router]);

  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => setShowError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setShowError(false);

    if (!formData.name.trim()) {
      setError("Admin name is required");
      setShowError(true);
      setLoading(false);
      return;
    }

    try {
      const body = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        type: "signin",
      };

      console.log("Sending admin signin request:", body);
      const response = await fetch(`${BACKEND_URL}/api/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const contentType = response.headers.get("Content-Type");
      let data;
      if (contentType?.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      console.log("Admin signin response:", data);

      if (response.ok) {
        if (typeof data === "string" && data.includes("OTP sent")) {
          setOtpRequired(true);
        } else if (data.token && data.role) {
          const redirectPath = "/admin/dashboard";
          window.location.href = redirectPath;
        } else {
          setError("Unexpected response from server");
          setShowError(true);
        }
      } else {
        setError(data.message || data || "Admin sign-in failed");
        setShowError(true);
      }
    } catch (err) {
      console.error("Admin signin error:", err);
      setError("Network error occurred");
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (otp: string) => {
    setLoading(true);
    setError("");
    setShowError(false);

    try {
      const body = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        type: "signin",
        otp,
      };

      console.log("Sending OTP verification request:", body);
      const response = await fetch(`${BACKEND_URL}/api/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const contentType = response.headers.get("Content-Type");
      let data;
      if (contentType?.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      console.log("OTP verification response:", data);

      if (response.ok) {
        if (data.token && data.role) {
          setOtpRequired(false);
          const redirectPath = "/admin/dashboard";
          window.location.href = redirectPath;
        } else {
          setError("Invalid OTP or missing role");
          setShowError(true);
        }
      } else {
        setError(data.message || data || "OTP verification failed");
        setShowError(true);
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      setError("Network error occurred");
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-md rounded-xl bg-white dark:bg-gray-800 p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Admin Sign In</h2>
        <p className="text-sm text-gray-500 dark:text-gray-300 mb-6">
          Please provide your admin credentials
        </p>

        <div className="mb-6">
          <Link href="/auth/signin" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            Back to Sign In
          </Link>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="admin@example.com"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-black dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Admin Name"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-black dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-black dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 w-full rounded-md bg-blue-600 py-2 text-white font-semibold hover:bg-blue-700 disabled:bg-blue-400 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
          disabled={loading}
        >
          {loading ? "Processing..." : "Sign In"}
        </button>
      </div>

      {showError && <ErrorBanner message={error} />}
      <OtpModal
        isOpen={otpRequired}
        onClose={() => setOtpRequired(false)}
        onSubmit={handleOtpSubmit}
        loading={loading}
      />
    </div>
  );
}