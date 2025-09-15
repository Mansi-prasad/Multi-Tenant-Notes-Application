import React from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FiFileText, FiSettings } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
export default function Dashboard() {
  const { user } = React.useContext(AuthContext);

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* welcome card */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h1 className="text-2xl font-semibold text-gray-900 ">Welcome back, </h1>
        <div className="flex items-center gap-3 ">
          <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600">
            <FaUser size={16} />
          </div>
          <span className="text-indigo-600">{user?.email}</span>
        </div>
        <div className="mt-3 text-sm text-gray-600 flex flex-wrap gap-6">
          <span>
            <span className="font-medium text-gray-800">Tenant:</span>{" "}
            {user?.tenant}
          </span>
          <span>
            <span className="font-medium text-gray-800">Role:</span>{" "}
            {user?.role}
          </span>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Notes card */}
        <Link
          to="/notes"
          className="group bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg hover:border-green-200 transition-all duration-200 flex flex-col"
        >
          <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-green-50 text-green-600 group-hover:bg-green-100 mb-4">
            <FiFileText size={24} />
          </div>
          <h4 className="font-semibold text-gray-900">Notes</h4>
          <p className="text-sm text-gray-500 mt-2">
            Create, edit, and manage notes with your team.
          </p>
        </Link>

        {/* Admin Card (only for Admins) */}
        {user?.role === "Admin" && (
          <Link
            to="/admin"
            className="group bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg hover:border-red-200 transition-all duration-200 flex flex-col"
          >
            <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-red-50 text-red-600 group-hover:bg-red-100 mb-4">
              <FiSettings size={24} />
            </div>
            <h4 className="font-semibold text-gray-900">Admin Panel</h4>
            <p className="text-sm text-gray-500 mt-2">
              Manage users and tenant subscription settings.
            </p>
          </Link>
        )}
      </div>
    </div>
  );
}
