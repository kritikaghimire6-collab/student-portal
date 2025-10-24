import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { allow } from '../middleware/roles.js';
import { create, list } from '../controllers/courseController.js';


const router = Router();
router.post('/', auth, allow('ADMIN'), create);
router.get('/', auth, list);
export default router;