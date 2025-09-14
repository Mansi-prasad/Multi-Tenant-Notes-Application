import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { login } = React.useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed");
    }
  }

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-50 px-4 pt-10">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
        {/* Heading */}
        <h2 className="text-indigo-600 text-3xl font-bold mb-6 text-center">
          Sign in
        </h2>
        {/* Error */}
        {error && (
          <div className="flex items-center space-x-3 bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg shadow-sm mb-4">
            {/* Icon */}
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}
        {/* Form */}
        <form onSubmit={submit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors duration-200"
            />
          </div>
          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              value={password}
              type="password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors duration-200"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors duration-200"
          >
            Sign in
          </button>
        </form>

        {/* Test Accounts */}
        <div className="mt-6 text-sm text-gray-500">
          <p>
            Test accounts (password: <b>password</b>):
          </p>
          <ul className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 list-none justify-center">
            <li className="text-left">admin@acme.test</li>
            <li className="text-left">user@acme.test</li>
            <li className="text-left">admin@globex.test</li>
            <li className="text-left">user@globex.test</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
