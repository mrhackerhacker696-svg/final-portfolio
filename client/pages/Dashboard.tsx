import Layout from "../components/Layout";
import {
  Target,
  Code,
  Activity,
  TrendingUp,
  Edit,
  List,
  FileText,
  Upload,
  Github,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  RefreshCw,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { dataService } from "../services/dataService";
import { useProfile } from "../contexts/ProfileContext";
import { uploadAPI } from "../services/api";

export default function Dashboard() {
  const { profile, updateProfileImage, updateLogo, updateResumeUrl } =
    useProfile();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [tempLogoText, setTempLogoText] = useState(profile.logoText);
  const [isEditingLogo, setIsEditingLogo] = useState(false);

  // Dynamic counts state
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalSkills: 0,
    recentActivities: 0,
    totalMessages: 0,
    lastUpdated: new Date().toLocaleString(),
  });

  // Function to load dynamic data counts
  const loadStats = async () => {
    try {
      const [projects, skills, activities, messages] = await Promise.all([
        dataService.getProjects(),
        dataService.getSkills(),
        dataService.getActivities(),
        dataService.getContactMessages(),
      ]);

      // Count recent activities (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentActivities = activities.filter((activity: any) => {
        const activityDate = new Date(
          activity.date || activity.timestamp || Date.now(),
        );
        return activityDate >= sevenDaysAgo;
      }).length;

      setStats({
        totalProjects: projects.length,
        totalSkills: skills.length,
        recentActivities: recentActivities,
        totalMessages: messages.length,
        lastUpdated: new Date().toLocaleString(),
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  // Load stats on component mount and set up periodic refresh
  useEffect(() => {
    loadStats();

    // Refresh stats every 30 seconds for real-time updates
    const interval = setInterval(loadStats, 30000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setResumeFile(file);
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const res = await uploadAPI.uploadBase64({
        type: 'document',
        filename: file.name,
        mimeType: file.type,
        data: base64,
      });
      if (res?.url) {
        await updateResumeUrl(res.url);
      }
    } catch (e) {
      console.error('Resume upload failed', e);
    }
  };

  const handleProfileImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setProfileImage(file);
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const res = await uploadAPI.uploadBase64({
        type: 'profile-image',
        filename: file.name,
        mimeType: file.type,
        data: base64,
      });
      if (res?.url) {
        await updateProfileImage(res.url);
      }
    } catch (e) {
      console.error('Profile image upload failed', e);
    }
  };

  return (
    <Layout>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <button
              onClick={loadStats}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Data
            </button>
          </div>

          {/* Overview Section */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Overview
            </h2>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">
                      Total Projects
                    </h3>
                    <p className="text-3xl font-bold text-blue-600">
                      {stats.totalProjects}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Currently published projects.
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Code className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">
                      Total Skills
                    </h3>
                    <p className="text-3xl font-bold text-green-600">
                      {stats.totalSkills}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Skills listed in your portfolio.
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">
                      Recent Activities
                    </h3>
                    <p className="text-3xl font-bold text-purple-600">
                      {stats.recentActivities}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      New entries in the last 7 days.
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <Activity className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">
                      Total Messages
                    </h3>
                    <p className="text-3xl font-bold text-orange-600">
                      {stats.totalMessages}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Contact form submissions.
                    </p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <Mail className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Last Updated Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-900 font-medium">
                    Real-time Dashboard
                  </span>
                </div>
                <div className="text-blue-800 text-sm">
                  Last updated: {stats.lastUpdated}
                </div>
              </div>
              <p className="text-blue-800 text-sm mt-2">
                📊 Data automatically refreshes when you add/edit projects,
                skills, activities, or receive messages.
              </p>
            </div>
          </div>

          {/* Quick Management Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Quick Management
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Manage Resume */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-purple-50 rounded-lg mr-3">
                    <FileText className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Resume</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Upload and manage your resume file for download.
                </p>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Resume
                  </label>
                  {resumeFile && (
                    <div className="space-y-2">
                      <div className="text-xs text-green-600 font-medium">
                        ✓ {resumeFile.name} uploaded
                      </div>
                      <button
                        onClick={() => {
                          if (profile.resumeUrl) {
                            window.open(profile.resumeUrl, "_blank");
                          }
                        }}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        View Resume
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Manage Skills */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg mr-3">
                    <Target className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Manage Skills</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Add, edit, or delete skill entries with proficiency levels.
                </p>
                <Link
                  to="/skills"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors inline-block text-center"
                >
                  Manage Skills
                </Link>
              </div>

              {/* Manage Projects */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg mr-3">
                    <Code className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    Manage Projects
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Add, edit, or remove projects, including images and detailed
                  descriptions.
                </p>
                <Link
                  to="/projects"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors inline-block text-center"
                >
                  Manage Projects
                </Link>
              </div>

              {/* Manage Activities */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg mr-3">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    Manage Activities
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Update recent activities, events, or achievements with
                  detailed information.
                </p>
                <Link
                  to="/activities"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors inline-block text-center"
                >
                  Manage Activities
                </Link>
              </div>

              {/* Portfolio Analytics */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-cyan-50 rounded-lg mr-3">
                    <BarChart3 className="h-5 w-5 text-cyan-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    Portfolio Analytics
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  View real-time analytics, visitor insights, and portfolio
                  performance metrics.
                </p>
                <Link
                  to="/analytics"
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 inline-block text-center font-medium"
                >
                  View Analytics
                </Link>
              </div>

              {/* Profile Image Management */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-indigo-50 rounded-lg mr-3">
                    <svg
                      className="h-5 w-5 text-indigo-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900">Profile Image</h3>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={profile.profileImage}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-2">
                      Upload a professional profile photo for your portfolio.
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageUpload}
                      className="hidden"
                      id="profile-image-upload"
                    />
                    <label
                      htmlFor="profile-image-upload"
                      className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer flex items-center justify-center gap-2 w-full"
                    >
                      <Upload className="h-4 w-4" />
                      Change Photo
                    </label>
                  </div>
                </div>
              </div>

              {/* Logo Management */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-yellow-50 rounded-lg mr-3">
                    <svg
                      className="h-5 w-5 text-yellow-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1h4zM3 10h18v10a1 1 0 01-1 1H4a1 1 0 01-1-1V10z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    Logo & Branding
                  </h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Logo
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                        <span className="text-xl font-bold text-blue-600">
                          {profile.logoText}
                        </span>
                      </div>
                      <button
                        onClick={() => setIsEditingLogo(!isEditingLogo)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {isEditingLogo && (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={tempLogoText}
                        onChange={(e) => setTempLogoText(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter logo text"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            updateLogo(tempLogoText);
                            setIsEditingLogo(false);
                          }}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                        >
                          Save Logo
                        </button>
                        <button
                          onClick={() => {
                            setIsEditingLogo(false);
                            setTempLogoText(profile.logoText); // Reset to current
                          }}
                          className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  <p className="text-sm text-gray-600">
                    Customize your site logo and branding that appears in the
                    header.
                  </p>
                </div>
              </div>

              {/* Git Integration */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-gray-50 rounded-lg mr-3">
                    <Github className="h-5 w-5 text-gray-800" />
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    Git Integration
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Connect GitHub to sync repositories and showcase your coding
                  work automatically.
                </p>
                <Link
                  to="/git-integration"
                  className="w-full bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-900 transition-colors inline-block text-center"
                >
                  Connect GitHub
                </Link>
              </div>
            </div>

            {/* Contact Information Quick Edit */}
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">
                    Contact Information
                  </h3>
                  <Link
                    to="/contact"
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    Edit All
                  </Link>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Mail className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <p className="text-xs text-gray-600">
                        {profile.contactInfo.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Phone className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Phone</p>
                      <p className="text-xs text-gray-600">
                        {profile.contactInfo.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <MapPin className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Location
                      </p>
                      <p className="text-xs text-gray-600">
                        {profile.contactInfo.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Social Links</h3>
                  <Link
                    to="/contact"
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    Edit Links
                  </Link>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <Github className="h-4 w-4 text-gray-800" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        GitHub
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {profile.contactInfo.github}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <ExternalLink className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        LinkedIn
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {profile.contactInfo.linkedin}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
