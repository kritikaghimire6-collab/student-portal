import { pool } from '../db.js';


export const findUserByEmail = async (email) => {
const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
return rows[0];
};


export const findUserById = async (id) => {
const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
return rows[0];
};


export const createUser = async ({ email, password_hash, role, full_name }) => {
const [result] = await pool.query('INSERT INTO users (email, password_hash, role, full_name) VALUES (?,?,?,?)', [email, password_hash, role, full_name]);
return { id: result.insertId, email, role, full_name };
};


export const listUsers = async () => {
const [rows] = await pool.query('SELECT id, email, role, full_name, created_at FROM users ORDER BY id DESC');
return rows;
};