import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { allow } from '../middleware/roles.js';
import { atRisk, attendanceTrend, gradesSummary, transcriptPdf } from '../controllers/reportController.js';

const router = Router();
router.get('/at-risk', auth, allow('ADMIN','FACULTY'), atRisk);
router.get('/attendance-trend', auth, allow('ADMIN','FACULTY'), attendanceTrend);
router.get('/grades-summary', auth, allow('ADMIN','FACULTY'), gradesSummary);
router.get('/transcript', auth, allow('ADMIN','FACULTY','STUDENT','PARENT'), transcriptPdf);
export default router;
