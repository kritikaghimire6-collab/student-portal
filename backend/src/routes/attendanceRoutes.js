import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { allow } from '../middleware/roles.js';
import { byEnrollment, summary, take, takeByComposite } from '../controllers/attendanceController.js';


const router = Router();
router.post('/', auth, allow('FACULTY'), take);
router.post('/composite', auth, allow('FACULTY'), takeByComposite);
router.get('/enrollment/:enrollmentId', auth, allow('ADMIN','FACULTY','STUDENT'), byEnrollment);
router.get('/summary', auth, allow('ADMIN','FACULTY','STUDENT','PARENT'), summary);
export default router;