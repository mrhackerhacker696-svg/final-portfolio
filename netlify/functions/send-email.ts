import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import nodemailer from "nodemailer";

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext,
) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "",
    };
  }

  try {
    let body;
    try {
      body = JSON.parse(event.body || "{}");
    } catch (parseError) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ error: "Invalid JSON in request body" }),
      };
    }

    const { name, email, phone, subject, message, contactMethod } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    // Check if email credentials are configured
    const emailUser = process.env.EMAIL_USER || process.env.GMAIL_USER;
    const emailPass = process.env.EMAIL_PASS || process.env.GMAIL_PASS;

    if (!emailUser) {
      return {
        statusCode: 503,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          error: "Email service not configured",
          details: "Email credentials not set in environment variables",
        }),
      };
    }

    // Create transporter using environment variables
    const transporter = nodemailer.createTransporter({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    // Create email content
    const emailSubject = `🌟 New Portfolio Contact: ${subject || "Contact Form Submission"}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 15px;">
        <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
          <h2 style="color: #667eea; margin-bottom: 20px; border-bottom: 3px solid #667eea; padding-bottom: 10px;">
            💼 New Contact from Portfolio Website
          </h2>
          
          <div style="background: #f8f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Contact Information</h3>
            <p style="margin: 5px 0;"><strong>👤 Name:</strong> ${name}</p>
            <p style="margin: 5px 0;"><strong>📧 Email:</strong> <a href="mailto:${email}" style="color: #667eea;">${email}</a></p>
            ${phone ? `<p style="margin: 5px 0;"><strong>📱 Phone:</strong> <a href="tel:${phone}" style="color: #667eea;">${phone}</a></p>` : ""}
            <p style="margin: 5px 0;"><strong>💬 Preferred Contact:</strong> 
              <span style="background: ${contactMethod === "sms" ? "#10b981" : contactMethod === "call" ? "#f59e0b" : "#3b82f6"}; color: white; padding: 3px 8px; border-radius: 12px; font-size: 12px;">
                ${contactMethod === "sms" ? "📱 SMS" : contactMethod === "call" ? "📞 Call" : "📧 Email"}
              </span>
            </p>
          </div>

          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
            <h3 style="color: #333; margin-top: 0;">📝 Subject</h3>
            <p style="font-size: 16px; font-weight: 500; color: #1e40af;">${subject || "No subject provided"}</p>
          </div>

          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">💭 Message</h3>
            <p style="line-height: 1.6; color: #374151; white-space: pre-wrap;">${message}</p>
          </div>

          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px; border-radius: 8px; text-align: center; margin-top: 20px;">
            <p style="margin: 0; font-size: 14px;">
              ⚡ Quick Actions: 
              <a href="mailto:${email}" style="color: #fbbf24; text-decoration: none; margin: 0 10px;">Reply via Email</a>
              ${phone ? `| <a href="tel:${phone}" style="color: #fbbf24; text-decoration: none; margin: 0 10px;">Call ${phone}</a>` : ""}
            </p>
          </div>

          <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 12px;">
              📅 Received at: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
            </p>
          </div>
        </div>
      </div>
    `;

    const textContent = `
New Portfolio Contact Received!

Name: ${name}
Email: ${email}
${phone ? `Phone: ${phone}` : ""}
Preferred Contact: ${contactMethod}

Subject: ${subject || "No subject provided"}

Message:
${message}

---
Received at: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
    `;

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER || process.env.GMAIL_USER,
      to: "kanuprajapati717@gmail.com",
      subject: emailSubject,
      text: textContent,
      html: htmlContent,
      replyTo: email,
    };

    await transporter.sendMail(mailOptions);

    // Also send a confirmation email to the sender
    const confirmationOptions = {
      from: process.env.EMAIL_USER || process.env.GMAIL_USER,
      to: email,
      subject: "✅ Message Received - Kanu Prajapati Portfolio",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 15px;">
          <div style="background: white; padding: 25px; border-radius: 10px;">
            <h2 style="color: #667eea; text-align: center; margin-bottom: 20px;">✅ Message Received!</h2>
            
            <p style="color: #374151;">Hi ${name},</p>
            
            <p style="color: #374151; line-height: 1.6;">
              Thank you for contacting me through my portfolio website! I've received your message and will get back to you 
              ${contactMethod === "sms" ? "via SMS" : contactMethod === "call" ? "with a phone call" : "via email"} 
              as soon as possible.
            </p>
            
            <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0; font-size: 16px;">📋 Your Message Summary:</h3>
              <p style="margin: 5px 0; color: #6b7280;"><strong>Subject:</strong> ${subject || "Contact Message"}</p>
              <p style="margin: 5px 0; color: #6b7280;"><strong>Preferred Response:</strong> ${contactMethod === "sms" ? "📱 SMS" : contactMethod === "call" ? "📞 Phone Call" : "📧 Email"}</p>
            </div>
            
            <p style="color: #374151; line-height: 1.6;">
              Best regards,<br>
              <strong style="color: #667eea;">Kanu Prajapati</strong><br>
              <span style="color: #6b7280; font-size: 14px;">Full-Stack Developer</span>
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(confirmationOptions);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        success: true,
        message: "Email sent successfully",
        timestamp: new Date().toISOString(),
      }),
    };
  } catch (error) {
    console.error("Email sending error:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: "Failed to send email",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};

export { handler };
