// backend/src/middleware/auth.js
import jwt from "jsonwebtoken";

/**
 * Express middleware: require a valid Bearer token.
 * Normalizes req.user so both `.id` and `.sub` are present.
 */
export function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Missing token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    req.user = {
      id: payload.sub ?? payload.id,
      sub: payload.sub ?? payload.id,
      role: payload.role,
      email: payload.email,
    };
    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid/expired token" });
  }
}

/**
 * Helper used by authController to mint tokens for a user record.
 * Returns { access, refresh }.
 */
export function issueTokens(user) {
  const access = jwt.sign(
    { sub: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET || "dev-secret",
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );

  const refresh = jwt.sign(
    { sub: user.id },
    process.env.REFRESH_SECRET || "dev-refresh",
    { expiresIn: process.env.REFRESH_EXPIRES_IN || "7d" }
  );

  return { access, refresh };
}
