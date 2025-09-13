import React, { useState } from "react";
import { Send, MessageCircle, CheckCircle, Phone, Mail } from "lucide-react";
import { dataService } from "../services/dataService";

interface ContactFormProps {
  variant?: "default" | "footer";
}

export default function ContactForm({ variant = "default" }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    contactMethod: "email",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isTestingEmail, setIsTestingEmail] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Check if we're in development mode and handle accordingly
      const isDevelopment =
        window.location.hostname === "localhost" ||
        window.location.hostname.includes("localhost");

      if (isDevelopment) {
        // In development mode, use the development API endpoint
        console.log("Development mode: Using development API endpoint");

        const response = await fetch("/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            subject: formData.subject,
            message: formData.message,
            contactMethod: formData.contactMethod,
          }),
        });

        const responseText = await response.text();
        let result;
        try {
          result = JSON.parse(responseText);
        } catch (parseError) {
          console.error(
            "Failed to parse development API response:",
            parseError,
          );
          throw new Error("Invalid development API response");
        }

        if (!response.ok) {
          throw new Error(
            result?.error || `Development API error: ${response.status}`,
          );
        }

        // Store message using dataService
        const newMessage = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject || "New Contact Form Submission",
          message: formData.message,
          contactMethod: formData.contactMethod,
          date: new Date().toISOString().split("T")[0],
          status: "new",
          emailSent: true,
          emailTimestamp: result.timestamp,
          developmentMode: true,
        };

        try {
          await dataService.createContactMessage(newMessage);
        } catch (error) {
          console.error("Error saving contact message:", error);
        }

        // Trigger notification event
        window.dispatchEvent(
          new CustomEvent("contactFormSubmitted", {
            detail: {
              isRefresh: false,
              formData: formData,
              timestamp: Date.now(),
              emailSent: true,
              developmentMode: true,
            },
          }),
        );

        const devMessage =
          "🚀 Message sent successfully! (Development mode - simulated email to kanuprajapati717@gmail.com)";
        if (formData.contactMethod === "sms") {
          setSuccessMessage(
            `${devMessage} I'll respond via SMS to your phone number.`,
          );
        } else if (formData.contactMethod === "call") {
          setSuccessMessage(
            `${devMessage} I'll call you back on the provided number.`,
          );
        } else {
          setSuccessMessage(
            `${devMessage} I'll get back to you via email soon.`,
          );
        }

        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          contactMethod: "email",
        });
        setIsSubmitting(false);
        setTimeout(() => setSuccessMessage(""), 8000);
        return;
      }

      // Send email using Netlify function (production mode)
      const response = await fetch("/.netlify/functions/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          contactMethod: formData.contactMethod,
        }),
      });

      // Parse response once and handle errors properly
      const responseText = await response.text();
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse response:", parseError);
        console.error("Response text:", responseText);

        // Check if it's an HTML error page
        if (
          responseText.includes("<html>") ||
          responseText.includes("<!DOCTYPE")
        ) {
          throw new Error(
            `Email service unavailable in development mode (Status: ${response.status})`,
          );
        }

        throw new Error(`Invalid server response (Status: ${response.status})`);
      }

      if (!response.ok) {
        throw new Error(result?.error || `Server error: ${response.status}`);
      }

      // Store message using dataService
      const newMessage = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject || "New Contact Form Submission",
        message: formData.message,
        contactMethod: formData.contactMethod,
        date: new Date().toISOString().split("T")[0],
        status: "new",
        emailSent: true,
        emailTimestamp: result.timestamp,
      };

      try {
        await dataService.createContactMessage(newMessage);
      } catch (error) {
        console.error("Error saving contact message:", error);
      }

      // Check if SMS notifications are enabled and send SMS
      const settings = await dataService.getSettings();
      const notificationSettings = settings.notificationSettings || {};

      if (
        notificationSettings.smsNotifications &&
        notificationSettings.mobileNumber
      ) {
        // Store SMS notification using dataService
        // Determine category based on subject or contact method
        let category = "Contact";
        const subject = (formData.subject || "").toLowerCase();
        if (subject.includes("urgent") || subject.includes("emergency")) {
          category = "Urgent";
        } else if (
          subject.includes("inquiry") ||
          subject.includes("question")
        ) {
          category = "Inquiry";
        } else if (subject.includes("support") || subject.includes("help")) {
          category = "Support";
        }

        const smsData = {
          phone: notificationSettings.mobileNumber,
          message: `📬 New Contact: ${formData.name} sent "${formData.subject || "Contact message"}" via portfolio. Email sent to kanuprajapati717@gmail.com`,
          category: category,
          status: "delivered",
        };

        try {
          const savedSMS = await dataService.createSMSNotification(smsData);
          const smsId = savedSMS.id || Date.now() + 1;

          // Trigger a custom event to notify the SMS component immediately
          window.dispatchEvent(
            new CustomEvent("newSMSNotification", {
              detail: {
                smsId,
                message: `Email sent to kanuprajapati717@gmail.com from ${formData.name}`,
              },
            }),
          );
        } catch (error) {
          console.error("Error saving SMS notification:", error);
        }
      }

      // Trigger contact form submission event for toast notifications
      window.dispatchEvent(
        new CustomEvent("contactFormSubmitted", {
          detail: {
            isRefresh: false,
            formData: formData,
            timestamp: Date.now(),
            emailSent: true,
          },
        }),
      );

      // Show success message immediately
      const emailSentMessage =
        "✅ Email sent to kanuprajapati717@gmail.com! You'll also receive a confirmation email.";

      if (formData.contactMethod === "sms") {
        setSuccessMessage(
          `${emailSentMessage} I'll respond via SMS to your phone number.`,
        );
      } else if (formData.contactMethod === "call") {
        setSuccessMessage(
          `${emailSentMessage} I'll call you back on the provided number.`,
        );
      } else {
        setSuccessMessage(
          `${emailSentMessage} I'll get back to you via email soon.`,
        );
      }

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        contactMethod: "email",
      });
      setIsSubmitting(false);
      setTimeout(() => setSuccessMessage(""), 8000);
    } catch (error) {
      console.error("Email sending failed:", error);
      // Still trigger event to update UI listeners
      window.dispatchEvent(
        new CustomEvent("contactFormSubmitted", {
          detail: {
            isRefresh: false,
            formData: formData,
            timestamp: Date.now(),
            emailSent: false,
          },
        }),
      );

      // Show user-friendly error message
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      if (
        errorMessage.includes("Failed to fetch") ||
        errorMessage.includes("NetworkError")
      ) {
        setSuccessMessage("❌ Network error: Unable to reach email service. Please try again or email me at kanuprajapati717@gmail.com");
      } else {
        setSuccessMessage("❌ There was an issue with email delivery. Please try again or email me at kanuprajapati717@gmail.com");
      }

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        contactMethod: "email",
      });
      setIsSubmitting(false);
      setTimeout(() => setSuccessMessage(""), 10000);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const testEmailService = async () => {
    setIsTestingEmail(true);
    try {
      // Check if we're in development mode
      const isDevelopment =
        window.location.hostname === "localhost" ||
        window.location.hostname.includes("localhost");

      if (isDevelopment) {
        // Test development API endpoint
        const response = await fetch("/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "Test User",
            email: "test@example.com",
            phone: "+91 1234567890",
            subject: "Email Service Test",
            message: "This is a test message to verify email functionality.",
            contactMethod: "email",
          }),
        });

        const responseText = await response.text();
        let result;
        try {
          result = JSON.parse(responseText);
        } catch (parseError) {
          console.error("Development API test failed:", parseError);
          throw new Error("Invalid development API response");
        }

        if (response.ok) {
          setSuccessMessage(
            "✅ Email service test passed! (Development mode - check server console for simulated email)",
          );
        } else {
          setSuccessMessage(
            `❌ Development API error (${response.status}): ${result?.error || "Unknown error"}`,
          );
        }
        setIsTestingEmail(false);
        setTimeout(() => setSuccessMessage(""), 8000);
        return;
      }

      const response = await fetch("/.netlify/functions/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Test User",
          email: "test@example.com",
          phone: "+91 1234567890",
          subject: "Email Service Test",
          message: "This is a test message to verify email functionality.",
          contactMethod: "email",
        }),
      });

      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries()),
      );

      // Get response text first to see what we're actually receiving
      const responseText = await response.text();
      console.log("Response text:", responseText);

      // Try to parse as JSON
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        console.error("Response was not JSON:", responseText);

        // Check if it's an HTML error page (common in development)
        if (
          responseText.includes("<html>") ||
          responseText.includes("<!DOCTYPE")
        ) {
          throw new Error(
            `Server returned HTML error page (Status: ${response.status}). Function may not be available in development mode.`,
          );
        }

        throw new Error(
          `Invalid JSON response (Status: ${response.status}): ${responseText.substring(0, 200)}...`,
        );
      }

      if (response.ok) {
        setSuccessMessage("✅ Email service is working correctly!");
      } else {
        setSuccessMessage(
          `❌ Email service error (${response.status}): ${result?.error || result?.message || "Unknown error"}`,
        );
      }
    } catch (error) {
      console.error("Email test failed:", error);

      // Provide more helpful error messages
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      if (
        errorMessage.includes("Failed to fetch") ||
        errorMessage.includes("NetworkError")
      ) {
        setSuccessMessage(
          `❌ Network error: Unable to reach email service. This is normal in development mode as Netlify functions require deployment.`,
        );
      } else if (errorMessage.includes("HTML error page")) {
        setSuccessMessage(
          `❌ ${errorMessage} Netlify functions are not available in local development.`,
        );
      } else {
        setSuccessMessage(`❌ Email service test failed: ${errorMessage}`);
      }
    } finally {
      setIsTestingEmail(false);
      setTimeout(() => setSuccessMessage(""), 8000);
    }
  };

  if (variant === "footer") {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Contact
        </h3>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-green-800 text-sm">{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Your Name"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Email"
            />
          </div>

          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="Your message..."
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                Sending...
              </>
            ) : (
              <>
                <Send className="h-3 w-3" />
                Send Message
              </>
            )}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        Send a Message
      </h3>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="text-green-800">{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your.email@example.com"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+91 9876543210"
            />
          </div>

          <div>
            <label
              htmlFor="contactMethod"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Preferred Contact Method
            </label>
            <select
              id="contactMethod"
              name="contactMethod"
              value={formData.contactMethod}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="email">Email Response</option>
              <option value="sms">SMS Response</option>
              <option value="call">Phone Call</option>
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="What's this about?"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Tell me about your project or just say hello!"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              {formData.contactMethod === "sms" ? "Send SMS" : "Send Message"}
            </>
          )}
        </button>

        {/* Contact Method Info */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
          <div className="flex items-start gap-2 text-blue-800">
            {formData.contactMethod === "sms" ? (
              <>
                <MessageCircle className="h-4 w-4 mt-1" />
                <div>
                  <p className="text-sm font-medium">
                    Quick SMS Response Selected
                  </p>
                  <p className="text-xs">
                    ✓ Instant notification to kanuprajapati717@gmail.com
                  </p>
                  <p className="text-xs">✓ SMS response to your phone number</p>
                  <p className="text-xs">
                    ✓ Admin will see your message immediately
                  </p>
                </div>
              </>
            ) : formData.contactMethod === "call" ? (
              <>
                <Phone className="h-4 w-4 mt-1" />
                <div>
                  <p className="text-sm font-medium">Phone Call Requested</p>
                  <p className="text-xs">
                    ✓ I'll call you back on the provided number
                  </p>
                  <p className="text-xs">
                    ✓ Admin notification sent to kanuprajapati717@gmail.com
                  </p>
                </div>
              </>
            ) : (
              <>
                <Mail className="h-4 w-4 mt-1" />
                <div>
                  <p className="text-sm font-medium">Email Response Selected</p>
                  <p className="text-xs">
                    ✓ Message will be sent to kanuprajapati717@gmail.com
                  </p>
                  <p className="text-xs">✓ Email response to your inbox</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Email Service Test Button (for debugging) */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border-l-4 border-blue-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">
                Email Service Test
              </p>
              <p className="text-xs text-gray-600">
                Test if email sending is working properly
              </p>
            </div>
            <button
              type="button"
              onClick={testEmailService}
              disabled={isTestingEmail}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center gap-2"
            >
              {isTestingEmail ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                  Testing...
                </>
              ) : (
                "Test Email"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
