import Layout from "../components/Layout";
// DataMigration removed in MongoDB-only mode
import ApiHealthCheck from "../components/ApiHealthCheck";
import ProfilePhotoUpload from "../components/ProfilePhotoUpload";
import ProfileManagement from "../components/ProfileManagement";
import AdvancedAnalytics from "../components/AdvancedAnalytics";
import ProfileStatus from "../components/ProfileStatus";
import {
  Settings,
  Database,
  Users,
  FileText,
  Shield,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  MessageCircle,
  Phone,
  User2,
  Camera,
} from "lucide-react";
import { useState, useEffect } from "react";
import { dataService } from "../services/dataService";

export default function AdminSettings() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [siteSettings, setSiteSettings] = useState({
    siteName: "Kanu Prajapati Portfolio",
    siteDescription:
      "Full-stack Developer specializing in modern web technologies",
    maintenanceMode: false,
    allowRegistration: false,
    seoEnabled: true,
  });

  const [notificationSettings, setNotificationSettings] = useState<any>({
    mobileNumber: "",
    smsNotifications: false,
    emailNotifications: true,
  });

  useEffect(() => {
    (async () => {
      try {
        const settings = await dataService.getSettings();
        // Load notification settings from server
        setNotificationSettings(settings.notificationSettings || {
          mobileNumber: "",
          smsNotifications: false,
          emailNotifications: true,
        });
        // Load site settings from server to persist across refresh
        if (settings.siteSettings) {
          setSiteSettings(settings.siteSettings);
        }
      } catch (e) {
        console.error("Failed to load settings from server", e);
      }
    })();
  }, []);

  const [databaseStats] = useState({
    totalProjects: 12,
    totalSkills: 18,
    totalActivities: 25,
    totalMessages: 8,
    totalUsers: 1,
    storageUsed: "2.4 GB",
    lastBackup: "2024-07-22 14:30:00",
  });

  const handleExportData = async () => {
    setIsExporting(true);
    // Simulate data export
    setTimeout(() => {
      const data = {
        projects: [
          /* project data */
        ],
        skills: [
          /* skills data */
        ],
        activities: [
          /* activities data */
        ],
        messages: [
          /* messages data */
        ],
        settings: siteSettings,
        exportDate: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `portfolio-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setIsExporting(false);
      setSuccessMessage("Data exported successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    }, 2000);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsImporting(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          // Process imported data here
          console.log("Imported data:", data);
          setIsImporting(false);
          setSuccessMessage("Data imported successfully!");
          setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
          setIsImporting(false);
          alert("Invalid file format. Please upload a valid JSON backup file.");
        }
      };
      reader.readAsText(file);
    }
  };

  const updateSiteSettings = async () => {
    await dataService.updateSiteSettings(siteSettings);
    setSuccessMessage("Site settings updated successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const updateNotificationSettings = async () => {
    await dataService.updateSettings({ notificationSettings });
    setSuccessMessage("Notification settings updated successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <Layout>
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Admin Settings & Database Control
            </h1>
            <p className="text-gray-600">
              Manage your portfolio data, settings, and database operations.
            </p>

            {/* Storage/Health Info */}
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-blue-900 font-medium">MongoDB Storage Enabled</p>
                    <p className="text-blue-800 text-sm">All data is stored securely in MongoDB.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ApiHealthCheck />
                </div>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-800">{successMessage}</span>
            </div>
          )}

          {/* Profile Management Section */}
          <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-indigo-50 rounded-lg mr-3">
                  <User2 className="h-5 w-5 text-indigo-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Profile Management
                </h2>
              </div>
              <p className="text-gray-600 mt-2">
                Manage your profile photo, personal information, skills, and contact details
              </p>
            </div>

            <div className="p-6">
              {/* Profile Status Check */}
              <ProfileStatus />

              {/* Profile Photo Section */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Profile Photo
                </h3>
                <ProfilePhotoUpload />
              </div>

              {/* Comprehensive Profile Management */}
              <ProfileManagement />
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Site Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-blue-50 rounded-lg mr-3">
                  <Settings className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Site Settings
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Name
                  </label>
                  <input
                    type="text"
                    value={siteSettings.siteName}
                    onChange={(e) =>
                      setSiteSettings((prev) => ({
                        ...prev,
                        siteName: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Description
                  </label>
                  <textarea
                    rows={3}
                    value={siteSettings.siteDescription}
                    onChange={(e) =>
                      setSiteSettings((prev) => ({
                        ...prev,
                        siteDescription: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      Maintenance Mode
                    </label>
                    <input
                      type="checkbox"
                      checked={siteSettings.maintenanceMode}
                      onChange={(e) =>
                        setSiteSettings((prev) => ({
                          ...prev,
                          maintenanceMode: e.target.checked,
                        }))
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      SEO Optimization
                    </label>
                    <input
                      type="checkbox"
                      checked={siteSettings.seoEnabled}
                      onChange={(e) =>
                        setSiteSettings((prev) => ({
                          ...prev,
                          seoEnabled: e.target.checked,
                        }))
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <button
                  onClick={updateSiteSettings}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                  Update Settings
                </button>
              </div>
            </div>

            {/* SMS Notification Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-purple-50 rounded-lg mr-3">
                  <MessageCircle className="h-5 w-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  SMS Notifications
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="tel"
                      value={notificationSettings.mobileNumber}
                      onChange={(e) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          mobileNumber: e.target.value,
                        }))
                      }
                      placeholder="+91 9876543210"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    SMS alerts will be sent to this number when someone contacts you
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        SMS Notifications
                      </label>
                      <p className="text-xs text-gray-500">
                        Get instant SMS when someone submits contact form
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.smsNotifications}
                      onChange={(e) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          smsNotifications: e.target.checked,
                        }))
                      }
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Email Notifications
                      </label>
                      <p className="text-xs text-gray-500">
                        Also receive email notifications
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailNotifications}
                      onChange={(e) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          emailNotifications: e.target.checked,
                        }))
                      }
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <button
                  onClick={updateNotificationSettings}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
                >
                  Save Notification Settings
                </button>

                {/* SMS Status */}
                <div className="mt-4 p-3 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                  <p className="text-purple-800 text-sm">
                    <strong>SMS Service:</strong> Currently using demo mode.
                    {notificationSettings.smsNotifications && notificationSettings.mobileNumber ?
                      " SMS notifications are enabled." :
                      " Enable SMS and add mobile number to receive alerts."
                    }
                  </p>
                  <p className="text-purple-700 text-xs mt-1">
                    In production, integrate with services like Twilio, AWS SNS, or local SMS providers.
                  </p>
                </div>
              </div>
            </div>

            {/* Database Statistics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-green-50 rounded-lg mr-3">
                  <Database className="h-5 w-5 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Database Overview
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {databaseStats.totalProjects}
                  </div>
                  <div className="text-sm text-gray-600">Projects</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {databaseStats.totalSkills}
                  </div>
                  <div className="text-sm text-gray-600">Skills</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {databaseStats.totalActivities}
                  </div>
                  <div className="text-sm text-gray-600">Activities</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {databaseStats.totalMessages}
                  </div>
                  <div className="text-sm text-gray-600">Messages</div>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Storage Used:</span>
                  <span className="font-medium">
                    {databaseStats.storageUsed}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Backup:</span>
                  <span className="font-medium">
                    {databaseStats.lastBackup}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-purple-50 rounded-lg mr-3">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Data Management
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Export Data */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Export Portfolio Data
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Download a complete backup of your portfolio data including
                  projects, skills, activities, and settings.
                </p>
                <button
                  onClick={handleExportData}
                  disabled={isExporting}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isExporting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Export Data
                    </>
                  )}
                </button>
              </div>

              {/* Import Data */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Import Portfolio Data
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Upload a backup file to restore your portfolio data. This will
                  overwrite existing data.
                </p>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                  id="import-data"
                  disabled={isImporting}
                />
                <label
                  htmlFor="import-data"
                  className={`w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 flex items-center justify-center gap-2 cursor-pointer ${isImporting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                  {isImporting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Import Data
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Advanced Analytics Section */}
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-green-50 rounded-lg mr-3">
                  <Database className="h-5 w-5 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Portfolio Analytics
                </h2>
              </div>
              <p className="text-gray-600 mt-2">
                Track your portfolio performance, visitor insights, and engagement metrics
              </p>
            </div>

            <div className="p-6">
              <AdvancedAnalytics />
            </div>
          </div>

          {/* Data Migration removed in MongoDB-only mode */}
        </div>
      </div>
    </Layout>
  );
}
