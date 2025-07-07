"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import ErrorBanner from "@/components/common/ErrorBanner.tsx";
import OtpModal from "@/components/common/OtpModal.tsx";

const BACKEND_URL = "http://localhost:8080";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [otpRequired, setOtpRequired] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);

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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setShowError(true);
      setLoading(false);
      return;
    }

    try {
      const body = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        type: "signup",
      };

      console.log("Sending signup request:", body);
      const response = await fetch(`${BACKEND_URL}/api/auth/signup`, {
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

      console.log("Signup response:", data);

      if (response.ok) {
        if (typeof data === "string" && data.includes("OTP sent")) {
          setOtpRequired(true);
        } else if (data.includes("Student registered successfully")) {
          window.location.href = "/auth/signin";
        } else {
          setError("Unexpected response from server");
          setShowError(true);
        }
      } else {
        setError(data.message || data || "Sign-up failed");
        setShowError(true);
      }
    } catch (err) {
      console.error("Signup error:", err);
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
        name: formData.name,
        email: formData.email,
        password: formData.password,
        type: "signup",
        otp,
      };

      console.log("Sending OTP verification request:", body);
      const response = await fetch(`${BACKEND_URL}/api/auth/signup`, {
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
        if (data.includes("Student registered successfully")) {
          setOtpRequired(false);
          window.location.href = "/auth/signin";
        } else {
          setError("Invalid OTP or unexpected response");
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
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Join Exam Portal</h2>
        <p className="text-sm text-gray-500 dark:text-gray-300 mb-6">
          Create your account to get started
        </p>

        <div className="mb-6">
          <Link href="/auth/signin" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            Already have an account? Sign In
          </Link>
        </div>

        <div>
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-black dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={formData.email}
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
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
            {loading ? "Processing..." : "Sign Up"}
          </button>

          <div className="mt-4 text-center">
            <button
              onClick={() => window.location.href = `${BACKEND_URL}/oauth2/authorization/google`}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-2"
              disabled={loading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l2.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign Up with Google
            </button>
          </div>
        </div>
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