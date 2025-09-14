import express from "express";
const router = express.Router();
import auth from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { invite, upgrade } from "../controllers/tenants.controller.js";

// Invite user into tenant (Admin only)
// POST /api/tenants/:slug/invite 
router.post("/:slug/invite", auth, requireRole("Admin"), invite);

// Upgrade tenant (Admin only)
// POST /api/tenants/:slug/upgrade
router.post("/:slug/upgrade", auth, requireRole("Admin"), upgrade);

export default router;
