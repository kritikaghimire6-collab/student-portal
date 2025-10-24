// src/utils/mailer.js
import nodemailer from 'nodemailer';


export const transporter = nodemailer.createTransport({
host: process.env.MAIL_HOST,
port: Number(process.env.MAIL_PORT || 587),
secure: false,
auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
});


export const sendLowAttendanceAlert = async ({ to, studentName, courseCode, percentage }) => {
const info = await transporter.sendMail({
from: 'no-reply@student-portal',
to,
subject: `Low attendance alert for ${studentName}`,
html: `<p>Dear Parent,</p>
<p>Your child's attendance in <b>${courseCode}</b> is <b>${percentage}%</b>, which is below the threshold.</p>
<p>Please encourage regular attendance.</p>`
});
return info;
};