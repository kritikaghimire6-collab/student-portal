// backend/src/utils/mailer.js
import nodemailer from "nodemailer";

function getTransporter() {
  const host = process.env.MAIL_HOST || "smtp.gmail.com";
  const port = Number(process.env.MAIL_PORT || 465);
  const secure = String(process.env.MAIL_SECURE || "true") === "true"; // true for 465, false for 587
  const user = process.env.MAIL_USER;
  const pass = process.env.MAIL_PASS;

  if (!user || !pass) {
    console.warn("[MAIL] MAIL_USER or MAIL_PASS missing in .env");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure, // 465 => true, 587 => false
    auth: { user, pass },
  });
}

export async function verifyMailer() {
  const transporter = getTransporter();
  try {
    await transporter.verify();
    console.log("[MAIL] SMTP verify: OK");
  } catch (err) {
    console.error("[MAIL] verify failed:", err?.message || err);
  }
}

export async function sendLowAttendanceAlert({ to, studentName, courseCode, percentage }) {
  const transporter = getTransporter();
  const from = process.env.MAIL_FROM || process.env.MAIL_USER;

  const html = `
    <div style="font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif">
      <h2>Low Attendance Alert</h2>
      <p>Dear Parent/Guardian,</p>
      <p>
        This is to inform you that <b>${studentName}</b> has an attendance of
        <b>${percentage}%</b> in <b>${courseCode}</b>, which is below the required threshold (75%).
      </p>
      <p>Please encourage regular attendance.</p>
      <hr/>
      <p style="color:#6b7280;font-size:12px">Student Portal • Automated notice</p>
    </div>`.trim();

  const info = await transporter.sendMail({
    from,
    to,
    subject: `Low attendance for ${studentName} in ${courseCode}`,
    html,
  });

  // Nodemailer returns useful info; log messageId
  console.log(`[MAIL] sent -> ${to} (${info.messageId})`);
  return info;
}
