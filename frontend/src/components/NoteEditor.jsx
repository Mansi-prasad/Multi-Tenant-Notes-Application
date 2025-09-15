import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function NoteEditor({
  onSubmit,
  initial = null,
  disabled = false,
  onCancel,
}) {
  const [title, setTitle] = useState(initial?.title || "");
  const [content, setContent] = useState(initial?.content || "");
  useEffect(() => {
    setTitle(initial?.title || "");
    setContent(initial?.content || "");
  }, [initial]);

  function submit(e) {
    e.preventDefault();
    if (!title.trim()) return toast.error("Title required");
    onSubmit({ title: title.trim(), content: content.trim() });
    if (!initial) {
      setTitle("");
      setContent("");
    }
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <input
        className="w-full border rounded px-3 py-2"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={disabled}
      />
      <textarea
        className="w-full border rounded px-3 py-2"
        placeholder="Content (optional)"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={disabled}
      />
      <div className="flex items-center space-x-2">
        <button
          type="submit"
          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 hover:cursor-pointer text-white rounded"
          disabled={disabled}
        >
          {initial ? "Save" : "Create"}
        </button>
        {initial && (
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1 border rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
