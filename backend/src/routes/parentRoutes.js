// backend/src/routes/parentRoutes.js
import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { allow } from "../middleware/roles.js";
import {
  myChildren,
  childAttendanceSummary,
  childMarks
} from "../controllers/parentController.js";

const router = Router();

// List children linked to this parent (via students.parent_email)
router.get("/children", auth, allow("PARENT"), myChildren);

// Attendance summary for ONE child in ONE course
router.get(
  "/children/:childId/attendance-summary",
  auth,
  allow("PARENT"),
  childAttendanceSummary
);

// Marks for ONE child in ONE course
router.get(
  "/children/:childId/marks",
  auth,
  allow("PARENT"),
  childMarks
);

export default router;
