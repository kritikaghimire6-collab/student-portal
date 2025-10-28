// backend/src/routes/testRoutes.js
import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { allow } from "../middleware/roles.js";
import { sendLowAttendanceAlert } from "../utils/mailer.js";

const router = Router();

/**
 * POST /api/test/send-alert
 * Body: { to, studentName, courseCode, percentage }
 * Role: ADMIN ONLY
 */
router.post("/send-alert", auth, allow("ADMIN"), async (req, res) => {
  try {
    const { to, studentName, courseCode, percentage } = req.body;

    if (!to) {
      return res.status(400).json({ message: "Recipient email (to) is required" });
    }

    await sendLowAttendanceAlert({
      to,
      studentName: studentName || "Test Student",
      courseCode: courseCode || "TEST101",
      percentage: percentage || 60,
    });

    return res.json({ message: `Test alert sent to ${to}` });
  } catch (err) {
    console.error("[TEST ALERT] Error:", err);
    return res.status(500).json({ message: "Failed to send test alert", error: err.message });
  }
});

export default router;
