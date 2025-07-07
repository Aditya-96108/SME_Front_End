"use client";

import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const { isAuthenticated, role, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!isAuthenticated || role !== 'admin')) {
      router.push('/auth/signin');
    }
  }, [isAuthenticated, role, loading, router]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated || role !== 'admin') {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-4xl rounded-xl bg-white dark:bg-gray-800 p-8 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h1>
          <button
            onClick={logout}
            className="rounded-md bg-red-600 py-2 px-4 text-white font-semibold hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
        <p className="text-gray-600 dark:text-gray-300">Welcome, Admin! Manage the portal from here.</p>
      </div>
    </div>
  );
}