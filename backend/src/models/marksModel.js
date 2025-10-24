import { pool } from '../db.js';


export const addMark = async ({ enrollment_id, assessment, score, max_score }) => {
const [result] = await pool.query(
'INSERT INTO marks (enrollment_id, assessment, score, max_score) VALUES (?,?,?,?)',
[enrollment_id, assessment, score, max_score]
);
return { id: result.insertId };
};


export const getMarksByEnrollment = async (enrollment_id) => {
const [rows] = await pool.query('SELECT assessment, score, max_score, created_at FROM marks WHERE enrollment_id=? ORDER BY created_at DESC', [enrollment_id]);
return rows;
};