// src/services/attendanceAlerts.js
import { pool } from '../db.js';
import { sendLowAttendanceAlert } from '../utils/mailer.js';

/**
 * Returns rows with: student_id, student_name, roll_no, parent_email, course_code, percentage
 * Only rows with total>0 and percentage<:threshold
 */
export async function findBelowThreshold(threshold = 75) {
  const [rows] = await pool.query(
    `
    SELECT
      s.id                               AS student_id,
      u.full_name                        AS student_name,
      s.roll_no                          AS roll_no,
      s.parent_email                     AS parent_email,
      c.code                             AS course_code,
      SUM(CASE WHEN a.status='PRESENT' THEN 1 ELSE 0 END) AS presents,
      COUNT(a.id)                        AS total,
      ROUND((SUM(CASE WHEN a.status='PRESENT' THEN 1 ELSE 0 END) / COUNT(a.id))*100) AS percentage
    FROM enrollments e
    JOIN students s ON s.id = e.student_id
    JOIN users    u ON u.id = s.user_id
    JOIN courses  c ON c.id = e.course_id
    LEFT JOIN attendance a ON a.enrollment_id = e.id
    GROUP BY s.id, u.full_name, s.roll_no, s.parent_email, c.code
    HAVING total > 0 AND percentage < ?
    ORDER BY s.id, c.code;
    `,
    [threshold]
  );
  return rows;
}

export async function sendBatchLowAttendance(threshold = 75) {
  const rows = await findBelowThreshold(threshold);

  for (const r of rows) {
    if (!r.parent_email) continue;
    try {
      await sendLowAttendanceAlert({
        to: r.parent_email,
        studentName: r.student_name || r.roll_no,
        courseCode: r.course_code,
        percentage: r.percentage,
      });
      console.log(`[MAIL] sent: ${r.parent_email} — ${r.roll_no} ${r.course_code} ${r.percentage}%`);
    } catch (e) {
      console.error('[MAIL] batch send failed:', r.parent_email, e?.message);
    }
  }
  return rows.length;
}
