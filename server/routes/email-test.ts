import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

// Send email using Nodemailer (supports SMTP via env, or fallback to JSON transport)
router.post("/send-email", async (req, res) => {
  const { name, email, phone, subject, message } = req.body as {
    name?: string;
    email?: string;
    phone?: string;
    subject?: string;
    message?: string;
  };

  if (!name || !email || !message) {
    return res.status(400).json({
      error: "Missing required fields",
      details: "Name, email, and message are required",
    });
  }

  const toAddress = process.env.NOTIFY_EMAIL_TO || "kanuprajapati717@gmail.com";

  try {
    let transporter: nodemailer.Transporter;
    if (
      process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
    ) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Dev fallback: log-only transport
      transporter = nodemailer.createTransport({
        jsonTransport: true,
      } as any);
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || `"Portfolio" <no-reply@localhost>`,
      to: toAddress,
      subject: subject || "Contact Form Submission",
      text: `From: ${name} (${email})\nPhone: ${phone || "-"}\n\n${message}`,
      html: `<p><strong>From:</strong> ${name} (${email})</p><p><strong>Phone:</strong> ${phone || "-"}</p><p>${message}</p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    return res.json({ success: true, messageId: info.messageId || undefined });
  } catch (error: any) {
    console.error("Email send error:", error);
    return res.status(500).json({ success: false, error: error.message || "Failed to send email" });
  }
});

export default router;
