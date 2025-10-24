import { pool } from '../db.js';
import PDFDocument from 'pdfkit';
import { getStudentById } from '../models/studentModel.js';
import { findUserById } from '../models/userModel.js';

export const atRisk = async (req, res, next) => {
  try {
    const threshold = Number(req.query.threshold ?? 75);
    const course_code = req.query.course_code;
    const args = [];
    const whereCourse = course_code ? 'AND c.code = ?' : '';
    if (course_code) args.push(course_code);

    const [rows] = await pool.query(
      `
      SELECT s.id AS student_id, s.roll_no, c.code AS course_code,
             SUM(CASE WHEN a.status='PRESENT' THEN 1 ELSE 0 END) AS presents,
             COUNT(*) AS total,
             ROUND(100 * SUM(CASE WHEN a.status='PRESENT' THEN 1 ELSE 0 END)/NULLIF(COUNT(*),0), 0) AS pct
      FROM attendance a
      JOIN enrollments e ON a.enrollment_id = e.id
      JOIN students s ON e.student_id = s.id
      JOIN courses c ON e.course_id = c.id
      WHERE 1=1 ${whereCourse}
      GROUP BY s.id, s.roll_no, c.code
      HAVING pct < ?
      ORDER BY pct ASC, s.roll_no ASC
      `,
      course_code ? [...args, threshold] : [threshold]
    );
    res.json(rows);
  } catch (e) { next(e); }
};

export const attendanceTrend = async (req, res, next) => {
  try {
    const course_code = req.query.course_code;
    const weeks = Number(req.query.weeks ?? 8);
    const [rows] = await pool.query(
      `
      SELECT YEARWEEK(a.date, 1) AS yearweek,
             SUM(CASE WHEN a.status='PRESENT' THEN 1 ELSE 0 END) AS presents,
             COUNT(*) AS total
      FROM attendance a
      JOIN enrollments e ON a.enrollment_id = e.id
      JOIN courses c ON e.course_id = c.id
      WHERE c.code = ?
      GROUP BY YEARWEEK(a.date, 1)
      ORDER BY yearweek DESC
      LIMIT ?
      `,
      [course_code, weeks]
    );
    res.json(rows.reverse());
  } catch (e) { next(e); }
};

export const gradesSummary = async (req, res, next) => {
  try {
    const student_id = Number(req.query.student_id);
    const [rows] = await pool.query(
      `
      SELECT c.code AS course_code,
             ROUND(100 * SUM(m.score)/NULLIF(SUM(m.max_score),0), 2) AS percent
      FROM marks m
      JOIN enrollments e ON m.enrollment_id = e.id
      JOIN courses c ON e.course_id = c.id
      WHERE e.student_id = ?
      GROUP BY c.code
      ORDER BY c.code
      `,
      [student_id]
    );
    const toGpa = (p)=> p>=90?4: p>=80?3.5: p>=70?3: p>=60?2.5: p>=50?2: 0;
    const overall = rows.length
      ? (rows.reduce((s,r)=>s+toGpa(r.percent),0)/rows.length).toFixed(2)
      : null;
    res.json({ courses: rows, gpa: overall });
  } catch (e) { next(e); }
};

export const transcriptPdf = async (req, res, next) => {
  try {
    const student_id = Number(req.query.student_id);
    const student = await getStudentById(student_id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    const user = await findUserById(student.user_id);

    const [marks] = await pool.query(
      `
      SELECT c.code, c.title, m.assessment, m.score, m.max_score, m.created_at
      FROM marks m
      JOIN enrollments e ON m.enrollment_id = e.id
      JOIN courses c ON e.course_id = c.id
      WHERE e.student_id = ?
      ORDER BY c.code, m.created_at
      `,
      [student_id]
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="transcript_${student.roll_no}.pdf"`);

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    doc.fontSize(18).text('Academic Transcript', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Name: ${user?.full_name || 'N/A'}`);
    doc.text(`Roll No: ${student.roll_no}`);
    doc.text(`Program: ${student.program || '—'}`);
    doc.text(`Semester: ${student.semester ?? '—'}`);
    doc.moveDown();

    let currentCourse = null;
    marks.forEach(m => {
      if (m.code !== currentCourse) {
        currentCourse = m.code;
        doc.moveDown(0.5);
        doc.fontSize(13).text(`${m.code} - ${m.title}`, { underline: true });
      }
      doc.fontSize(11).text(`• ${m.assessment}: ${m.score}/${m.max_score}  (${new Date(m.created_at).toLocaleString()})`);
    });

    if (marks.length === 0) doc.text('No marks available.');
    doc.end();
  } catch (e) { next(e); }
};
