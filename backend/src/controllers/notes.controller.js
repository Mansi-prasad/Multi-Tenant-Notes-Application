import Note from "../models/note.model.js";
import Tenant from "../models/tenant.model.js";
import mongoose from "mongoose";

const FREE_PLAN_NOTE_LIMIT = 3;

// POST : create a note with enforce tenant limit
export async function createNote(req, res) {
  try {
    const { title, content } = req.body || {};
    if (!title) return res.status(400).json({ error: "title is required" });

    const tenant = await Tenant.findById(req.user.tenantId);
    if (!tenant) return res.status(400).json({ error: "Tenant not found" });

    if (tenant.plan === "free") {
      const count = await Note.countDocuments({ tenant: req.user.tenantId });
      if (count >= FREE_PLAN_NOTE_LIMIT) {
        return res.status(403).json({ error: "Free plan note limit reached" });
      }
    }

    const note = await Note.create({
      title,
      content,
      tenant: req.user.tenantId,
      author: req.user.id,
    });

    return res.status(201).json(note);
  } catch (err) {
    console.log("Error to create note:", err);
    res.status(500).json({ message: `Error! ${err.message}` });
  }
}

// GET : list all notes for current tenant
export async function listNotes(req, res) {
  try {
    const notes = await Note.find({ tenant: req.user.tenantId }).sort({
      createdAt: -1,
    });
    return res.json(notes);
  } catch (err) {
    console.log("Error to list note:", err);
    res.status(500).json({ message: `Error! ${err.message}` });
  }
}

// GET : get specific note from tenant
export async function getNote(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid note id" });

    const note = await Note.findOne({ _id: id, tenant: req.user.tenantId });
    if (!note) return res.status(404).json({ error: "Note not found" });

    return res.json(note);
  } catch (err) {
    console.log("Error to get note:", err);
    res.status(500).json({ message: `Error! ${err.message}` });
  }
}

// PUT: update note
export async function updateNote(req, res) {
  try {
    const { id } = req.params;
    const { title, content } = req.body || {};
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid note id" });

    const note = await Note.findOneAndUpdate(
      { _id: id, tenant: req.user.tenantId },
      { title, content, updatedAt: Date.now() },
      { new: true }
    );
    if (!note) return res.status(404).json({ error: "Note not found" });

    return res.json(note);
  } catch (err) {
    console.log("Error to update note:", err);
    res.status(500).json({ message: `Error! ${err.message}` });
  }
}

// DELETE : delete a note
export async function deleteNote(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid note id" });

    const note = await Note.findOneAndDelete({
      _id: id,
      tenant: req.user.tenantId,
    });
    if (!note) return res.status(404).json({ error: "Note not found" });

    return res.json({ message: "Note deleted" });
  } catch (err) {
    console.log("Error to delete note:", err);
    res.status(500).json({ message: `Error! ${err.message}` });
  }
}
