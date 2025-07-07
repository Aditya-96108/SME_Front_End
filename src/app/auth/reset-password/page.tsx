// "use client";

// import { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import Link from "next/link";
// import ErrorBanner from "@/components/common/ErrorBanner.tsx";

// const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

// export default function ResetPasswordPage() {
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [showError, setShowError] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [token, setToken] = useState("");
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   useEffect(() => {
//     const tokenFromUrl = searchParams.get("token");
//     if (tokenFromUrl) {
//       setToken(tokenFromUrl);
//     } else {
//       setError("Invalid or missing token");
//       setShowError(true);
//     }
//   }, [searchParams]);

//   useEffect(() => {
//     if (showError) {
//       const timer = setTimeout(() => setShowError(false), 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [showError]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");
//     setError("");
//     setShowError(false);

//     if (!newPassword.trim() || !confirmPassword.trim()) {
//       setError("Both password fields are required");
//       setShowError(true);
//       setLoading(false);
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       setError("Passwords do not match");
//       setShowError(true);
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch(`${BACKEND_URL}/api/auth/reset-password`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ token, newPassword }),
//       });

//       const data = await response.text();
//       console.log("Reset password response:", data);

//       if (response.ok) {
//         setMessage(data);
//         setTimeout(() => router.push("/auth/signin"), 2000);
//       } else {
//         setError(data || "Failed to reset password");
//         setShowError(true);
//       }
//     } catch (err) {
//       console.error("Reset password error:", err);
//       setError("Network error occurred");
//       setShowError(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4">
//       <div className="w-full max-w-md rounded-xl bg-white dark:bg-gray-800 p-8 shadow-lg">
//         <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Reset Password</h2>
//         <p className="text-sm text-gray-500 dark:text-gray-300 mb-6">
//           Enter your new password
//         </p>

//         <div className="mb-6">
//           <Link href="/auth/signin" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
//             Back to Sign In
//           </Link>
//         </div>

//         <div className="space-y-6">
//           <div>
//             <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
//               New Password
//             </label>
//             <input
//               id="newPassword"
//               type="password"
//               placeholder="Enter new password"
//               required
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//               className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-black dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               disabled={loading}
//             />
//           </div>

//           <div>
//             <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
//               Confirm Password
//             </label>
//             <input
//               id="confirmPassword"
//               type="password"
//               placeholder="Confirm new password"
//               required
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-black dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               disabled={loading}
//             />
//           </div>

//           <button
//             onClick={handleSubmit}
//             className="mt-6 w-full rounded-md bg-blue-600 py-2 text-white font-semibold hover:bg-blue-700 disabled:bg-blue-400 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
//             disabled={loading}
//           >
//             {loading ? "Processing..." : "Reset Password"}
//           </button>
//         </div>

//         {message && (
//           <p className="mt-4 text-sm text-green-600 dark:text-green-400 text-center">
//             {message}
//           </p>
//         )}
//         {showError && <ErrorBanner message={error} />}
//       </div>
//     </div>
//   );
// }


"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import ErrorBanner from "@/components/common/ErrorBanner";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    console.log("Token from URL:", tokenFromUrl);
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError("Invalid or missing token");
      setShowError(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => setShowError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    setShowError(false);

    if (!newPassword.trim() || !confirmPassword.trim()) {
      setError("Both password fields are required");
      setShowError(true);
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setShowError(true);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
        credentials: "include",
      });

      const data = await response.text();
      console.log("Reset password response:", data);

      if (response.ok) {
        setMessage(data);
        setTimeout(() => router.push("/auth/signin"), 2000);
      } else {
        setError(data || "Failed to reset password");
        setShowError(true);
      }
    } catch (err) {
      console.error("Reset password error:", err);
      setError("Network error occurred");
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-md rounded-xl bg-white dark:bg-gray-800 p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Reset Password</h2>
        <p className="text-sm text-gray-500 dark:text-gray-300 mb-6">
          Enter your new password
        </p>

        <div className="mb-6">
          <Link href="/auth/signin" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            Back to Sign In
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              placeholder="Enter new password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
              placeholder="Confirm new password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-black dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-md bg-blue-600 py-2 text-white font-semibold hover:bg-blue-700 disabled:bg-blue-400 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
            disabled={loading}
          >
            {loading ? "Processing..." : "Reset Password"}
          </button>
        </form>

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