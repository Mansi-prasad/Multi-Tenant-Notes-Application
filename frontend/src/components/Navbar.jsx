import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { token, user, logout } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
            N
          </div>
          <span className="text-2xl font-bold text-gray-900 hover:text-indigo-600 transition-colors duration-200">
            Notes App
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {token && (
            <Link
              to="/notes"
              className="text-lg text-gray-900 hover:text-indigo-600 font-medium transition-colors duration-200"
            >
              Notes
            </Link>
          )}
          {token && user?.role === "Admin" && (
            <Link
              to="/admin"
              className="text-lg text-gray-900 hover:text-indigo-600 font-medium transition-colors duration-200"
            >
              Admin
            </Link>
          )}
          {!token ? (
            <Link
              to="/login"
              className="px-8 py-2 rounded-md bg-indigo-600 text-white font-medium border border-indigo-600 hover:bg-transparent hover:text-indigo-700 hover:border-2 hover:border-indigo-700 transition-colors duration-200"
            >
              Login
            </Link>
          ) : (
            <div className="relative group">
              {/* User Avatar */}
              <button className="flex items-center space-x-2 focus:outline-none">
                <div className="h-9 w-9 bg-indigo-600 text-white flex items-center justify-center rounded-full font-semibold">
                  {user?.email?.[0]?.toUpperCase()}
                </div>
                <span className="text-gray-800 font-medium">{user?.email}</span>
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transform transition-all duration-200 origin-top-right z-20">
                <div className="px-4 py-2 text-sm text-gray-600 border-b border-gray-100">
                  {user?.role} ({user?.tenant})
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </nav>

        {/* For Mobile */}
        <button
          className="md:hidden flex items-center text-gray-700 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden absolute right-4 top-16 w-64 border border-gray-200 bg-white">
          <div className="px-6 py-4 space-y-3 relative">
            {token && (
              <Link
                to="/notes"
                className="block text-gray-900 hover:text-indigo-600 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Notes
              </Link>
            )}
            {token && user?.role === "Admin" && (
              <Link
                to="/admin"
                className="block text-gray-900 hover:text-indigo-600 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            {!token ? (
              <Link
                to="/login"
                className="absolute right-2 top-2 text-center px-4 py-2 rounded-md bg-indigo-600 text-white font-medium border border-indigo-600 hover:bg-transparent hover:text-indigo-700 hover:border-2 hover:border-indigo-700 transition-colors duration-200"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
            ) : (
              <div className="">
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left pb-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
