import { pool } from '../db.js';


export const createCourse = async ({ code, title, credit, faculty_id }) => {
const [result] = await pool.query('INSERT INTO courses (code, title, credit, faculty_id) VALUES (?,?,?,?)', [code, title, credit, faculty_id]);
return { id: result.insertId };
};


export const listCourses = async () => {
const [rows] = await pool.query('SELECT c.*, u.full_name as faculty_name FROM courses c LEFT JOIN users u ON c.faculty_id = u.id ORDER BY c.code');
return rows;
};