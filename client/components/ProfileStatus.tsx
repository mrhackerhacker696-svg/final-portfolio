import React from "react";
import { useProfile } from "../contexts/ProfileContext";
import { CheckCircle, AlertTriangle, RefreshCw } from "lucide-react";

const ProfileStatus: React.FC = () => {
  const { profile, updatePersonalInfo } = useProfile();

  const checkProfile = () => {
    const issues = [];
    if (!profile.profileImage || profile.profileImage.trim() === "") {
      issues.push("Profile photo not set");
    }
    if (!profile.name || profile.name.trim() === "") {
      issues.push("Name not set");
    }
    if (!profile.tagline || profile.tagline.trim() === "") {
      issues.push("Tagline not set");
    }
    if (!profile.bio || profile.bio.trim() === "") {
      issues.push("Bio not set");
    }
    return issues;
  };

  const resetToDefaults = () => {
    updatePersonalInfo({
      name: "Kanu Prajapati",
      tagline: "Building the future, one line of code at a time",
      bio: "Passionate full-stack developer with expertise in modern web technologies. I love creating innovative solutions that solve real-world problems and enhance user experiences.",
    });
  };

  const issues = checkProfile();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        {issues.length === 0 ? (
          <CheckCircle className="h-5 w-5 text-green-600" />
        ) : (
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
        )}
        Profile Status
      </h3>

      {issues.length === 0 ? (
        <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
          <span className="text-green-800">Your profile is complete and ready!</span>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
            <div>
              <div className="text-yellow-800 font-medium">Profile needs attention:</div>
              <ul className="text-yellow-700 text-sm mt-1">
                {issues.map((issue, index) => (
                  <li key={index}>• {issue}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <button
            onClick={resetToDefaults}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Reset to Default Values
          </button>
        </div>
      )}

      {/* Quick Profile Summary */}
      <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-600">Name:</span>
          <span className="ml-2 font-medium">{profile.name || "Not set"}</span>
        </div>
        <div>
          <span className="text-gray-600">Photo:</span>
          <span className="ml-2 font-medium">{profile.profileImage ? "✅ Uploaded" : "❌ Missing"}</span>
        </div>
        <div className="col-span-2">
          <span className="text-gray-600">Tagline:</span>
          <span className="ml-2 font-medium">{profile.tagline || "Not set"}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileStatus;
