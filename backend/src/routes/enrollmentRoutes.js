// backend/src/routes/enrollmentRoutes.js
import express from "express";
import { pool } from "../db.js";
import { auth } from "../middleware/auth.js";
import { allow } from "../middleware/roles.js";

const router = express.Router();

/**
 * GET /api/enrollments/me
 * Return the logged-in student's enrollments.
 */
router.get("/me", auth, allow("STUDENT"), async (req, res) => {
  const userId = req.user.id;
  const [studentRows] = await pool.query(
    "SELECT id AS student_id FROM students WHERE user_id = ? LIMIT 1",
    [userId]
  );
  const student = studentRows[0];
  if (!student) return res.status(404).json({ message: "Student not found" });

  const [rows] = await pool.query(
    `SELECT e.id AS enrollment_id, c.code, c.title, c.credit
     FROM enrollments e
     JOIN courses c ON c.id = e.course_id
     WHERE e.student_id = ?`,
    [student.student_id]
  );

  res.json(rows);
});

/**
 * GET /api/enrollments/resolve?student_id=..&course_code=..
 * Resolve an enrollment by (student_id, course_code).
 * Roles allowed: ADMIN, FACULTY, STUDENT, PARENT
 * Parents are further restricted to only their own children.
 */
router.get(
  "/resolve",
  auth,
  allow("ADMIN", "FACULTY", "STUDENT", "PARENT"),
  async (req, res) => {
    try {
      const studentId = Number(req.query.student_id);
      const courseCode = (req.query.course_code || "").trim();

      if (!studentId || !courseCode) {
        return res
          .status(400)
          .json({ message: "student_id and course_code are required" });
      }

      // EXTRA SECURITY: Parents may only access their own child
      if (req.user.role === "PARENT") {
        const [check] = await pool.query(
          "SELECT id FROM students WHERE id = ? AND parent_email = ?",
          [studentId, req.user.email]
        );
        if (!check.length) {
          return res.status(403).json({ message: "Not your child" });
        }
      }

      // Resolve enrollment
      const [rows] = await pool.query(
        `SELECT 
           e.id   AS enrollment_id,
           e.student_id,
           c.id   AS course_id,
           c.code,
           c.title
         FROM enrollments e
         JOIN courses c ON c.id = e.course_id
         WHERE e.student_id = ? AND c.code = ?
         LIMIT 1`,
        [studentId, courseCode]
      );

      if (!rows.length) {
        return res.status(404).json({ message: "Not Found" });
      }

      return res.json(rows[0]);
    } catch (err) {
      console.error("[/api/enrollments/resolve] error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
