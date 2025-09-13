import express from "express";
import { SMSNotification, SMSCategory } from "../models/index.js";

// Exotel API Configuration
const EXOTEL_API_KEY = "54eb9c9619caf90688b7b471754ac2ec13cf8d8aee190085";
const EXOTEL_API_TOKEN = "5f4733d9896080a6e233b766a3ab157d9f26480325430b82";
const EXOTEL_SID = "kanu-portfolio"; // Your Exotel SID - this might need to be your actual Exotel Account SID
const EXOTEL_FROM_NUMBER = "+919876543210"; // Your Exotel virtual number
const EXOTEL_SUBDOMAIN = "api.exotel.com"; // Exotel API subdomain

// Working SMS service using Fast2SMS (India)
async function sendSMSSimple(to: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    console.log("📱 Attempting Fast2SMS service...");

    // Fast2SMS API Configuration
    const FAST2SMS_API_KEY = "nA4xNrqjHmmtHQFJNC7cd3O7cmKdB2rinF9jf82STNRfrpyiyOc4snEA0VCK";
    const FAST2SMS_SENDER = "KANUPO"; // Your sender name

    // Clean phone number (remove +91, +, spaces)
    const cleanNumber = to.replace(/^\+91/, '').replace(/^\+/, '').replace(/\s/g, '');

    console.log("📱 Fast2SMS Details:");
    console.log("   To:", to, "-> Clean:", cleanNumber);
    console.log("   Message:", message);
    console.log("   Sender:", FAST2SMS_SENDER);

    // Fast2SMS API call - using GET method as per documentation
    const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${FAST2SMS_API_KEY}&message=${encodeURIComponent(message)}&language=english&route=q&numbers=${cleanNumber}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Kanu-Portfolio/1.0'
      }
    });

    const data = await response.json();
    console.log("📱 Fast2SMS Response Status:", response.status);
    console.log("📱 Fast2SMS Response:", JSON.stringify(data, null, 2));

    if (response.ok && data.return === true) {
      console.log("✅ SMS sent via Fast2SMS:", data.request_id);
      return {
        success: true,
        messageId: data.request_id || `fast2sms_${Date.now()}`
      };
    } else {
      console.error("❌ Fast2SMS error:", data);
      return {
        success: false,
        error: data.message || data.error || 'Fast2SMS API error'
      };
    }

  } catch (error) {
    console.error("❌ Fast2SMS SMS error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Optional Twilio client (only if env is configured)
let twilioClient: any = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const twilio = require("twilio");
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    console.log("✅ Twilio configured for SMS sending");
  } catch (e) {
    console.warn("Twilio package not installed or failed to initialize. Run `npm i twilio` if you want SMS sending.");
  }
}

// Exotel SMS sending function
async function sendSMSViaExotel(to: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Exotel API endpoint for SMS - using correct format
    const url = `https://${EXOTEL_SUBDOMAIN}/v1/Accounts/${EXOTEL_SID}/Sms/send.json`;

    // Basic authentication with API Key and Token
    const auth = Buffer.from(`${EXOTEL_API_KEY}:${EXOTEL_API_TOKEN}`).toString('base64');

    // Prepare form data with correct parameter names
    const formData = new URLSearchParams({
      'From': EXOTEL_FROM_NUMBER,
      'To': to,
      'Body': message,
      'StatusCallback': 'https://webhook.site/your-webhook-url' // Optional callback URL
    });

    console.log("📱 Sending SMS via Exotel to:", to);
    console.log("📱 Exotel URL:", url);
    console.log("📱 Auth Key:", EXOTEL_API_KEY.substring(0, 8) + "...");
    console.log("📱 From Number:", EXOTEL_FROM_NUMBER);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'User-Agent': 'Kanu-Portfolio/1.0'
      },
      body: formData,
    });

    const responseText = await response.text();
    console.log("📱 Exotel Response Status:", response.status);
    console.log("📱 Exotel Response:", responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("❌ Failed to parse Exotel response:", parseError);
      return {
        success: false,
        error: `Invalid response from Exotel: ${responseText}`
      };
    }

    if (response.ok) {
      // Check for successful response structure
      if (data.Response && data.Response.SmsSid) {
        console.log("✅ SMS sent via Exotel:", data.Response.SmsSid);
        return {
          success: true,
          messageId: data.Response.SmsSid
        };
      } else if (data.RestException) {
        console.error("❌ Exotel API error:", data.RestException);
        return {
          success: false,
          error: data.RestException.Message || 'Exotel API error'
        };
      } else {
        console.error("❌ Unexpected Exotel response:", data);
        return {
          success: false,
          error: 'Unexpected response from Exotel API'
        };
      }
    } else {
      console.error("❌ Exotel HTTP error:", response.status, data);
      return {
        success: false,
        error: data.RestException?.Message || `HTTP ${response.status}: ${response.statusText}`
      };
    }
  } catch (error) {
    console.error("❌ Exotel SMS request error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

const router = express.Router();

// Get all SMS notifications
router.get("/notifications", async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    const notifications = await SMSNotification.find({ userId }).sort({
      createdAt: -1,
    });
    res.json(notifications);
  } catch (error) {
    console.error("Error fetching SMS notifications:", error);
    res.status(500).json({ error: "Failed to fetch SMS notifications" });
  }
});

