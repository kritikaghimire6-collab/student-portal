import { pool } from '../db.js';


export const enrollStudent = async ({ student_id, course_id }) => {
const [result] = await pool.query('INSERT INTO enrollments (student_id, course_id) VALUES (?,?)', [student_id, course_id]);
return { id: result.insertId };
};


export const getEnrollmentsByStudent = async (student_id) => {
const [rows] = await pool.query(
`SELECT e.id as enrollment_id, c.code, c.title, c.credit
FROM enrollments e
JOIN courses c ON e.course_id = c.id
WHERE e.student_id = ?`, [student_id]
);
return rows;
};


export const getEnrollmentId = async ({ student_id, course_code }) => {
const [rows] = await pool.query(
`SELECT e.id FROM enrollments e JOIN courses c ON e.course_id=c.id WHERE e.student_id=? AND c.code=?`,
[student_id, course_code]
);
return rows[0]?.id;
};