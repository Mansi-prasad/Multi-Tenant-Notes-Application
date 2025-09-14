import express from "express";
const router = express.Router();
import { login } from "../controllers/auth.controller.js";

// POST /api/auth/login
router.post("/login", login);

export default router;
