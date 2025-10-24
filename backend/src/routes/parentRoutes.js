import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { allow } from '../middleware/roles.js';
import { myChildren, childAttendanceSummary, childMarks } from '../controllers/parentController.js';

const router = Router();
router.get('/children', auth, allow('PARENT'), myChildren);
router.get('/children/:childId/attendance-summary', auth, allow('PARENT'), childAttendanceSummary);
router.get('/children/:childId/marks', auth, allow('PARENT'), childMarks);
export default router;
