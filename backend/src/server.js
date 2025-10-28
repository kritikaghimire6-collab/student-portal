// backend/src/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { pool } from "./db.js";

// Routers
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import marksRoutes from "./routes/marksRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import parentRoutes from "./routes/parentRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import './crons/lowAttendanceCron.js'; 
import testRoutes from "./routes/testRoutes.js"; 
import notificationRoutes from './routes/notificationRoutes.js'; 

dotenv.config();
import { verifyMailer } from "./utils/mailer.js";
verifyMailer(); // logs OK or an error at boot

const app = express();
 if (process.env.NODE_ENV !== 'test') {
  //startLowAttendanceCron();
}
// CORS + JSON
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Health checks (handy to confirm DB & server are up)
app.get("/api/health", async (_req, res) => {
  try {
    const [r] = await pool.query("SELECT 1 AS ok");
    res.json({ ok: r[0].ok === 1 });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// ✅ Mount routers (THIS is what prevents 404s)
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/marks", marksRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/users", userRoutes);
app.use("/api/parents", parentRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/test", testRoutes); 
app.use("/api/notifications", notificationRoutes);

// 404 fallback
app.use((req, res) => res.status(404).json({ message: "Not Found" }));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);

});
