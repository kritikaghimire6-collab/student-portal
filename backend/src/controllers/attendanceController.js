import { getEnrollmentId } from '../models/enrollmentModel.js';
import { getAttendanceByEnrollment, getAttendanceSummary, markAttendance } from '../models/attendanceModel.js';
import { sendLowAttendanceAlert } from '../utils/mailer.js';
import { getStudentById } from '../models/studentModel.js';


export const take = async (req, res, next) => {
try {
const { enrollment_id, date, status } = req.body; // or pass student_id+course_code
const payload = { enrollment_id, date, status };
const result = await markAttendance(payload);
res.status(201).json(result);
} catch (e) { next(e); }
};


export const takeByComposite = async (req, res, next) => {
try {
const { student_id, course_code, date, status } = req.body;
const enrollment_id = await getEnrollmentId({ student_id, course_code });
if (!enrollment_id) return res.status(404).json({ message: 'Enrollment not found' });
await markAttendance({ enrollment_id, date, status });


// compute attendance % and notify if low
const summary = await getAttendanceSummary({ student_id, course_code });
if (summary.total > 0) {
const pct = Math.round((summary.presents / summary.total) * 100);
if (pct < 75) {
const s = await getStudentById(student_id);
if (s?.parent_email) {
try { await sendLowAttendanceAlert({ to: s.parent_email, studentName: s.roll_no, courseCode: course_code, percentage: pct }); } catch {}
}
}
}


res.status(201).json({ message: 'Attendance recorded' });
} catch (e) { next(e); }
};


export const byEnrollment = async (req, res, next) => {
try {
const rows = await getAttendanceByEnrollment(req.params.enrollmentId);
res.json(rows);
} catch (e) { next(e); }
};


export const summary = async (req, res, next) => {
try {
const { student_id, course_code } = req.query;
const s = await getAttendanceSummary({ student_id, course_code });
res.json(s);
} catch (e) { next(e); }
};