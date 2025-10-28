// backend/src/crons/lowAttendanceCron.js
import cron from "node-cron";
import { pool } from "../db.js";
import { sendLowAttendanceAlert } from "../utils/mailer.js";

// ✅ Runs every day at 8 AM
cron.schedule("0 8 * * *", async () => {
  console.log("[CRON] Checking low attendance alerts...");

  try {
    // Find students below 75% in any course
    const [rows] = await pool.query(`
      SELECT 
        s.id AS student_id,
        s.parent_email,
        c.code AS course_code,
        ROUND((SUM(a.status='PRESENT') / COUNT(*)) * 100) AS percentage
      FROM attendance a
      JOIN enrollments e ON a.enrollment_id = e.id
      JOIN students s ON e.student_id = s.id
      JOIN courses c ON e.course_id = c.id
      WHERE s.parent_email IS NOT NULL
      GROUP BY s.id, c.code
      HAVING percentage < 75;
    `);

    for (const r of rows) {
      console.log(`[CRON] Notifying ${r.parent_email} about student ${r.student_id}`);

      await sendLowAttendanceAlert({
        to: r.parent_email,
        studentName: `Student ID ${r.student_id}`,
        courseCode: r.course_code,
        percentage: r.percentage,
      });
    }

    console.log("[CRON] Low attendance check completed.");
  } catch (err) {
    console.error("[CRON ERROR]", err);
  }
});
