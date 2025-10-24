import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { allow } from '../middleware/roles.js';
import { enroll, myCourses, resolveEnrollment } from '../controllers/enrollmentController.js';


const router = Router();
router.post('/', auth, allow('ADMIN'), enroll);
router.get('/student/:studentId', auth, allow('ADMIN','FACULTY','STUDENT'), myCourses);
router.get('/resolve', auth, allow('ADMIN','FACULTY','STUDENT'), resolveEnrollment);
export default router;