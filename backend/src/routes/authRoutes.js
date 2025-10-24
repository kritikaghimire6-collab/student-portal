import { Router } from 'express';
import { body } from 'express-validator';
import { login, register } from '../controllers/authController.js';


const router = Router();


router.post('/register', [
body('email').isEmail(),
body('password').isLength({ min: 8 }),
body('role').isIn(['ADMIN','FACULTY','STUDENT','PARENT']),
body('full_name').notEmpty()
], register);


router.post('/login', login);


export default router;