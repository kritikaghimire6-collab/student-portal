// backend/src/controllers/attendanceController.js
import { getEnrollmentId } from '../models/enrollmentModel.js';
import {
  getAttendanceByEnrollment,
  getAttendanceSummary,
  markAttendance
} from '../models/attendanceModel.js';
import { sendLowAttendanceAlert } from '../utils/mailer.js';
import { getStudentById, getStudentByUserId } from '../models/studentModel.js';
import { logNotification } from '../models/notificationModel.js';

export const take = async (req, res, next) => {
  try {
    const { enrollment_id, date, status } = req.body; // or pass student_id+course_code
    const payload = { enrollment_id, date, status };
    const result = await markAttendance(payload);
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};

export const takeByComposite = async (req, res, next) => {
  try {
    const { student_id, course_code, date, status } = req.body;

    const enrollment_id = await getEnrollmentId({ student_id, course_code });
    if (!enrollment_id) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // 1) Record attendance
    await markAttendance({ enrollment_id, date, status });

    // 2) Compute pct
    const summary = await getAttendanceSummary({ student_id, course_code });
    let emailAttempt = null;

    if (summary?.total > 0) {
      const pct = Math.round((summary.presents / summary.total) * 100);

      // 3) Email parent if below threshold
      if (pct < 75) {
        const student = await getStudentById(student_id);
        const parent_email = student?.parent_email || null;

        if (parent_email) {
          try {
            await sendLowAttendanceAlert({
              to: parent_email,
              studentName: student.roll_no,
              courseCode: course_code,
              percentage: pct
            });

            // 4) Log SENT
            emailAttempt = await logNotification({
              parent_email,
              student_id,
              course_code,
              percentage: pct,
              status: 'SENT'
            });
          } catch (err) {
            // 4) Log FAILED
            emailAttempt = await logNotification({
              parent_email,
              student_id,
              course_code,
              percentage: pct,
              status: 'FAILED',
              error_text: err?.message || String(err)
            });
          }
        }
      }
    }

    return res.status(201).json({
      message: 'Attendance recorded',
      emailAttempt // { id } or null
    });
  } catch (e) {
    next(e);
  }
};

export const byEnrollment = async (req, res, next) => {
  try {
    const rows = await getAttendanceByEnrollment(req.params.enrollmentId);
    res.json(rows);
  } catch (e) {
    next(e);
  }
};

export const summary = async (req, res, next) => {
  try {
    let { student_id, course_code } = req.query;

    if (isNaN(student_id)) {
      // If student_id is not a number, treat it as user_id
      const student = await getStudentByUserId(student_id);
      if (!student) return res.status(404).json({ message: 'Student not found' });
      student_id = student.id;
    }

    const s = await getAttendanceSummary({ student_id, course_code });
    res.json(s);
  } catch (e) {
    next(e);
  }
};
