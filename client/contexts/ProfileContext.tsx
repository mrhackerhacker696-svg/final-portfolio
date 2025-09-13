import React, { createContext, useContext, useState, useEffect } from "react";
import { dataService } from "../services/dataService";

interface ProfileData {
  profileImage: string;
  logoText: string;
  resumeUrl: string;
  name: string;
  bio: string;
  tagline: string;
  skills: string[];
  experience: string;
  availability: string;
  contactInfo: {
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    website: string;
    twitter: string;
  };
}

interface ProfileContextType {
  profile: ProfileData;
  isLoading: boolean;
  updateProfileImage: (imageUrl: string) => void;
  updateLogo: (logoText: string) => void;
  updateResumeUrl: (resumeUrl: string) => void;
  updateContactInfo: (contactInfo: any) => void;
  updatePersonalInfo: (info: Partial<ProfileData>) => void;
  updateSkills: (skills: string[]) => void;
  updateBio: (bio: string) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData>({
    profileImage: "",
    logoText: "⚡ logo",
    resumeUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    name: "Kanu Prajapati",
    bio: "Passionate full-stack developer with expertise in modern web technologies. I love creating innovative solutions that solve real-world problems and enhance user experiences.",
    tagline: "Building the future, one line of code at a time",
    skills: ["React", "Node.js", "TypeScript", "MongoDB", "Express", "JavaScript", "Python", "AWS"],
    experience: "3+ Years",
    availability: "Available for freelance projects",
    contactInfo: {
      email: "kanuprajapati717@gmail.com",
      phone: "+91 9876543210",
      location: "Gujarat, India",
      linkedin: "https://linkedin.com/in/kanuprajapati",
      github: "https://github.com/kanuprajapati",
      website: "https://kanuprajapati.dev",
      twitter: "https://twitter.com/kanuprajapati",
    },
  });

  // Load profile data on mount
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    let attempt = 0;
    const maxAttempts = 8; // ~2 minutes total with backoff
    const baseDelayMs = 1000;

    async function tryLoad(): Promise<void> {
      try {
        setIsLoading(true);
        const profileData = await dataService.getProfile();
        if (profileData) {
          // Merge loaded data with current profile to preserve structure
          setProfile(prevProfile => {
            const mergedProfile = {
              ...prevProfile, // Keep default structure
              ...profileData, // Override with loaded data
              // Ensure critical arrays exist
              skills: profileData.skills || prevProfile.skills || [],
              contactInfo: {
                ...prevProfile.contactInfo,
                ...(profileData.contactInfo || {})
              }
            };

            // Ensure name field exists, fallback to default if empty
            if (!mergedProfile.name || mergedProfile.name.trim() === "") {
              mergedProfile.name = "Kanu Prajapati";
            }
            // Ensure tagline exists
            if (!mergedProfile.tagline || mergedProfile.tagline.trim() === "") {
              mergedProfile.tagline = "Building the future, one line of code at a time";
            }

            return mergedProfile;
          });
        }
        setIsLoading(false);
      } catch (error) {
        attempt += 1;
        console.error("Error loading profile data (attempt", attempt, "):", error);
        if (attempt < maxAttempts) {
          const delay = baseDelayMs * Math.pow(2, attempt - 1);
          setTimeout(() => {
            void tryLoad();
          }, delay);
        } else {
          setIsLoading(false);
        }
      }
    }

    await tryLoad();
  };

  const saveProfileData = async (updatedProfile: ProfileData) => {
    try {
      await dataService.updateProfile(updatedProfile);
    } catch (error) {
      console.error("Error saving profile data:", error);
    }
  };

  const updateProfileImage = async (imageUrl: string) => {
    const updatedProfile = { ...profile, profileImage: imageUrl };
    setProfile(updatedProfile);
    await saveProfileData(updatedProfile);
  };

  const updateLogo = async (logoText: string) => {
    const updatedProfile = { ...profile, logoText };
    setProfile(updatedProfile);
    await saveProfileData(updatedProfile);
  };

  const updateResumeUrl = async (resumeUrl: string) => {
    const updatedProfile = { ...profile, resumeUrl };
    setProfile(updatedProfile);
    await saveProfileData(updatedProfile);
  };

  const updateContactInfo = async (contactInfo: any) => {
    const updatedProfile = { ...profile, contactInfo };
    setProfile(updatedProfile);
    await saveProfileData(updatedProfile);
  };

  const updatePersonalInfo = async (info: Partial<ProfileData>) => {
    const updatedProfile = { ...profile, ...info };
    setProfile(updatedProfile);
    await saveProfileData(updatedProfile);
  };

  const updateSkills = async (skills: string[]) => {
    const updatedProfile = { ...profile, skills };
    setProfile(updatedProfile);
    await saveProfileData(updatedProfile);
  };

  const updateBio = async (bio: string) => {
    const updatedProfile = { ...profile, bio };
    setProfile(updatedProfile);
    await saveProfileData(updatedProfile);
  };

  const value = {
    profile,
    isLoading,
    updateProfileImage,
    updateLogo,
    updateResumeUrl,
    updateContactInfo,
    updatePersonalInfo,
    updateSkills,
    updateBio,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};
