import express from "express";
const router = express.Router();
import auth from "../middleware/auth.middleware.js";
import {createNote, listNotes,getNote,updateNote,deleteNote} from "../controllers/notes.controller.js";

// protected  all notes endpoints
router.post("/", auth, createNote);
router.get("/", auth, listNotes);
router.get("/:id", auth, getNote);
router.put("/:id", auth, updateNote);
router.delete("/:id", auth, deleteNote);

export default router;
