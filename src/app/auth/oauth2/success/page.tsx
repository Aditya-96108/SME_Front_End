"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ErrorBanner from "@/components/common/ErrorBanner";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export default function OAuth2SuccessPage() {
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/auth/verify`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          const errorText = await response.text();
          setError(errorText || "Authentication verification failed");
          setShowError(true);
          return;
        }

        const data = await response.json();
        console.log("Verify response:", data);

        const { role } = data;
        if (role === "ROLE_STUDENT") {
          router.push("/student/dashboard");
        } else if (role === "ROLE_ADMIN") {
          router.push("/admin/dashboard");
        } else {
          setError("Invalid role received");
          setShowError(true);
        }
      } catch (err) {
        console.error("Verification error:", err);
        setError("Network error occurred");
        setShowError(true);
      }
    };

    void verifyUser();
  }, [router]);

  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => setShowError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showError]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-md rounded-xl bg-white dark:bg-gray-800 p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Processing...</h2>
        <p className="text-sm text-gray-500 dark:text-gray-300 mb-6">
          Completing your Google sign-in...
        </p>
        {showError && <ErrorBanner message={error} />}
      </div>
    </div>
  );
}