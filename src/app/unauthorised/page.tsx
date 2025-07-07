"use client";

import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-md rounded-xl bg-white dark:bg-gray-800 p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Unauthorized</h2>
        <p className="text-sm text-gray-500 dark:text-gray-300 mb-6">
          You do not have permission to access this page.
        </p>
        <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
          Go back to home
        </Link>
      </div>
    </div>
  );
}