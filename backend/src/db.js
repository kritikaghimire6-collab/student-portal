// src/db.js
import "dotenv/config";
import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: process.env.DB_HOST ?? "127.0.0.1",
  user: process.env.DB_USER ?? "root",
  password: process.env.DB_PASS ?? "",
  database: process.env.DB_NAME ?? "student_portal",
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true,
});

export default pool;

