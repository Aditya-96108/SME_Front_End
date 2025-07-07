"use client";

import { useState } from "react";
import Link from "next/link";
import ErrorBanner from "@/components/common/ErrorBanner.tsx";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    setShowError(false);

    if (!email.trim()) {
      setError("Email is required");
      setShowError(true);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.text();
      console.log("Forgot password response:", data);

      if (response.ok) {
        setMessage(data);
      } else {
        setError(data || "Failed to send reset link");
        setShowError(true);
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setError("Network error occurred");
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-md rounded-xl bg-white dark:bg-gray-800 p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Forgot Password</h2>
        <p className="text-sm text-gray-500 dark:text-gray-300 mb-6">
          Enter your email to receive a password reset link
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
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-black dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <button
            onClick={handleSubmit}
            className="mt-6 w-full rounded-md bg-blue-600 py-2 text-white font-semibold hover:bg-blue-700 disabled:bg-blue-400 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
            disabled={loading}
          >
            {loading ? "Processing..." : "Send Reset Link"}
          </button>
        </div>

        {message && (
          <p className="mt-4 text-sm text-green-600 dark:text-green-400 text-center">
            {message}
          </p>
        )}
        {showError && <ErrorBanner message={error} />}
      </div>
    </div>
  );
}