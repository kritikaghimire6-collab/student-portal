import { createStudent, getStudentByUserId, getStudentById } from '../models/studentModel.js';


export const createStudentProfile = async (req, res, next) => {
try {
const { user_id, roll_no, program, semester, parent_email } = req.body;
const s = await createStudent({ user_id, roll_no, program, semester, parent_email });
res.status(201).json(s);
} catch (e) { next(e); }
};


export const myStudentProfile = async (req, res, next) => {
try {
const me = await getStudentByUserId(req.user.id);
if (!me) return res.status(404).json({ message: 'Student profile not found' });
res.json(me);
} catch (e) { next(e); }
};


export const getStudent = async (req, res, next) => {
try {
const s = await getStudentById(req.params.id);
if (!s) return res.status(404).json({ message: 'Not found' });
res.json(s);
} catch (e) { next(e); }
};