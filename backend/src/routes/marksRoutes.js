import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { allow } from '../middleware/roles.js';
import { add, addByComposite, byEnrollment } from '../controllers/marksController.js';


const router = Router();
router.post('/', auth, allow('FACULTY'), add);
router.post('/composite', auth, allow('FACULTY'), addByComposite);
router.get('/enrollment/:enrollmentId', auth, allow('ADMIN','FACULTY','STUDENT'), byEnrollment);
export default router;