import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { allow } from "../middleware/roles.js";
import { pool } from "../db.js";

const router = Router();

// GET /api/notifications?student_id=2&course_code=BIM101
router.get("/", auth, allow("ADMIN"), async (req, res) => {
  try {
    const { student_id, course_code } = req.query;

    let sql = `SELECT n.id, n.parent_email, n.student_id, n.course_code,
                      n.percentage, n.status, n.error_text, n.created_at,
                      s.roll_no
               FROM notifications n
               LEFT JOIN students s ON s.id = n.student_id
               WHERE 1=1`;
    const args = [];

    if (student_id) {
      sql += " AND n.student_id = ?";
      args.push(student_id);
    }
    if (course_code) {
      sql += " AND n.course_code = ?";
      args.push(course_code);
    }

    sql += " ORDER BY n.id DESC LIMIT 100";

    const [rows] = await pool.query(sql, args);
    res.json(rows);
  } catch (err) {
    console.error("[GET /api/notifications] error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
