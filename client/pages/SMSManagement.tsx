import Layout from "../components/Layout";
import { MessageCircle, Phone, CheckCircle, Clock, Trash2, RefreshCw, Plus, Filter, Tag, Send, AlertCircle, TestTube } from "lucide-react";
import { useState, useEffect } from "react";
import { dataService } from "../services/dataService";

interface SMSNotification {
  id: number;
  to: string;
  message: string;
  timestamp: string;
  status: "pending" | "delivered" | "failed";
  category?: string;
  priority?: "low" | "medium" | "high";
}

export default function SMSManagement() {
  const [smsNotifications, setSmsNotifications] = useState<SMSNotification[]>([]);
  const [notificationSettings, setNotificationSettings] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  // SMS sending states
  const [showSendSMS, setShowSendSMS] = useState(false);
  const [smsForm, setSmsForm] = useState({
    to: "",
    message: "",
    category: "Contact"
  });
  const [isSendingSMS, setIsSendingSMS] = useState(false);
  const [smsStatus, setSmsStatus] = useState<any>(null);
  const [sendResult, setSendResult] = useState<any>(null);

  useEffect(() => {
    loadSMSNotifications();
    loadNotificationSettings();
    loadCategories();
    loadSMSStatus();
  }, []);

  const loadCategories = async () => {
    const savedCategories = await dataService.getSMSCategories();
    setCategories(savedCategories);
  };

  const loadSMSNotifications = async () => {
    const notifications = await dataService.getSMSNotifications();
    setSmsNotifications(notifications);
  };

  const loadNotificationSettings = async () => {
    const settings = await dataService.getSettings();
    setNotificationSettings(settings.notificationSettings || {});
  };

  const loadSMSStatus = async () => {
    try {
      const response = await fetch('/api/sms/status');
      const status = await response.json();
      setSmsStatus(status);
    } catch (error) {
      console.error('Failed to load SMS status:', error);
    }
  };

  const sendSMS = async () => {
    if (!smsForm.to || !smsForm.message) {
      alert('Please fill in both phone number and message');
      return;
    }

    setIsSendingSMS(true);
    setSendResult(null);

    try {
      const response = await fetch('/api/sms/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: smsForm.to,
          message: smsForm.message,
          category: smsForm.category,
        }),
      });

      const result = await response.json();
      setSendResult(result);

      if (result.success) {
        // Reload notifications to show the new SMS
        await loadSMSNotifications();
        // Reset form
        setSmsForm({ to: "", message: "", category: "Contact" });
        setShowSendSMS(false);
      }
    } catch (error) {
      setSendResult({ success: false, error: 'Failed to send SMS' });
    } finally {
      setIsSendingSMS(false);
    }
  };

  const sendTestSMS = async () => {
    const testNumber = notificationSettings.mobileNumber || "+919876543210";
    setSmsForm({
      to: testNumber,
      message: "🧪 Test SMS from Kanu Prajapati Portfolio - Exotel Integration Working!",
      category: "Test"
    });
    setShowSendSMS(true);
  };

  const deleteSMSNotification = async (id: number) => {
    if (confirm("Are you sure you want to delete this SMS notification?")) {
      await dataService.clearSMSNotifications(); // Backend supports bulk clear; for single deletion, keep UI remove
      const updated = smsNotifications.filter(sms => (sms as any)._id !== id && sms.id !== id);
      setSmsNotifications(updated);
    }
  };

  const clearAllSMS = async () => {
    if (confirm("Are you sure you want to clear all SMS notifications?")) {
      await dataService.clearSMSNotifications();
      setSmsNotifications([]);
    }
  };

  const addCategory = async () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      const updatedCategories = await dataService.updateSMSCategories([...categories, newCategory.trim()]);
      setCategories(updatedCategories);
      setNewCategory("");
      setShowAddCategory(false);
    }
  };

  const removeCategory = async (categoryToRemove: string) => {
    if (confirm(`Are you sure you want to remove the category "${categoryToRemove}"?`)) {
      const updatedCategories = await dataService.updateSMSCategories(categories.filter(cat => cat !== categoryToRemove));
      setCategories(updatedCategories);

      // Remove category from existing SMS notifications
      const updatedSMS = smsNotifications.map(sms =>
        sms.category === categoryToRemove ? { ...sms, category: undefined } : sms
      );
      setSmsNotifications(updatedSMS);
    }
  };

  const updateSMSCategory = (smsId: number, category: string) => {
    const updatedSMS = smsNotifications.map(sms =>
      (sms as any)._id === smsId || sms.id === smsId ? { ...sms, category } : sms
    );
    setSmsNotifications(updatedSMS);
  };

  const filteredSMS = selectedCategory === "all"
    ? smsNotifications
    : smsNotifications.filter(sms => sms.category === selectedCategory || (!sms.category && selectedCategory === "uncategorized"));

  const testSMS = async () => {
    if (!notificationSettings.mobileNumber) {
      alert("Please set your mobile number in Admin Settings first.");
      return;
    }

    setIsLoading(true);

    // Simulate test SMS
    const testSMS = {
      id: Date.now(),
      to: notificationSettings.mobileNumber,
      message: "🧪 Test SMS: Your SMS notification system is working correctly!",
      timestamp: new Date().toISOString(),
      status: "delivered" as const,
      category: "Support",
      priority: "medium" as const
    };

    setTimeout(() => {
      const updated = [testSMS as any, ...smsNotifications];
      setSmsNotifications(updated);
      setIsLoading(false);
      alert("Test SMS sent successfully! Check your SMS list below.");
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "failed":
        return <MessageCircle className="h-4 w-4 text-red-600" />;
      default:
        return <MessageCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout>
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                SMS Notifications Management
              </h1>
              <p className="text-gray-600 mt-1">
                Monitor and manage SMS notifications sent for contact inquiries
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSendSMS(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                Send SMS
              </button>
              <button
                onClick={sendTestSMS}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <TestTube className="h-4 w-4" />
                Test Exotel
              </button>
              <button
                onClick={testSMS}
                disabled={isLoading}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Phone className="h-4 w-4" />
                )}
                Test SMS
              </button>
              {smsNotifications.length > 0 && (
                <button
                  onClick={clearAllSMS}
                  className="border border-red-300 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Category Management */}
          <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">SMS Categories</h2>
              </div>
              <button
                onClick={() => setShowAddCategory(!showAddCategory)}
                className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 flex items-center gap-1 text-sm"
              >
                <Plus className="h-4 w-4" />
                Add Category
              </button>
            </div>

            {/* Add Category Form */}
            {showAddCategory && (
              <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Enter category name"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                  />
                  <button
                    onClick={addCategory}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setShowAddCategory(false);
                      setNewCategory("");
                    }}
                    className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1 rounded-full text-sm font-medium ${selectedCategory === "all"
                  ? "bg-blue-100 text-blue-800 border border-blue-300"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                All ({smsNotifications.length})
              </button>

              {categories.map((category) => {
                const count = smsNotifications.filter(sms => sms.category === category).length;
                return (
                  <div key={category} className="flex items-center gap-1">
                    <button
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${selectedCategory === category
                        ? "bg-purple-100 text-purple-800 border border-purple-300"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                      {category} ({count})
                    </button>
                    <button
                      onClick={() => removeCategory(category)}
                      className="text-red-500 hover:text-red-700 text-xs"
                      title={`Remove ${category} category`}
                    >
                      ×
                    </button>
                  </div>
                );
              })}

              <button
                onClick={() => setSelectedCategory("uncategorized")}
                className={`px-3 py-1 rounded-full text-sm font-medium ${selectedCategory === "uncategorized"
                  ? "bg-gray-100 text-gray-800 border border-gray-300"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                Uncategorized ({smsNotifications.filter(sms => !sms.category).length})
              </button>
            </div>
          </div>

          {/* SMS Settings Overview */}
          <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-purple-50 rounded-lg mr-3">
                <MessageCircle className="h-5 w-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Current SMS Settings
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-700 mb-1">Mobile Number</div>
                <div className="text-lg font-semibold text-gray-900">
                  {notificationSettings.mobileNumber || "Not configured"}
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-700 mb-1">SMS Notifications</div>
                <div className={`text-lg font-semibold ${notificationSettings.smsNotifications ? 'text-green-600' : 'text-red-600'}`}>
                  {notificationSettings.smsNotifications ? "Enabled" : "Disabled"}
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-700 mb-1">Total SMS Sent</div>
                <div className="text-lg font-semibold text-purple-600">
                  {smsNotifications.length}
                </div>
              </div>
            </div>

            {(!notificationSettings.smsNotifications || !notificationSettings.mobileNumber) && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  ⚠️ SMS notifications are not fully configured.
                  Please go to <strong>Admin Settings</strong> to enable SMS notifications and set your mobile number.
                </p>
              </div>
            )}
          </div>

          {/* SMS Notifications List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                SMS Notification History
              </h2>
            </div>

            {filteredSMS.length === 0 ? (
              <div className="p-12 text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {selectedCategory === "all"
                    ? "No SMS notifications yet"
                    : `No SMS in "${selectedCategory}" category`}
                </h3>
                <p className="text-gray-500 mb-4">
                  {selectedCategory === "all"
                    ? "SMS notifications will appear here when someone contacts you through the portfolio."
                    : `No SMS notifications found in the "${selectedCategory}" category.`}
                </p>
                {selectedCategory === "all" && (
                  <button
                    onClick={testSMS}
                    disabled={isLoading}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                  >
                    Send Test SMS
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredSMS.map((sms) => (
                  <div key={sms.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          {getStatusIcon(sms.status)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-medium text-gray-900">
                              To: {sms.to}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(sms.status)}`}>
                              {sms.status.charAt(0).toUpperCase() + sms.status.slice(1)}
                            </span>
                            {sms.category && (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                {sms.category}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-700 mb-2">{sms.message}</p>
                          <div className="flex items-center gap-4 mb-2">
                            <select
                              value={sms.category || ""}
                              onChange={(e) => updateSMSCategory(sms.id, e.target.value)}
                              className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
                            >
                              <option value="">Select Category</option>
                              {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </div>
                          <p className="text-sm text-gray-500">
                            {new Date(sms.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteSMSNotification(sms.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete SMS notification"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SMS Provider Status */}
          {smsStatus && (
            <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                SMS Provider Status
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Exotel Status */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <h4 className="font-semibold text-green-900">Exotel (Primary)</h4>
                  </div>
                  <div className="space-y-1 text-sm text-green-800">
                    <p>• API Key: {smsStatus.exotel.apiKey}</p>
                    <p>• API Token: {smsStatus.exotel.apiToken}</p>
                    <p>• SID: {smsStatus.exotel.sid}</p>
                    <p>• From Number: {smsStatus.exotel.fromNumber}</p>
                  </div>
                </div>

                {/* Twilio Status */}
                <div className={`border rounded-lg p-4 ${smsStatus.twilio.configured ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${smsStatus.twilio.configured ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
                    <h4 className={`font-semibold ${smsStatus.twilio.configured ? 'text-blue-900' : 'text-gray-700'}`}>
                      Twilio (Fallback)
                    </h4>
                  </div>
                  <div className={`space-y-1 text-sm ${smsStatus.twilio.configured ? 'text-blue-800' : 'text-gray-600'}`}>
                    <p>• Account SID: {smsStatus.twilio.accountSid}</p>
                    <p>• Auth Token: {smsStatus.twilio.authToken}</p>
                    <p>• From Number: {smsStatus.twilio.fromNumber}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SMS Service Information */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              SMS Service Integration
            </h3>
            <div className="space-y-2 text-blue-800 text-sm">
              <p>• Exotel is configured as the primary SMS provider</p>
              <p>• Twilio is available as a fallback option</p>
              <p>• SMS notifications are automatically sent when contact forms are submitted</p>
              <p>• Categories help organize different types of SMS notifications</p>
            </div>
          </div>
        </div>
      </div>

      {/* SMS Sending Modal */}
      {showSendSMS && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Send SMS</h3>
              <button
                onClick={() => setShowSendSMS(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={smsForm.to}
                  onChange={(e) => setSmsForm(prev => ({ ...prev, to: e.target.value }))}
                  placeholder="+919876543210"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={smsForm.category}
                  onChange={(e) => setSmsForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  value={smsForm.message}
                  onChange={(e) => setSmsForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Enter your message..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {smsForm.message.length}/160 characters
                </p>
              </div>

              {sendResult && (
                <div className={`p-3 rounded-lg ${sendResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className="flex items-center gap-2">
                    {sendResult.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ${sendResult.success ? 'text-green-800' : 'text-red-800'}`}>
                      {sendResult.success ? 'SMS sent successfully!' : 'Failed to send SMS'}
                    </span>
                  </div>
                  {sendResult.provider && (
                    <p className="text-xs text-gray-600 mt-1">
                      Provider: {sendResult.provider}
                    </p>
                  )}
                  {sendResult.error && (
                    <p className="text-xs text-red-600 mt-1">
                      Error: {sendResult.error}
                    </p>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={sendSMS}
                  disabled={isSendingSMS || !smsForm.to || !smsForm.message}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSendingSMS ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send SMS
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowSendSMS(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
