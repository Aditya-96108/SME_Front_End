import { useState } from "react";

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (otp: string) => void;
  loading: boolean;
}

export default function OtpModal({ isOpen, onClose, onSubmit, loading }: OtpModalProps) {
  const [otp, setOtp] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(otp);
    setOtp(""); // Clear OTP input after submission
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Enter OTP</h2>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-black dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter OTP"
          disabled={loading}
        />
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:bg-blue-400"
            disabled={loading}
          >
            {loading ? "Processing..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}