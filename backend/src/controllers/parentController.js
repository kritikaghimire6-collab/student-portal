import { pool } from '../db.js';

export const myChildren = async (req, res, next) => {
  try {
    const email = req.user.email;
    const [rows] = await pool.query(
      'SELECT id, roll_no, program, semester FROM students WHERE parent_email = ?',
      [email]
    );
    res.json(rows);
  } catch (e) { next(e); }
};

export const childAttendanceSummary = async (req, res, next) => {
  try {
    const child_id = Number(req.params.childId);
    const [rows] = await pool.query(
      `
      SELECT c.code AS course_code,
             SUM(CASE WHEN a.status='PRESENT' THEN 1 ELSE 0 END) AS presents,
             COUNT(*) AS total
      FROM attendance a
      JOIN enrollments e ON a.enrollment_id=e.id
      JOIN courses c ON e.course_id=c.id
      WHERE e.student_id=?
      GROUP BY c.code
      ORDER BY c.code
      `,
      [child_id]
    );
    res.json(rows);
  } catch (e) { next(e); }
};

export const childMarks = async (req, res, next) => {
  try {
    const child_id = Number(req.params.childId);
    const [rows] = await pool.query(
      `
      SELECT c.code, c.title, m.assessment, m.score, m.max_score, m.created_at
      FROM marks m
      JOIN enrollments e ON m.enrollment_id = e.id
      JOIN courses c ON e.course_id = c.id
      WHERE e.student_id = ?
      ORDER BY c.code, m.created_at DESC
      `,
      [child_id]
    );
    res.json(rows);
  } catch (e) { next(e); }
};
