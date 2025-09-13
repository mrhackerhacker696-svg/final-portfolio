import React, { useState, useRef } from "react";
import { Upload, X, Camera, User, Check, AlertCircle } from "lucide-react";
import { useProfile } from "../contexts/ProfileContext";
import { uploadAPI } from "../services/api";

interface ProfilePhotoUploadProps {
  onUploadComplete?: (imageUrl: string) => void;
}

const ProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({
  onUploadComplete,
}) => {
  const { profile, updateProfileImage } = useProfile();
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): string | null => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return "Please upload a valid image file (JPEG, PNG, or WebP)";
    }

    if (file.size > maxSize) {
      return "File size must be less than 5MB";
    }

    return null;
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const validationError = validateFile(file);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // Create a preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

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
        setSuccess(true);
        onUploadComplete?.(res.url);
        setTimeout(() => {
          setSuccess(false);
          setPreviewUrl(null);
        }, 2000);
      } else {
        throw new Error('Upload did not return URL');
      }

    } catch (error) {
      setError("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };


  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    handleFiles(e.target.files);
  };

  const removeCurrentPhoto = () => {
    updateProfileImage("");
    setPreviewUrl(null);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      {/* Current Profile Photo */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <User className="h-10 w-10 text-white" />
              </div>
            )}
          </div>

          {profile.profileImage && (
            <button
              onClick={removeCurrentPhoto}
              className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center justify-center"
              title="Remove photo"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900">Profile Photo</h3>
          <p className="text-sm text-gray-600">
            Upload a high-quality photo that represents you professionally
          </p>

          {profile.profileImage && (
            <button
              onClick={openFileDialog}
              className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Change Photo
            </button>
          )}
        </div>
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
          } ${uploading ? "pointer-events-none opacity-50" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleChange}
          className="hidden"
        />

        {uploading ? (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
              <Upload className="h-8 w-8 text-blue-600 animate-bounce" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">Uploading...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <Camera className="h-8 w-8 text-gray-600" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">
                Drop your photo here, or{" "}
                <button
                  onClick={openFileDialog}
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  browse
                </button>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Supports JPEG, PNG, WebP (max 5MB)
              </p>
            </div>
          </div>
        )}

        {/* Preview */}
        {previewUrl && !success && (
          <div className="mt-4">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-white shadow-lg"
            />
          </div>
        )}
      </div>

      {/* Messages */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
          <p className="text-green-800">Profile photo updated successfully!</p>
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Tips for best results:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use a high-resolution image (at least 400x400 pixels)</li>
          <li>• Ensure good lighting and clear facial features</li>
          <li>• Square aspect ratio works best</li>
          <li>• Professional attire recommended</li>
        </ul>
      </div>
    </div>
  );
};

export default ProfilePhotoUpload;
