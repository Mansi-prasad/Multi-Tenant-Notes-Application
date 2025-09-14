import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { sign } from "../services/jwt.service.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const user = await User.findOne({ email }).populate("tenant");
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const payload = {
      userId: user._id.toString(),
      tenantId: user.tenant._id.toString(),
      role: user.role,
      tenantSlug: user.tenant.slug,
    };

    const token = sign(payload);

    res.json({
      token,
      user: { email: user.email, role: user.role, tenant: user.tenant.slug },
    });
  } catch (err) {
    console.log("Login Error:", err);
    res.status(500).json({ message: `Error! ${err.message}` });
  }
};
