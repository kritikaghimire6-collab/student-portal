import { pool } from '../db.js';


export const markAttendance = async ({ enrollment_id, date, status }) => {
const [result] = await pool.query(
'INSERT INTO attendance (enrollment_id, date, status) VALUES (?,?,?) ON DUPLICATE KEY UPDATE status=VALUES(status)',
[enrollment_id, date, status]
);
return { id: result.insertId || null };
};


export const getAttendanceSummary = async ({ student_id, course_code }) => {
const [rows] = await pool.query(
`SELECT
SUM(CASE WHEN a.status='PRESENT' THEN 1 ELSE 0 END) as presents,
COUNT(*) as total
FROM attendance a
JOIN enrollments e ON a.enrollment_id=e.id
JOIN courses c ON e.course_id=c.id
WHERE e.student_id=? AND c.code=?`,
[student_id, course_code]
);
return rows[0];
};


export const getAttendanceByEnrollment = async (enrollment_id) => {
const [rows] = await pool.query('SELECT date, status FROM attendance WHERE enrollment_id=? ORDER BY date DESC', [enrollment_id]);
return rows;
};