// Verifies JWT, Attaches user info to req.user, Loads user's tenant to include slug for route checks
import { verify } from "../services/jwt.service.js";
import User from "../models/user.model.js";
import Tenant from "../models/tenant.model.js";

async function auth(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authorization header missing" });
    }
    const token = header.split(" ")[1];
    const payload = verify(token);
    // payload contains userId and tenantId and role and tenantSlug
    if (!payload || !payload.userId)
      return res.status(401).json({ error: "Invalid token payload" });

    // Loading user to ensure they exist and get latest role/tenant
    const user = await User.findById(payload.userId).populate("tenant");
    if (!user) return res.status(401).json({ error: "User not found" });

    // ensure token tenantId matches user's tenant
    if (
      payload.tenantId &&
      user.tenant &&
      payload.tenantId !== user.tenant._id.toString()
    ) {
      return res.status(403).json({ error: "Tenant mismatch" });
    }

    // Attach minimal user info to req for controllers
    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      tenantId: user.tenant._id.toString(),
      tenantSlug: user.tenant.slug,
    };

    next();
  } catch (err) {
    console.log("Auth Error! ", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

export default auth;
