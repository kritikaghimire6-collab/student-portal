import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { allow } from '../middleware/roles.js';
import { createStudentProfile, getStudent, myStudentProfile } from '../controllers/studentController.js';


const router = Router();
router.post('/', auth, allow('ADMIN'), createStudentProfile);
router.get('/me', auth, allow('STUDENT'), myStudentProfile);
router.get('/:id', auth, allow('ADMIN','FACULTY'), getStudent);
export default router;