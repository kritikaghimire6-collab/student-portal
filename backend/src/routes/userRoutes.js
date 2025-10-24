import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { allow } from '../middleware/roles.js';
import { getAllUsers } from '../controllers/userController.js';


const router = Router();
router.get('/', auth, allow('ADMIN'), getAllUsers);
export default router;