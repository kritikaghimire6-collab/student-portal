import { addMark, getMarksByEnrollment } from '../models/marksModel.js';
import { getEnrollmentId } from '../models/enrollmentModel.js';


export const add = async (req, res, next) => {
try {
const { enrollment_id, assessment, score, max_score } = req.body;
const m = await addMark({ enrollment_id, assessment, score, max_score });
res.status(201).json(m);
} catch (e) { next(e); }
};


export const addByComposite = async (req, res, next) => {
try {
const { student_id, course_code, assessment, score, max_score } = req.body;
const enrollment_id = await getEnrollmentId({ student_id, course_code });
if (!enrollment_id) return res.status(404).json({ message: 'Enrollment not found' });
const m = await addMark({ enrollment_id, assessment, score, max_score });
res.status(201).json(m);
} catch (e) { next(e); }
};


export const byEnrollment = async (req, res, next) => {
try {
const rows = await getMarksByEnrollment(req.params.enrollmentId);
res.json(rows);
} catch (e) { next(e); }
};