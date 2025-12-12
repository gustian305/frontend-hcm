import React from "react";
import { AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white shadow-lg rounded-2xl p-10 max-w-md w-full text-center"
      >
        <div className="flex justify-center mb-6">
          <AlertCircle className="w-16 h-16 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page.
        </p>
        <button 
          className="w-full px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </motion.div>
    </div>
  );
}