const nodemailer = require("nodemailer");

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_SECURE
} = process.env;

const hasSmtpConfig = SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS;

// Reuse a single transporter if SMTP is configured; otherwise fall back to console logging
const transporter = hasSmtpConfig
  ? nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: SMTP_SECURE === "true",
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      }
    })
  : null;

exports.sendEmail = async (to, subject, html) => {
  if (!hasSmtpConfig) {
    console.warn("SMTP not configured. Email content logged for debugging.");
    console.log("To:", to);
    console.log("Subject:", subject);
    console.log("Body:", html);
    return;
  }

  await transporter.sendMail({
    from: SMTP_USER,
    to,
    subject,
    html
  });
};
