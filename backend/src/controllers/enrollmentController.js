import { enrollStudent, getEnrollmentsByStudent, getEnrollmentId } from '../models/enrollmentModel.js';
import { getStudentByUserId } from '../models/studentModel.js';


export const enroll = async (req, res, next) => {
try {
const { student_id, course_id } = req.body;
const e = await enrollStudent({ student_id, course_id });
res.status(201).json(e);
} catch (e) { next(e); }
};


export const myCourses = async (req, res, next) => {
try {
const student_id = req.params.studentId;
if (isNaN(student_id)) {
  // If studentId is not a number, treat it as user_id
  const student = await getStudentByUserId(student_id);
  if (!student) return res.status(404).json({ message: 'Student not found' });
  const rows = await getEnrollmentsByStudent(student.id);
  res.json(rows);
} else {
  const rows = await getEnrollmentsByStudent(student_id);
  res.json(rows);
}
} catch (e) { next(e); }
};


export const resolveEnrollment = async (req, res, next) => {
try {
const { student_id, course_code } = req.query;
const id = await getEnrollmentId({ student_id, course_code });
if (!id) return res.status(404).json({ message: 'Not found' });
res.json({ enrollment_id: id });
} catch (e) { next(e); }
};