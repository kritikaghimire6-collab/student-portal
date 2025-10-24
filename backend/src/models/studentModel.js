import { pool } from '../db.js';


export const getStudentByUserId = async (user_id) => {
const [rows] = await pool.query('SELECT * FROM students WHERE user_id = ?', [user_id]);
return rows[0];
};


export const getStudentById = async (id) => {
const [rows] = await pool.query('SELECT * FROM students WHERE id = ?', [id]);
return rows[0];
};


export const createStudent = async ({ user_id, roll_no, program, semester, parent_email }) => {
const [result] = await pool.query(
'INSERT INTO students (user_id, roll_no, program, semester, parent_email) VALUES (?,?,?,?,?)',
[user_id, roll_no, program, semester, parent_email]
);
return { id: result.insertId };
};