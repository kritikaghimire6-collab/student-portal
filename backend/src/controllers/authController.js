import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import { createUser, findUserByEmail } from '../models/userModel.js';
import { issueTokens } from '../middleware/auth.js';


export const register = async (req, res, next) => {
try {
const errors = validationResult(req);
if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });


const { email, password, role, full_name } = req.body;
const existing = await findUserByEmail(email);
if (existing) return res.status(409).json({ message: 'Email already used' });


const password_hash = await bcrypt.hash(password, 10);
const user = await createUser({ email, password_hash, role, full_name });
const tokens = issueTokens(user);
res.status(201).json({ user, tokens });
} catch (e) { next(e); }
};


export const login = async (req, res, next) => {
try {
const { email, password } = req.body;
const user = await findUserByEmail(email);
if (!user) return res.status(401).json({ message: 'Invalid credentials' });
const ok = await bcrypt.compare(password, user.password_hash);
if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
const tokens = issueTokens(user);
res.json({ user: { id: user.id, email: user.email, role: user.role, full_name: user.full_name }, tokens });
} catch (e) { next(e); }
};