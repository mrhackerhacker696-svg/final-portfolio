import {
  profileAPI,
  projectsAPI,
  contactsAPI,
  smsAPI,
  settingsAPI,
  activitiesAPI,
  skillsAPI,
  migrationAPI,
  gitAPI,
} from "./api";

// Always use MongoDB/server APIs only
async function ensureServerAvailable(): Promise<void> {
  // Extend retry window to better handle server/Mongo restarts
  const maxRetries = 8; // ~0.5s + 1s + 2s + 4s + 8s + 16s + 32s + 64s ≈ 128s total
  const baseDelayMs = 500;
  let lastError: any;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch("/api/health", { cache: "no-store" });
      const data = await response.json();
      const status = typeof data.mongodb === "string" ? data.mongodb : data.mongodb?.status;
      if (status === "connected") return;
      lastError = new Error(`MongoDB status: ${status ?? "unknown"}`);
    } catch (e) {
      lastError = e;
    }
    // exponential backoff
    const delay = baseDelayMs * Math.pow(2, attempt);
    await new Promise((r) => setTimeout(r, delay));
  }
  throw new Error("MongoDB not connected. Please configure MONGODB_URI and start MongoDB.");
}

// Unified Data Service
export class DataService {
  private static instance: DataService;
  private serverChecked = false;

  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  private async ensureServer(): Promise<void> {
    if (!this.serverChecked) {
      await ensureServerAvailable();
      this.serverChecked = true;
    }
  }

  // Profile Data
  async getProfile(): Promise<any> {
    await this.ensureServer();
    return await profileAPI.get();
  }

  async updateProfile(data: any): Promise<any> {
    await this.ensureServer();
    return await profileAPI.update(data);
  }

  // Projects Data
  async getProjects(): Promise<any[]> {
    await this.ensureServer();
    return await projectsAPI.getAll();
  }

  async createProject(data: any): Promise<any> {
    await this.ensureServer();
    return await projectsAPI.create(data);
  }

  async updateProject(id: string, data: any): Promise<any> {
    await this.ensureServer();
    return await projectsAPI.update(id, data);
  }

  async deleteProject(id: string): Promise<void> {
    await this.ensureServer();
    await projectsAPI.delete(id);
  }

  // Contact Messages
  async getContactMessages(): Promise<any[]> {
    await this.ensureServer();
    return await contactsAPI.getAll();
  }

  async createContactMessage(data: any): Promise<any> {
    await this.ensureServer();
    return await contactsAPI.create(data);
  }

  async updateContactMessage(id: string, status: string): Promise<any> {
    await this.ensureServer();
    return await contactsAPI.update(id, status);
  }

  async deleteContactMessage(id: string): Promise<void> {
    await this.ensureServer();
    await contactsAPI.delete(id);
  }

  // SMS Notifications
  async getSMSNotifications(): Promise<any[]> {
    await this.ensureServer();
    return await smsAPI.getNotifications();
  }

  async createSMSNotification(data: any): Promise<any> {
    await this.ensureServer();
    return await smsAPI.createNotification(data);
  }

  async deleteSMSNotification(id: string): Promise<void> {
    await this.ensureServer();
    await smsAPI.deleteNotification(id);
  }

  async updateSMSNotification(id: string, data: any): Promise<any> {
    await this.ensureServer();
    return await smsAPI.updateNotification(id, data);
  }

  async clearSMSNotifications(): Promise<void> {
    await this.ensureServer();
    await smsAPI.clearNotifications();
  }

  // SMS Categories
  async getSMSCategories(): Promise<string[]> {
    await this.ensureServer();
    return await smsAPI.getCategories();
  }

  async updateSMSCategories(categories: string[]): Promise<string[]> {
    await this.ensureServer();
    return await smsAPI.updateCategories(categories);
  }

  // Git Settings
  async getGitSettings(): Promise<any> {
    await this.ensureServer();
    return await gitAPI.get();
  }

  async updateGitSettings(data: any): Promise<any> {
    await this.ensureServer();
    return await gitAPI.update(data);
  }

  // User Settings
  async getSettings(): Promise<any> {
    await this.ensureServer();
    return await settingsAPI.get();
  }

  async updateSettings(data: any): Promise<any> {
    await this.ensureServer();
    return await settingsAPI.update(data);
  }

  async updateSiteSettings(siteSettings: any): Promise<any> {
    await this.ensureServer();
    return await settingsAPI.updateSite(siteSettings);
  }

  // Activities
  async getActivities(): Promise<any[]> {
    await this.ensureServer();
    return await activitiesAPI.getAll();
  }

  async createActivity(data: any): Promise<any> {
    await this.ensureServer();
    return await activitiesAPI.create(data);
  }

  async updateActivity(id: string, data: any): Promise<any> {
    await this.ensureServer();
    return await activitiesAPI.update(id, data);
  }

  async deleteActivity(id: string): Promise<void> {
    await this.ensureServer();
    await activitiesAPI.delete(id);
  }

  // Skills
  async getSkills(): Promise<any[]> {
    await this.ensureServer();
    return await skillsAPI.getAll();
  }

  async createSkill(data: any): Promise<any> {
    await this.ensureServer();
    return await skillsAPI.create(data);
  }

  async updateSkill(id: string, data: any): Promise<any> {
    await this.ensureServer();
    return await skillsAPI.update(id, data);
  }

  async deleteSkill(id: string): Promise<void> {
    await this.ensureServer();
    await skillsAPI.delete(id);
  }

  // Migration
  async migrateData(): Promise<any> {
    // No-op in Mongo-only mode; keep endpoint for backward compat if needed
    await this.ensureServer();
    return { success: true, message: "Mongo-only mode; nothing to migrate." };
  }

  async getMigrationStatus(): Promise<any> {
    await this.ensureServer();
    return { migrated: true, mongodbAvailable: true };
  }

  // Check if running in MongoDB mode
  async isUsingMongoDB(): Promise<boolean> {
    await this.ensureServer();
    return true;
  }
}

// Export singleton instance
export const dataService = DataService.getInstance();
