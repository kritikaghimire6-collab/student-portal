import { listUsers } from '../models/userModel.js';
export const getAllUsers = async (req, res, next) => {
try {
const users = await listUsers();
res.json(users);
} catch (e) { next(e); }
};