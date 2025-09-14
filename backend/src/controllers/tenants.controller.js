import bcrypt from "bcryptjs";
import Tenant from "../models/tenant.model.js";
import User from "../models/user.model.js";

// POST : Admin of tenant invites (create) a user in same tenant.
export async function invite(req, res) {
  try {
    const { slug } = req.params;
    const { email, role = "Member", password = "password" } = req.body || {};

    // ensure admin operates only inside their tenant
    if (req.user.tenantSlug !== slug) {
      return res
        .status(403)
        .json({ error: "Admins may only invite users into their own tenant" });
    }

    if (!email) return res.status(400).json({ error: "email is required" });
    if (!["Admin", "Member"].includes(role))
      return res.status(400).json({ error: "invalid role" });

    const tenant = await Tenant.findOne({ slug });
    if (!tenant) return res.status(404).json({ error: "Tenant not found" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "User already exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      passwordHash,
      role,
      tenant: tenant._id,
    });

    res.status(201).json({
      message: "User invited (created)",
      user: { email: user.email, role: user.role, tenant: tenant.slug },
    });
  } catch (err) {
    console.log("Error Invite User:", err);
    res.status(500).json({ message: `Error! ${err.message}` });
  }
}

// POST : Admin upgrade tenant plan to pro
export async function upgrade(req, res) {
  try {
    const { slug } = req.params;

    if (req.user.tenantSlug !== slug) {
      return res
        .status(403)
        .json({ error: "Admins may only upgrade their own tenant" });
    }

    const tenant = await Tenant.findOne({ slug });
    if (!tenant) return res.status(404).json({ error: "Tenant not found" });

    tenant.plan = "pro";
    await tenant.save();

    return res.json({ message: "Tenant upgraded", plan: tenant.plan });
  } catch (err) {
    console.log("Error upgrade plan:", err);
    res.status(500).json({ message: `Error! ${err.message}` });
  }
}
