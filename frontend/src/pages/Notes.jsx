import React, { useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import * as api from "../lib/api";
import NoteCard from "../components/NoteCard";
import NoteEditor from "../components/NoteEditor";
import { GrNotes } from "react-icons/gr";
import { LuLoaderCircle } from "react-icons/lu";
import toast from "react-hot-toast";

export default function Notes() {
  const { token, user } = React.useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [error, setError] = useState(null);
  const [plan, setPlan] = useState("free");

  async function loadNotes() {
    try {
      setLoading(true);
      const data = await api.getNotes(token);
      setNotes(data);
    } catch (err) {
      setError(err.message || "Failed to load notes");
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotes();
  }, [token]);

  async function handleCreate(payload) {
    try {
      console.log(token);
      await api.createNote(token, payload);
      await loadNotes();
    } catch (err) {
      console.log(err);
      setError(err.message || "Failed to create note");
      toast.error("Failed to create note");
    }
  }

  async function handleUpdate(id, payload) {
    try {
      await api.updateNote(token, id, payload);
      setEditingNote(null);
      await loadNotes();
    } catch (err) {
      setError(err.message || "Failed to update note");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this note?")) return;
    try {
      await api.deleteNote(token, id);
      await loadNotes();
    } catch (err) {
      setError(err.message || "Failed to delete note");
    }
  }

  const freeLimitReached = plan === "free" && notes.length >= 3;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded shadow">
        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <GrNotes size={20} />
            <h2 className="text-xl font-bold">
              Notes for <span className="text-indigo-600">{user?.tenant}</span>
            </h2>
          </div>
          <div className="text-sm text-slate-500">
            Role: <b>{user?.role}</b>
          </div>
        </div>

        <div className="mt-4">
          <NoteEditor onSubmit={handleCreate} disabled={freeLimitReached} />
          {freeLimitReached && (
            <div className="mt-3 p-3 rounded bg-yellow-50 border border-yellow-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-800">
                    Your tenant is on the Free plan and has reached the 3-note
                    limit.
                  </p>
                  <p className="text-xs text-yellow-700">
                    Upgrade to Pro to lift the limit.
                  </p>
                </div>
                <div>
                  {user?.role === "Admin" ? (
                    <UpgradeButton
                      tenantSlug={user?.tenant}
                      token={token}
                      onUpgrade={loadNotes}
                      setPlan={setPlan}
                    />
                  ) : (
                    <div className="text-sm text-slate-600">
                      Ask an admin to upgrade
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 w-full">
        {loading ? (
          <div className="flex justify-center items-center w-full col-span-full py-12 text-slate-500">
            <LuLoaderCircle className="animate-spin text-2xl mr-2" />
            <span>Loading notes...</span>
          </div>
        ) : (
          notes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onEdit={() => setEditingNote(note)}
              onDelete={() => handleDelete(note._id)}
            />
          ))
        )}
      </div>

      {editingNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white p-4 rounded max-w-2xl w-full">
            <h3 className="font-semibold mb-2">Edit Note</h3>
            <NoteEditor
              initial={editingNote}
              onSubmit={(payload) => handleUpdate(editingNote._id, payload)}
              onCancel={() => setEditingNote(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function UpgradeButton({ tenantSlug, token, onUpgrade, setPlan }) {
  const [loading, setLoading] = useState(false);
  async function upgrade() {
    if (!confirm("Upgrade tenant to Pro?")) return;
    setLoading(true);
    try {
      await api.upgradeTenant(token, tenantSlug);
      toast.success("Tenant upgraded to Pro.");
      setPlan("pro");
      await onUpgrade();
    } catch (err) {
      toast.error("Upgrade failed: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={upgrade}
      disabled={loading}
      className="px-3 py-1 bg-indigo-600 text-white rounded"
    >
      {loading ? "Upgrading…" : "Upgrade to Pro"}
    </button>
  );
}
