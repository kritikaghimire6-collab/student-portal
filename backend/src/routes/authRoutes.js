// src/routes/authRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";
import { register } from "../controllers/authController.js";

const router = express.Router();

/** POST /api/auth/login */
router.post("/login", async (req, res) => {
  try {
    const email = (req.body?.email ?? "").trim();
    const password = (req.body?.password ?? "").trim();

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const [rows] = await pool.query(
      "SELECT id, email, password_hash, role, full_name FROM users WHERE email = ? LIMIT 1",
      [email]
    );
    const user = rows[0];

    console.log("[AUTH] payload:", { email, hasPassword: !!password });
    console.log("[AUTH] user found?", !!user, user?.email, user?.role);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials", reason: "user_not_found" });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    console.log("[AUTH] password match?", ok);

    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials", reason: "bad_password" });
    }

    const access = jwt.sign(
      { sub: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET || "dev-secret",
      { expiresIn: "1d" }
    );

    return res.json({
      user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role },
      tokens: { access }
    });
  } catch (err) {
    console.error("[AUTH] login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/** POST /api/auth/register */
router.post("/register", register);

export default router;