// Create new SMS notification
router.post("/notifications", async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    const notificationData = { ...req.body, userId };

    const notification = new SMSNotification(notificationData);
    await notification.save();

    res.status(201).json(notification);
  } catch (error) {
    console.error("Error creating SMS notification:", error);
    res.status(500).json({ error: "Failed to create SMS notification" });
  }
});

// Send a real SMS via Exotel (primary) or Twilio (fallback)
router.post("/send", async (req, res) => {
  const userId = "kanu-portfolio";
  const { to, message, category = "Contact" } = req.body as { to?: string; message?: string; category?: string };

  if (!to || !message) {
    return res.status(400).json({ error: "'to' and 'message' are required" });
  }

  try {
    let smsResult: { success: boolean; messageId?: string; error?: string };
    let provider = "";

    // Try Fast2SMS first (primary provider)
    console.log("📱 Attempting to send SMS via Fast2SMS...");
    smsResult = await sendSMSSimple(to, message);

    if (smsResult.success) {
      provider = "Fast2SMS";
    } else {
      console.log("❌ Fast2SMS failed:", smsResult.error);
      console.log("📱 Trying Exotel fallback...");

      // Try Exotel as fallback
      const exotelResult = await sendSMSViaExotel(to, message);
      if (exotelResult.success) {
        smsResult = exotelResult;
        provider = "Exotel";
      } else {
        console.log("❌ Exotel failed, trying Twilio fallback...");

        // Fallback to Twilio if available
        if (twilioClient && process.env.TWILIO_FROM_NUMBER) {
          try {
            const twilioResponse = await twilioClient.messages.create({
              body: message,
              to,
              from: process.env.TWILIO_FROM_NUMBER,
            });

            smsResult = {
              success: true,
              messageId: twilioResponse.sid
            };
            provider = "Twilio";
          } catch (twilioError: any) {
            smsResult = {
              success: false,
              error: `Fast2SMS: ${smsResult.error}, Exotel: ${exotelResult.error}, Twilio: ${twilioError.message}`
            };
          }
        } else {
          smsResult = {
            success: false,
            error: `All SMS providers failed. Fast2SMS: ${smsResult.error}, Exotel: ${exotelResult.error}`
          };
        }
      }
    }

    // Save notification regardless of success/failure
    const notification = new SMSNotification({
      userId,
      message,
      phone: to,
      category,
      status: smsResult.success ? "sent" : "failed",
      timestamp: new Date(),
    });
    await notification.save();

    if (smsResult.success) {
      return res.json({
        success: true,
        messageId: smsResult.messageId,
        provider,
        notification
      });
    } else {
      return res.status(500).json({
        success: false,
        error: smsResult.error,
        provider: provider || "None",
        notification
      });
    }
  } catch (error: any) {
    console.error("Error in SMS send endpoint:", error);

    // Save failed notification
    const notification = new SMSNotification({
      userId,
      message,
      phone: to,
      category,
      status: "failed",
      timestamp: new Date(),
    });
    await notification.save();

    return res.status(500).json({
      success: false,
      error: error.message || "Failed to send SMS",
      notification
    });
  }
});

