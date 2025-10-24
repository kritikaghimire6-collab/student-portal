import cron from 'node-cron';
import { pool } from './db.js';
import { sendLowAttendanceAlert } from './utils/mailer.js';

export const startSchedulers = () => {
  cron.schedule('0 7 * * *', async () => {
    try {
      const threshold = 75;
      const [rows] = await pool.query(
        `
        SELECT s.id AS student_id, s.roll_no, s.parent_email, c.code AS course_code,
               SUM(CASE WHEN a.status='PRESENT' THEN 1 ELSE 0 END) AS presents,
               COUNT(*) AS total
        FROM attendance a
        JOIN enrollments e ON a.enrollment_id=e.id
        JOIN students s ON e.student_id=s.id
        JOIN courses c ON e.course_id=c.id
        GROUP BY s.id, s.roll_no, s.parent_email, c.code
        HAVING total>0 AND (100*SUM(CASE WHEN a.status='PRESENT' THEN 1 ELSE 0 END)/total) < ?
        `,
        [threshold]
      );
      for (const r of rows) {
        if (r.parent_email) {
          const pct = Math.round((r.presents / r.total) * 100);
          try {
            await sendLowAttendanceAlert({
              to: r.parent_email,
              studentName: r.roll_no,
              courseCode: r.course_code,
              percentage: pct
            });
          } catch {}
        }
      }
      console.log(`[scheduler] low-attendance alerts sent: ${rows.length}`);
    } catch (e) {
      console.error('[scheduler] error:', e.message);
    }
  });
};
