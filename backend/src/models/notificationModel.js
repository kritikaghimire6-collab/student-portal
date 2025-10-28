// backend/src/models/notificationModel.js
import { pool } from '../db.js';

export async function logNotification({
  parent_email,
  student_id,
  course_code,
  percentage,
  status,
  error_text = null
}) {
  const [result] = await pool.query(
    `INSERT INTO notifications
       (parent_email, student_id, course_code, percentage, status, error_text)
     VALUES (?,?,?,?,?,?)`,
    [parent_email, student_id, course_code, percentage, status, error_text]
  );
  return { id: result.insertId };
}

// Optional: quick fetcher if you later build a UI
export async function listNotificationsByStudent(student_id) {
  const [rows] = await pool.query(
    `SELECT id, parent_email, course_code, percentage, status, error_text, created_at
     FROM notifications
     WHERE student_id = ?
     ORDER BY id DESC
     LIMIT 100`,
    [student_id]
  );
  return rows;
}