// Update SMS notification
router.put("/notifications/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const notification = await SMSNotification.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    );

    if (!notification) {
      return res.status(404).json({ error: "SMS notification not found" });
    }

    res.json(notification);
  } catch (error) {
    console.error("Error updating SMS notification:", error);
    res.status(500).json({ error: "Failed to update SMS notification" });
  }
});

// Delete SMS notification
router.delete("/notifications/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await SMSNotification.findByIdAndDelete(id);

    if (!notification) {
      return res.status(404).json({ error: "SMS notification not found" });
    }

    res.json({ message: "SMS notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting SMS notification:", error);
    res.status(500).json({ error: "Failed to delete SMS notification" });
  }
});

// Clear all SMS notifications
router.delete("/notifications", async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    await SMSNotification.deleteMany({ userId });
    res.json({ message: "All SMS notifications cleared successfully" });
  } catch (error) {
    console.error("Error clearing SMS notifications:", error);
    res.status(500).json({ error: "Failed to clear SMS notifications" });
  }
});

// Get SMS categories
router.get("/categories", async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    let categories = await SMSCategory.findOne({ userId });

    if (!categories) {
      // Create default categories if doesn't exist
      categories = new SMSCategory({
        userId,
        categories: ["Contact", "Inquiry", "Support", "Urgent"],
      });
      await categories.save();
    }

    res.json(categories.categories);
  } catch (error) {
    console.error("Error fetching SMS categories:", error);
    res.status(500).json({ error: "Failed to fetch SMS categories" });
  }
});

// Update SMS categories
router.put("/categories", async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    const { categories } = req.body;

    const result = await SMSCategory.findOneAndUpdate(
      { userId },
      { categories },
      { new: true, upsert: true },
    );

    res.json(result.categories);
  } catch (error) {
    console.error("Error updating SMS categories:", error);
    res.status(500).json({ error: "Failed to update SMS categories" });
  }
});

// Get SMS provider status
router.get("/status", async (req, res) => {
  try {
    const fast2smsConfigured = true; // Fast2SMS is now configured
    const exotelConfigured = !!(EXOTEL_API_KEY && EXOTEL_API_TOKEN && EXOTEL_SID && EXOTEL_FROM_NUMBER);
    const twilioConfigured = !!(twilioClient && process.env.TWILIO_FROM_NUMBER);

    const status = {
      fast2sms: {
        configured: fast2smsConfigured,
        apiKey: "✅ Configured",
        sender: "KANUPO",
        status: "✅ Ready"
      },
      exotel: {
        configured: exotelConfigured,
        apiKey: EXOTEL_API_KEY ? "✅ Configured" : "❌ Not configured",
        apiToken: EXOTEL_API_TOKEN ? "✅ Configured" : "❌ Not configured",
        sid: EXOTEL_SID,
        fromNumber: EXOTEL_FROM_NUMBER,
      },
      twilio: {
        configured: twilioConfigured,
        accountSid: process.env.TWILIO_ACCOUNT_SID ? "✅ Configured" : "❌ Not configured",
        authToken: process.env.TWILIO_AUTH_TOKEN ? "✅ Configured" : "❌ Not configured",
        fromNumber: process.env.TWILIO_FROM_NUMBER || "❌ Not configured",
      },
      primaryProvider: "Fast2SMS",
      fallbackProvider: exotelConfigured ? "Exotel" : (twilioConfigured ? "Twilio" : "None"),
    };

    res.json(status);
  } catch (error) {
    console.error("Error getting SMS status:", error);
    res.status(500).json({ error: "Failed to get SMS status" });
  }
});

export default router;
