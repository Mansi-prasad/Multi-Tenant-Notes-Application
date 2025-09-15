import React, { useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import * as api from "../lib/api";
import toast from "react-hot-toast";

export default function AdminPanel() {
  const { token, user } = React.useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Member");
  const [message, setMessage] = useState(null);
  const [tenantPlan, setTenantPlan] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const notes = await api.getNotes(token);
        setTenantPlan(notes.length >= 3 ? "3+ notes" : "free");
      } catch {
        setTenantPlan("unknown");
      }
    }
    load();
  }, [token]);

  async function invite(e) {
    e.preventDefault();
    setMessage(null);
    try {
      const res = await api.inviteUser(token, user.tenant, email, role);
      setMessage({
        type: "success",
        text: `Invited ${res.user.email} (${res.user.role})`,
      });
      setEmail("");
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Invite failed" });
    }
  }

  async function upgrade() {
    if (!confirm("Upgrade tenant to Pro?")) return;
    try {
      const response = await api.upgradeTenant(token, user.tenant);
      if (response.plan === "pro") {
        toast.success("Tenant is already on Pro plan.");
      }
      setMessage({
        type: "success",
        text: "Tenant upgraded to Pro. Note limit removed.",
      });
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Upgrade failed" });
    }
  }

  if (user?.role !== "Admin") {
    return (
      <div className="bg-white p-6 rounded shadow">You are not an admin.</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded shadow">
        <h3 className="font-semibold">Tenant: {user?.tenant}</h3>
        <p className="text-sm text-slate-600 mt-1">
          Plan: {tenantPlan ?? "loading..."}
        </p>
        <div className="mt-4">
          <button
            onClick={upgrade}
            className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 hover:cursor-pointer"
          >
            Upgrade to Pro
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h4 className="font-semibold text-lg">Invite user</h4>
        <form onSubmit={invite} className="mt-3 space-y-3">
          <div>
            <label className="block text-sm text-slate-600">Email</label>
            <input
              className="mt-1 w-full border rounded px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter Email"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600">Role</label>
            <select
              className="mt-1 w-full border rounded px-3 py-2"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option>Member</option>
              <option>Admin</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="submit"
              className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 hover:cursor-pointer"
            >
              Invite
            </button>
          </div>
        </form>
        {message && (
          <div
            className={`mt-3 p-2 rounded ${
              message.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}
