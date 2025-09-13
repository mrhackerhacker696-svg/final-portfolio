import React, { useState, useRef } from "react";
import {
  User,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Plus,
  X,
  Save,
  Edit,
  CheckCircle,
  Upload,
  FileText,
  AlertCircle,
} from "lucide-react";
import { useProfile } from "../contexts/ProfileContext";
import { dataService } from "../services/dataService";
import { uploadAPI } from "../services/api";

const ProfileManagement: React.FC = () => {
  const { profile, isLoading, updatePersonalInfo, updateContactInfo, updateSkills, updateBio, updateResumeUrl } = useProfile();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [tempData, setTempData] = useState<any>({});
  const [newSkill, setNewSkill] = useState("");
  const [dbSkills, setDbSkills] = useState<any[]>([]);
  const [isSavingSkill, setIsSavingSkill] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Resume upload states
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [resumeUploadError, setResumeUploadError] = useState<string | null>(null);
  const [resumeUploadSuccess, setResumeUploadSuccess] = useState(false);
  const resumeFileInputRef = useRef<HTMLInputElement>(null);

  // Show loading state while profile is being loaded
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    );
  }

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleEdit = (section: string) => {
    setIsEditing(section);
    setTempData({ ...profile });
  };

  const handleSave = (section: string) => {
    switch (section) {
      case "personal":
        updatePersonalInfo({
          name: tempData.name,
          bio: tempData.bio,
          tagline: tempData.tagline,
          experience: tempData.experience,
          availability: tempData.availability,
        });
        showSuccess("Personal information updated successfully!");
        break;
      case "contact":
        updateContactInfo(tempData.contactInfo);
        showSuccess("Contact information updated successfully!");
        break;
      case "skills":
        updateSkills(tempData.skills);
        showSuccess("Skills updated successfully!");
        break;
    }
    setIsEditing(null);
    setTempData({});
  };

  const handleCancel = () => {
    setIsEditing(null);
    setTempData({});
    setNewSkill("");
  };

  const addSkill = () => {
    if (newSkill.trim() && !(tempData.skills || profile.skills || []).includes(newSkill.trim())) {
      setTempData((prev: any) => ({
        ...prev,
        skills: [...(prev.skills || profile.skills || []), newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setTempData((prev: any) => ({
      ...prev,
      skills: prev.skills.filter((skill: string) => skill !== skillToRemove),
    }));
  };

  // Resume upload functions
  const validateResumeFile = (file: File): string | null => {
    const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      return "Please upload a valid document file (PDF, DOC, or DOCX)";
    }

    if (file.size > maxSize) {
      return "File size must be less than 10MB";
    }

    return null;
  };

  const handleResumeUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const validationError = validateResumeFile(file);

    if (validationError) {
      setResumeUploadError(validationError);
      return;
    }

    setResumeUploadError(null);
    setIsUploadingResume(true);

    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await uploadAPI.uploadBase64({
        type: 'resume',
        filename: file.name,
        mimeType: file.type,
        data: base64,
      });

      if (res?.url) {
        await updateResumeUrl(res.url);
        setResumeUploadSuccess(true);
        showSuccess("Resume uploaded successfully!");
        setTimeout(() => {
          setResumeUploadSuccess(false);
        }, 3000);
      } else {
        throw new Error('Upload did not return URL');
      }

    } catch (error) {
      setResumeUploadError("Failed to upload resume. Please try again.");
    } finally {
      setIsUploadingResume(false);
    }
  };

  const handleResumeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    handleResumeUpload(e.target.files);
  };

  const openResumeFileDialog = () => {
    resumeFileInputRef.current?.click();
  };

  const removeResume = () => {
    updateResumeUrl("");
    setResumeUploadSuccess(true);
    showSuccess("Resume removed successfully!");
    setTimeout(() => setResumeUploadSuccess(false), 3000);
  };

  // DB Skills management (MongoDB-backed)
  const loadDbSkills = async () => {
    try {
      const skills = await dataService.getSkills();
      setDbSkills(skills);
    } catch (e) {
      console.error("Failed to load DB skills", e);
      setDbSkills([]);
    }
  };

  React.useEffect(() => {
    loadDbSkills();
  }, []);

  const createDbSkill = async () => {
    if (!newSkill.trim()) return;
    setIsSavingSkill(true);
    try {
      const payload = { name: newSkill.trim(), category: "languages", level: 70 };
      await dataService.createSkill(payload);
      setNewSkill("");
      await loadDbSkills();
      showSuccess("Skill added to database!");
    } catch (e) {
      console.error("Failed to create skill", e);
    } finally {
      setIsSavingSkill(false);
    }
  };

  const deleteDbSkill = async (id: string) => {
    try {
      await dataService.deleteSkill(id);
      await loadDbSkills();
      showSuccess("Skill removed from database!");
    } catch (e) {
      console.error("Failed to delete skill", e);
    }
  };

  return (
    <div className="space-y-8">
      {/* Success Message */}
      {successMessage && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
          <p className="text-green-800">{successMessage}</p>
        </div>
      )}

      {/* Personal Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg mr-3">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
          </div>
          {isEditing !== "personal" ? (
            <button
              onClick={() => handleEdit("personal")}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <Edit className="h-4 w-4" />
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => handleSave("personal")}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Save className="h-4 w-4" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            {isEditing === "personal" ? (
              <input
                type="text"
                value={tempData.name || ""}
                onChange={(e) => setTempData((prev: any) => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900 py-2">{profile.name || "Not set"}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
            {isEditing === "personal" ? (
              <input
                type="text"
                value={tempData.experience || ""}
                onChange={(e) => setTempData((prev: any) => ({ ...prev, experience: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900 py-2">{profile.experience || "Not set"}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
            {isEditing === "personal" ? (
              <input
                type="text"
                value={tempData.tagline || ""}
                onChange={(e) => setTempData((prev: any) => ({ ...prev, tagline: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900 py-2">{profile.tagline || "Not set"}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            {isEditing === "personal" ? (
              <textarea
                rows={4}
                value={tempData.bio || ""}
                onChange={(e) => setTempData((prev: any) => ({ ...prev, bio: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900 py-2">{profile.bio || "Not set"}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
            {isEditing === "personal" ? (
              <input
                type="text"
                value={tempData.availability || ""}
                onChange={(e) => setTempData((prev: any) => ({ ...prev, availability: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Available for freelance projects"
              />
            ) : (
              <p className="text-gray-900 py-2">{profile.availability || "Not set"}</p>
            )}
          </div>
        </div>
      </div>

      {/* Skills Management */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-50 rounded-lg mr-3">
              <Briefcase className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Skills</h3>
          </div>
          {isEditing !== "skills" ? (
            <button
              onClick={() => handleEdit("skills")}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
            >
              <Edit className="h-4 w-4" />
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => handleSave("skills")}
                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
              >
                <Save className="h-4 w-4" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {isEditing === "skills" && (
          <div className="mb-4 flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addSkill()}
              placeholder="Add a new skill"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={addSkill}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
            <button
              onClick={createDbSkill}
              disabled={isSavingSkill}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {isSavingSkill ? "Saving..." : "Save to Mongo"}
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {(isEditing === "skills" ? tempData.skills || profile.skills || [] : profile.skills || []).map((skill: string, index: number) => (
            <div
              key={index}
              className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              {skill}
              {isEditing === "skills" && (
                <button
                  onClick={() => removeSkill(skill)}
                  className="text-purple-600 hover:text-purple-800"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* DB Skills List (Mongo-backed, mirrors home page skills) */}
        <div className="mt-6">
          <h4 className="font-medium text-gray-800 mb-2">Database Skills</h4>
          <div className="flex flex-wrap gap-2">
            {dbSkills.map((s) => (
              <div key={s._id} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                {s.name} <span className="opacity-70">({s.category})</span>
                <button onClick={() => deleteDbSkill(s._id)} className="text-green-700 hover:text-green-900">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {dbSkills.length === 0 && (
              <div className="text-sm text-gray-500">No skills in MongoDB yet.</div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-50 rounded-lg mr-3">
              <Mail className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Contact Information</h3>
          </div>
          {isEditing !== "contact" ? (
            <button
              onClick={() => handleEdit("contact")}
              className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
            >
              <Edit className="h-4 w-4" />
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => handleSave("contact")}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                <Save className="h-4 w-4" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            { key: "email", label: "Email", icon: Mail, type: "email" },
            { key: "phone", label: "Phone", icon: Phone, type: "tel" },
            { key: "location", label: "Location", icon: MapPin, type: "text" },
            { key: "website", label: "Website", icon: Globe, type: "url" },
            { key: "linkedin", label: "LinkedIn", icon: Linkedin, type: "url" },
            { key: "github", label: "GitHub", icon: Github, type: "url" },
            { key: "twitter", label: "Twitter", icon: Twitter, type: "url" },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <field.icon className="h-4 w-4 inline mr-1" />
                {field.label}
              </label>
              {isEditing === "contact" ? (
                <input
                  type={field.type}
                  value={(tempData.contactInfo?.[field.key as keyof typeof tempData.contactInfo]) || (profile.contactInfo?.[field.key as keyof typeof profile.contactInfo]) || ""}
                  onChange={(e) =>
                    setTempData((prev: any) => ({
                      ...prev,
                      contactInfo: {
                        ...(prev.contactInfo || profile.contactInfo || {}),
                        [field.key]: e.target.value,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              ) : (
                <p className="text-gray-900 py-2 break-all">
                  {(profile.contactInfo && profile.contactInfo[field.key as keyof typeof profile.contactInfo]) || "Not set"}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Resume Upload Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Resume Management</h3>
          </div>
        </div>

        {/* Current Resume */}
        <div className="mb-6">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <FileText className="h-8 w-8 text-gray-600" />
            <div className="flex-1">
              {profile.resumeUrl ? (
                <div>
                  <p className="font-medium text-gray-900">Current Resume</p>
                  <p className="text-sm text-gray-600 break-all">{profile.resumeUrl}</p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => window.open(profile.resumeUrl, '_blank')}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View Resume
                    </button>
                    <button
                      onClick={removeResume}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Remove Resume
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="font-medium text-gray-900">No Resume Uploaded</p>
                  <p className="text-sm text-gray-600">Upload your resume to make it available for download</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upload Area */}
        <div className="space-y-4">
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${isUploadingResume ? "pointer-events-none opacity-50" : "border-gray-300 hover:border-gray-400"
              }`}
          >
            <input
              ref={resumeFileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeFileChange}
              className="hidden"
            />

            {isUploadingResume ? (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                  <Upload className="h-8 w-8 text-blue-600 animate-bounce" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">Uploading Resume...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                  <FileText className="h-8 w-8 text-gray-600" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    Drop your resume here, or{" "}
                    <button
                      onClick={openResumeFileDialog}
                      className="text-blue-600 hover:text-blue-700 underline"
                    >
                      browse
                    </button>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Supports PDF, DOC, DOCX (max 10MB)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Upload Messages */}
          {resumeUploadError && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <p className="text-red-800">{resumeUploadError}</p>
            </div>
          )}

          {resumeUploadSuccess && (
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <p className="text-green-800">Resume updated successfully!</p>
            </div>
          )}

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Tips for best results:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use PDF format for best compatibility</li>
              <li>• Keep file size under 10MB</li>
              <li>• Include your latest experience and skills</li>
              <li>• Make sure contact information is up to date</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileManagement;
