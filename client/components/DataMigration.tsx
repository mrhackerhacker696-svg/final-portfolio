import React, { useState, useEffect } from "react";
import { migrationAPI } from "../services/api";
import { createSampleData, clearSampleData } from "../utils/createSampleData";
import {
  CheckCircle,
  AlertCircle,
  Database,
  Upload,
  RefreshCw,
  TestTube,
  Trash2,
} from "lucide-react";

export default function DataMigration() {
  const [migrationStatus, setMigrationStatus] = useState<any>(null);
  const [migrating, setMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [creatingData, setCreatingData] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Add a small delay to ensure the server has started
    const timer = setTimeout(() => {
      checkMigrationStatus();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const checkMigrationStatus = async (retryCount = 0) => {
    try {
      const status = await migrationAPI.getStatus();
      setMigrationStatus(status);
      setError(""); // Clear any previous errors
    } catch (error: any) {
      console.error("Error checking migration status:", error);

      // Retry once after a short delay
      if (retryCount < 1) {
        console.log("Retrying migration status check...");
        setTimeout(() => checkMigrationStatus(retryCount + 1), 2000);
        return;
      }

      // If API fails after retry, assume MongoDB is not available
      setMigrationStatus({
        hasProfile: false,
        projectsCount: 0,
        contactsCount: 0,
        hasGitSettings: false,
        migrated: false,
        mongodbAvailable: false,
        message:
          "Unable to connect to migration API. Running in localStorage mode.",
      });
      setError(`API connection failed: ${error.message || "Unknown error"}`);
    }
  };

  const migrateData = async () => {
    setMigrating(true);
    setError("");
    setMigrationResult(null);

    try {
      // Collect all localStorage data
      const localStorageData: any = {};

      // Get all localStorage items that we want to migrate
      const keys = [
        "profileData",
        "adminProjects",
        "contactMessages",
        "gitSettings",
        "smsNotifications",
        "smsCategories",
        "notificationSettings",
        "activities",
        "skills"
      ];

      keys.forEach((key) => {
        const data = localStorage.getItem(key);
        if (data) {
          localStorageData[key] = data;
        }
      });

      // Send data to server for migration
      const result = await migrationAPI.migrate(localStorageData);
      setMigrationResult(result);

      // Refresh migration status
      await checkMigrationStatus();

      if (result.success) {
        // Clear localStorage after successful migration
        keys.forEach((key) => {
          localStorage.removeItem(key);
        });
      }
    } catch (error: any) {
      console.error("Migration error:", error);
      if (error.message.includes("503")) {
        setError(
          "MongoDB is not available. Please set up MongoDB and enable it in your environment variables.",
        );
      } else {
        setError(error.message || "Migration failed");
      }
    } finally {
      setMigrating(false);
    }
  };

  const hasLocalStorageData = () => {
    const keys = [
      "profileData",
      "adminProjects",
      "contactMessages",
      "gitSettings",
      "smsNotifications",
      "smsCategories",
      "notificationSettings",
      "activities",
      "skills"
    ];
    return keys.some((key) => localStorage.getItem(key));
  };

  const createTestData = async () => {
    setCreatingData(true);
    try {
      const result = createSampleData();
      setSuccessMessage(`Sample data created: ${Object.values(result).reduce((a, b) => a + b, 0)} items`);
      setTimeout(() => setSuccessMessage(""), 3000);
      // Refresh status to show the new data available for migration
      await checkMigrationStatus();
    } catch (error) {
      console.error("Error creating sample data:", error);
      setError("Failed to create sample data");
    } finally {
      setCreatingData(false);
    }
  };

  const clearTestData = () => {
    if (confirm("Are you sure you want to clear all localStorage data? This action cannot be undone.")) {
      clearSampleData();
      setSuccessMessage("Sample data cleared from localStorage");
      setTimeout(() => setSuccessMessage(""), 3000);
      // Refresh status
      checkMigrationStatus();
    }
  };

  if (migrationStatus === null) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Checking migration status...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Database className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Data Migration to MongoDB
            </h2>
            <p className="text-sm text-gray-600">
              Migrate your data from browser storage to secure MongoDB database
            </p>
          </div>
        </div>
        <button
          onClick={() => checkMigrationStatus(0)}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          title="Refresh migration status"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <h3 className="font-medium text-green-900">Success</h3>
          </div>
          <p className="text-sm text-green-800 mt-1">{successMessage}</p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <h3 className="font-medium text-red-900">API Connection Issue</h3>
          </div>
          <p className="text-sm text-red-800 mb-3">{error}</p>
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
            <p className="text-sm text-yellow-800">
              <strong>Don't worry!</strong> Your app is still working normally
              in localStorage mode. The migration feature will be available once
              the API connection is restored.
            </p>
          </div>
        </div>
      )}

      {/* MongoDB Disabled Notice */}
      {migrationStatus && migrationStatus.mongodbAvailable === false && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <h3 className="font-medium text-yellow-900">
              MongoDB Currently Disabled
            </h3>
          </div>
          <p className="text-sm text-yellow-800 mb-3">
            {migrationStatus.message ||
              "MongoDB integration is currently disabled. Your app is running in localStorage mode."}
          </p>
          <p className="text-sm text-yellow-800">
            To enable MongoDB: Set ENABLE_MONGODB=true in your environment
            variables and ensure MongoDB is running.
          </p>
        </div>
      )}

      {/* Migration Status */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">Current Data Status</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Profile Data</span>
              <div className="flex items-center gap-2">
                {migrationStatus.hasProfile ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                )}
                <span className="text-sm">
                  {migrationStatus.hasProfile ? "Migrated" : "Local Storage"}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Projects</span>
              <div className="flex items-center gap-2">
                {migrationStatus.projectsCount > 0 ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                )}
                <span className="text-sm">
                  {migrationStatus.projectsCount} in Database
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Contact Messages</span>
              <div className="flex items-center gap-2">
                {migrationStatus.contactsCount > 0 ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                )}
                <span className="text-sm">
                  {migrationStatus.contactsCount} in Database
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Git Settings</span>
              <div className="flex items-center gap-2">
                {migrationStatus.hasGitSettings ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                )}
                <span className="text-sm">
                  {migrationStatus.hasGitSettings
                    ? "Migrated"
                    : "Local Storage"}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">SMS Notifications</span>
              <div className="flex items-center gap-2">
                {migrationStatus.smsNotificationsCount > 0 ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                )}
                <span className="text-sm">
                  {migrationStatus.smsNotificationsCount} in Database
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">User Settings</span>
              <div className="flex items-center gap-2">
                {migrationStatus.hasUserSettings ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                )}
                <span className="text-sm">
                  {migrationStatus.hasUserSettings
                    ? "Migrated"
                    : "Local Storage"}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Activities</span>
              <div className="flex items-center gap-2">
                {migrationStatus.activitiesCount > 0 ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                )}
                <span className="text-sm">
                  {migrationStatus.activitiesCount} in Database
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Skills</span>
              <div className="flex items-center gap-2">
                {migrationStatus.skillsCount > 0 ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                )}
                <span className="text-sm">
                  {migrationStatus.skillsCount} in Database
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">Migration Benefits</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <span>Data persists across devices and browsers</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <span>Backup and recovery capabilities</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <span>Better performance and scalability</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <span>Secure database storage</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Sample Data Creation */}
      {migrationStatus && migrationStatus.mongodbAvailable && (
        <div className="border-t border-gray-200 pt-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-medium text-gray-900">Test Data Management</h3>
              <p className="text-sm text-gray-600">
                Create sample data in localStorage to test the migration process
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={createTestData}
                disabled={creatingData}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {creatingData ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <TestTube className="h-4 w-4" />
                    Create Sample Data
                  </>
                )}
              </button>
              {hasLocalStorageData() && (
                <button
                  onClick={clearTestData}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear Data
                </button>
              )}
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Sample data includes projects, contacts, git settings, SMS notifications,
              user settings, activities, and skills. This will help you test the complete migration process.
            </p>
          </div>
        </div>
      )}

      {/* Migration Actions */}
      {!migrationStatus.migrated && hasLocalStorageData() && (
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Ready to Migrate</h3>
              <p className="text-sm text-gray-600">
                We found data in your browser storage that can be migrated to
                MongoDB
              </p>
            </div>
            <button
              onClick={migrateData}
              disabled={migrating}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {migrating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Migrating...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Migrate to MongoDB
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Migration Result */}
      {migrationResult && (
        <div className="border-t border-gray-200 pt-6 mt-6">
          {migrationResult.success ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h3 className="font-medium text-green-900">
                  Migration Successful!
                </h3>
              </div>
              <p className="text-sm text-green-800">
                Your data has been successfully migrated to MongoDB.
              </p>
              {migrationResult.results.errors.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-orange-800 font-medium">
                    Some warnings occurred:
                  </p>
                  <ul className="text-sm text-orange-700 mt-1">
                    {migrationResult.results.errors.map(
                      (error: string, index: number) => (
                        <li key={index}>• {error}</li>
                      ),
                    )}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <h3 className="font-medium text-red-900">Migration Failed</h3>
              </div>
              <p className="text-sm text-red-800">
                {migrationResult.error || "Unknown error occurred"}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Already Migrated Status */}
      {migrationStatus.migrated && !hasLocalStorageData() && (
        <div className="border-t border-gray-200 pt-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <h3 className="font-medium text-green-900">
                  Data Successfully Migrated
                </h3>
                <p className="text-sm text-green-800">
                  All your data is now stored securely in MongoDB.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
