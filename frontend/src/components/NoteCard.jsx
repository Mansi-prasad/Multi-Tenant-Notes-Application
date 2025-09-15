import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { GrNotes } from "react-icons/gr";
export default function NoteCard({ note, onEdit, onDelete }) {
  return (
    <div className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 w-full border border-slate-100">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <GrNotes className="text-slate-400 text-xl" />
          <h3 className="font-semibold text-lg text-slate-800 tracking-tight">
            {note.title}
          </h3>
        </div>

        {/* Edit delete Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="p-2 rounded-full hover:bg-slate-200 transition hover:cursor-pointer"
            title="Edit"
          >
            <FiEdit2 className="text-slate-600" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-full hover:bg-red-200 transition hover:cursor-pointer"
            title="Delete"
          >
            <FiTrash2 className="text-red-500" />
          </button>
        </div>
      </div>

      {/* Content */}
      <p className="mt-3 text-sm text-slate-600 leading-relaxed line-clamp-4">
        {note.content || (
          <span className="text-slate-300">No content available...</span>
        )}
      </p>

      {/* Bottom */}
      <div className="mt-5 flex items-center justify-between text-xs text-slate-400">
        <span>{new Date(note.createdAt).toLocaleString()}</span>
        <span className="px-2 py-1 bg-slate-200/60 text-slate-600 rounded-full text-[11px] font-medium">
          Note
        </span>
      </div>
    </div>
  );
}
