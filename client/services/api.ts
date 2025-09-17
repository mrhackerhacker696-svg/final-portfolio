const API_BASE_URL = "/api";

// Generic API call function
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      let errorMessage = `API call failed (${response.status}): ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (parseError) {
        // If we can't parse the error response, use the default message
      }
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error: any) {
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error(
        "Unable to connect to server. Please check if the server is running.",
      );
    }
    throw error;
  }
}

// Profile API
export const profileAPI = {
  get: async () => {
    const res = await apiCall("/profile");
    return res?.data ?? res;
  },
  update: async (data: any) => {
    const res = await apiCall("/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res?.data ?? res;
  },
  updateImage: async (profileImage: string) => {
    const res = await apiCall("/profile/image", {
      method: "PUT",
      body: JSON.stringify({ profileImage }),
    });
    return res?.data ?? res;
  },
  updateLogo: async (logoText: string) => {
    const res = await apiCall("/profile/logo", {
      method: "PUT",
      body: JSON.stringify({ logoText }),
    });
    return res?.data ?? res;
  },
  updateResume: async (resumeUrl: string) => {
    const res = await apiCall("/profile/resume", {
      method: "PUT",
      body: JSON.stringify({ resumeUrl }),
    });
    return res?.data ?? res;
  },
  updateContact: async (contactInfo: any) => {
    const res = await apiCall("/profile/contact", {
      method: "PUT",
      body: JSON.stringify({ contactInfo }),
    });
    return res?.data ?? res;
  },
};

// Projects API
export const projectsAPI = {
  getAll: async () => {
    const res = await apiCall("/projects");
    return res?.data ?? res;
  },
  getById: async (id: string) => {
    const res = await apiCall(`/projects/${id}`);
    return res?.data ?? res;
  },
  create: async (data: any) => {
    const res = await apiCall("/projects", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res?.data ?? res;
  },
  update: async (id: string, data: any) => {
    const res = await apiCall(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res?.data ?? res;
  },
  delete: async (id: string) => {
    const res = await apiCall(`/projects/${id}`, {
      method: "DELETE",
    });
    return res?.data ?? res;
  },
};

// Upload API (JSON base64)
export const uploadAPI = {
  uploadBase64: (payload: { type: 'profile-image' | 'project-image' | 'document'; filename: string; mimeType: string; data: string; }) =>
    apiCall("/upload", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

// Contacts API
export const contactsAPI = {
  getAll: () => apiCall("/contacts"),
  create: (data: any) =>
    apiCall("/contacts", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, status: string) =>
    apiCall(`/contacts/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
  delete: (id: string) =>
    apiCall(`/contacts/${id}`, {
      method: "DELETE",
    }),
};

// Git API
export const gitAPI = {
  get: () => apiCall("/git"),
  update: (data: any) =>
    apiCall("/git", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

// Email API
export const emailAPI = {
  send: (payload: { name: string; email: string; phone?: string; subject?: string; message: string }) =>
    apiCall("/send-email", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

// Migration API
export const migrationAPI = {
  migrate: (localStorageData: any) =>
    apiCall("/migrate/migrate", {
      method: "POST",
      body: JSON.stringify({ localStorageData }),
    }),
  getStatus: () => apiCall("/migrate/status"),
};

// SMS API
export const smsAPI = {
  getNotifications: () => apiCall("/sms/notifications"),
  createNotification: (data: any) =>
    apiCall("/sms/notifications", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  send: (payload: { to: string; message: string; category?: string }) =>
    apiCall("/sms/send", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateNotification: (id: string, data: any) =>
    apiCall(`/sms/notifications/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteNotification: (id: string) =>
    apiCall(`/sms/notifications/${id}`, {
      method: "DELETE",
    }),
  clearNotifications: () =>
    apiCall("/sms/notifications", {
      method: "DELETE",
    }),
  getCategories: () => apiCall("/sms/categories"),
  updateCategories: (categories: string[]) =>
    apiCall("/sms/categories", {
      method: "PUT",
      body: JSON.stringify({ categories }),
    }),
};

// Settings API
export const settingsAPI = {
  get: () => apiCall("/settings"),
  update: (data: any) =>
    apiCall("/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  updateNotifications: (notificationSettings: any) =>
    apiCall("/settings/notifications", {
      method: "PUT",
      body: JSON.stringify({ notificationSettings }),
    }),
  updateSite: (siteSettings: any) =>
    apiCall("/settings/site", {
      method: "PUT",
      body: JSON.stringify({ siteSettings }),
    }),
};

// Activities API
export const activitiesAPI = {
  getAll: () => apiCall("/activities"),
  create: (data: any) =>
    apiCall("/activities", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    apiCall(`/activities/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiCall(`/activities/${id}`, {
      method: "DELETE",
    }),
};

// Skills API
export const skillsAPI = {
  getAll: () => apiCall("/activities/skills"),
  create: (data: any) =>
    apiCall("/activities/skills", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    apiCall(`/activities/skills/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiCall(`/activities/skills/${id}`, {
      method: "DELETE",
    }),
};

// Auth API (for localStorage replacement)
export const authAPI = {
  login: (userData: any) => {
    // This would normally call a real auth endpoint
    // For now, we'll simulate success since the original uses localStorage
    return Promise.resolve({ success: true, user: userData });
  },
  logout: () => {
    return Promise.resolve({ success: true });
  },
  getCurrentUser: () => {
    // In a real app, this would validate a token with the server
    // For now, return null to indicate no user (localStorage mode)
    return Promise.resolve(null);
  },
};
