// backend/src/controllers/parentController.js
import { pool } from "../db.js";

/**
 * Ensure the logged-in parent actually belongs to the child (by email match).
 * Returns the student row if okay; throws 403/404 otherwise.
 */
async function assertParentOwnsChild(req, res) {
  const childId = Number(req.params.childId);
  if (!childId) {
    res.status(400).json({ message: "Invalid childId" });
    throw new Error("abort");
  }

  const parentEmail = String(req.user?.email || "").trim().toLowerCase();
  if (!parentEmail) {
    res.status(401).json({ message: "Unauthorized" });
    throw new Error("abort");
  }

  const [rows] = await pool.query(
    `SELECT id, user_id, roll_no, LOWER(TRIM(parent_email)) AS parent_email
     FROM students WHERE id = ? LIMIT 1`,
    [childId]
  );
  const s = rows[0];
  if (!s) {
    res.status(404).json({ message: "Child (student) not found" });
    throw new Error("abort");
  }
  if (s.parent_email !== parentEmail) {
    res.status(403).json({ message: "Insufficient permissions for this child" });
    throw new Error("abort");
  }
  return s;
}

/** GET /api/parents/children  */
export async function myChildren(req, res) {
  try {
    const email = String(req.user?.email || "").trim().toLowerCase();
    const [rows] = await pool.query(
      `SELECT s.id AS student_id, s.roll_no, s.program, s.semester
       FROM students s
       WHERE LOWER(TRIM(s.parent_email)) = ? 
       ORDER BY s.id`,
      [email]
    );
    res.json({ children: rows });
  } catch (err) {
    console.error("[myChildren] err:", err);
    if (err.message !== "abort") res.status(500).json({ message: "Server error" });
  }
}

/** GET /api/parents/children/:childId/attendance-summary?course_code=BIM101 */
export async function childAttendanceSummary(req, res) {
  try {
    const student = await assertParentOwnsChild(req, res);
    const courseCode = String(req.query.course_code || "").trim().toUpperCase();
    if (!courseCode) return res.status(400).json({ message: "course_code is required" });

    // Resolve enrollment for (childId, course_code)
    const [erows] = await pool.query(
      `SELECT e.id AS enrollment_id, c.title
       FROM enrollments e
       JOIN courses c ON c.id = e.course_id
       WHERE e.student_id = ? AND c.code = ?
       LIMIT 1`,
      [student.id, courseCode]
    );
    const enr = erows[0];
    if (!enr) {
      return res.status(404).json({ message: "Child is not enrolled in this course" });
    }

    // Attendance summary
    const [rows] = await pool.query(
      `SELECT
         SUM(CASE WHEN a.status='PRESENT' THEN 1 ELSE 0 END) AS present,
         COUNT(*) AS total
       FROM attendance a
       WHERE a.enrollment_id = ?`,
      [enr.enrollment_id]
    );
    const present = Number(rows[0]?.present || 0);
    const total = Number(rows[0]?.total || 0);
    const absent = total - present;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    res.json({
      student_id: student.id,
      course_code: courseCode,
      course_title: enr.title,
      present,
      absent,
      total_classes: total,
      percentage
    });
  } catch (err) {
    if (err.message === "abort") return;
    console.error("[childAttendanceSummary] err:", err);
    res.status(500).json({ message: "Server error" });
  }
}

/** GET /api/parents/children/:childId/marks?course_code=BIM101 */
export async function childMarks(req, res) {
  try {
    const student = await assertParentOwnsChild(req, res);
    const courseCode = String(req.query.course_code || "").trim().toUpperCase();
    if (!courseCode) return res.status(400).json({ message: "course_code is required" });

    // Resolve enrollment
    const [erows] = await pool.query(
      `SELECT e.id AS enrollment_id
       FROM enrollments e
       JOIN courses c ON c.id = e.course_id
       WHERE e.student_id = ? AND c.code = ?
       LIMIT 1`,
      [student.id, courseCode]
    );
    const enr = erows[0];
    if (!enr) {
      return res.status(404).json({ message: "Child is not enrolled in this course" });
    }

    // Fetch marks
    const [mrows] = await pool.query(
      `SELECT assessment, score, max_score, created_at
       FROM marks
       WHERE enrollment_id = ?
       ORDER BY created_at DESC`,
      [enr.enrollment_id]
    );

    res.json({
      student_id: student.id,
      course_code: courseCode,
      marks: mrows
    });
  } catch (err) {
    if (err.message === "abort") return;
    console.error("[childMarks] err:", err);
    res.status(500).json({ message: "Server error" });
  }
}
