import Layout from "../components/Layout";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageCircle,
  CheckCircle,
  Edit,
  Trash2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useProfile } from "../contexts/ProfileContext";
import { dataService } from "../services/dataService";

export default function Contact() {
  const { profile, updateContactInfo } = useProfile();
  const [contactInfo, setContactInfo] = useState(profile.contactInfo);

  const [messages, setMessages] = useState([]);

  // Load messages from server on mount
  useEffect(() => {
    (async () => {
      try {
        const msgs = await dataService.getContactMessages();
        setMessages(msgs);
      } catch (e) {
        console.error("Failed to load contact messages", e);
        setMessages([]);
      }
    })();
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const addTestNotification = () => {
    const testMessage = {
      id: Date.now(),
      name: "Test User",
      email: "test@example.com",
      phone: "+91 9876543210",
      subject: "Test SMS Notification",
      message:
        "This is a test message to verify SMS notifications are working properly.",
      date: new Date().toISOString().split("T")[0],
      status: "new",
      contactMethod: "sms",
    };

    // In Mongo-only mode, just update local state
    setMessages([testMessage, ...messages]);
    setSuccessMessage(
      "Test SMS notification added! Check the notification bell in header.",
    );
    setTimeout(() => setSuccessMessage(""), 5000);
  };

  // Sync local state with profile context
  useEffect(() => {
    setContactInfo(profile.contactInfo);
  }, [profile.contactInfo]);

  const updateContactInfoHandler = () => {
    updateContactInfo(contactInfo);
    setSuccessMessage("Contact information updated successfully!");
    setIsEditing(false);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const deleteMessage = async (id: any) => {
    try {
      await dataService.deleteContactMessage(String(id));
      setMessages(messages.filter((m: any) => (m as any)._id !== id && m.id !== id));
      setSuccessMessage("Message deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (e) {
      console.error("Failed to delete message", e);
    }
  };

  const markAsReplied = (id: number) => {
    setMessages(
      messages.map((m) => (m.id === id ? { ...m, status: "replied" } : m)),
    );
    setSuccessMessage("Message marked as replied!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const sendSMSResponse = (id: number, phone: string) => {
    // Simulate SMS sending
    const message = messages.find((m) => m.id === id);
    if (message) {
      const response = prompt(
        `Send SMS to ${phone}:\n\nOriginal: ${message.message}\n\nYour response:`,
      );
      if (response) {
        markAsReplied(id);
        setSuccessMessage(`SMS sent to ${phone}: "${response}"`);
        setTimeout(() => setSuccessMessage(""), 5000);
      }
    }
  };

  return (
    <Layout>
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Contact Management
            </h1>
            <p className="text-gray-600">
              Manage your contact information and view messages from visitors.
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-800">{successMessage}</span>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Information Management */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Contact Information
                </h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Edit className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) =>
                        setContactInfo((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Mail className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-gray-900">{contactInfo.email}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={contactInfo.phone}
                      onChange={(e) =>
                        setContactInfo((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Phone className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-gray-900">{contactInfo.phone}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={contactInfo.location}
                      onChange={(e) =>
                        setContactInfo((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <MapPin className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-gray-900">
                        {contactInfo.location}
                      </span>
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        LinkedIn URL
                      </label>
                      <input
                        type="url"
                        value={contactInfo.linkedin}
                        onChange={(e) =>
                          setContactInfo((prev) => ({
                            ...prev,
                            linkedin: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        GitHub URL
                      </label>
                      <input
                        type="url"
                        value={contactInfo.github}
                        onChange={(e) =>
                          setContactInfo((prev) => ({
                            ...prev,
                            github: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}

                {isEditing && (
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={updateContactInfoHandler}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Messages Management */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Messages
                </h2>
                <button
                  onClick={addTestNotification}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                >
                  Test SMS Notification
                </button>
              </div>

              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {message.name}
                        </h4>
                        <p className="text-sm text-gray-500">{message.email}</p>
                        {message.phone && (
                          <p className="text-sm text-gray-500">
                            {message.phone}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${message.contactMethod === "sms"
                              ? "bg-purple-100 text-purple-800"
                              : message.contactMethod === "call"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                        >
                          {message.contactMethod}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${message.status === "new"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                            }`}
                        >
                          {message.status}
                        </span>
                        <button
                          onClick={() => deleteMessage(message.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <h5 className="font-medium text-gray-900 mb-2">
                      {message.subject}
                    </h5>
                    <p className="text-gray-600 text-sm mb-3">
                      {message.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {message.date}
                      </span>
                      {message.status === "new" && (
                        <div className="flex gap-2">
                          {message.contactMethod === "sms" && message.phone && (
                            <button
                              onClick={() =>
                                sendSMSResponse(message.id, message.phone)
                              }
                              className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                            >
                              Send SMS
                            </button>
                          )}
                          {message.contactMethod === "call" &&
                            message.phone && (
                              <a
                                href={`tel:${message.phone}`}
                                className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
                              >
                                Call Now
                              </a>
                            )}
                          <button
                            onClick={() => markAsReplied(message.id)}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                          >
                            Mark as Replied
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
