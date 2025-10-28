// src/routes/studentRoutes.js
import { Router } from "express";
import { pool } from "../db.js";
import { auth } from "../middleware/auth.js";
import { allow } from "../middleware/roles.js";

const router = Router();

/**
 * GET /api/students/me
 * Requires JWT
 * Returns a flat student object: { id, user_id, full_name, email, roll_no, program, semester, parent_email }
 */
router.get("/me", auth, allow("STUDENT"), async (req, res) => {
  try {
    // Our JWT middleware sets req.user = { id, role, email }
    const userId = req.user?.id; // ✅ use id (not sub)

    const [rows] = await pool.query(
      `SELECT 
         s.id           AS id,
         s.user_id      AS user_id,
         u.full_name    AS full_name,
         u.email        AS email,
         s.roll_no      AS roll_no,
         s.program      AS program,
         s.semester     AS semester,
         s.parent_email AS parent_email
       FROM students s
       JOIN users u ON u.id = s.user_id
       WHERE s.user_id = ?
       LIMIT 1`,
      [userId]
    );

    const me = rows[0];
    if (!me) return res.status(404).json({ message: "Student profile not found" });
    return res.json(me);
  } catch (err) {
    console.error("[GET /api/students/me] error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * OPTIONAL: If you want the student profile + enrollments in one call:
 * GET /api/students/me/full
 */
router.get("/me/full", auth, allow("STUDENT"), async (req, res) => {
  try {
    const userId = req.user?.id;

    const [srows] = await pool.query(
      `SELECT 
         s.id           AS id,
         s.user_id      AS user_id,
         u.full_name    AS full_name,
         u.email        AS email,
         s.roll_no      AS roll_no,
         s.program      AS program,
         s.semester     AS semester,
         s.parent_email AS parent_email
       FROM students s
       JOIN users u ON u.id = s.user_id
       WHERE s.user_id = ?
       LIMIT 1`,
      [userId]
    );

    const student = srows[0];
    if (!student) return res.status(404).json({ message: "Student profile not found" });

    const [enrollments] = await pool.query(
      `SELECT 
         e.id    AS enrollment_id,
         c.id    AS course_id,
         c.code  AS code,
         c.title AS title,
         c.credit AS credit
       FROM enrollments e
       JOIN courses c ON c.id = e.course_id
       WHERE e.student_id = ?`,
      [student.id]
    );

    return res.json({ student, enrollments });
  } catch (err) {
    console.error("[GET /api/students/me/full] error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
