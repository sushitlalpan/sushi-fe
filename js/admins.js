// Admin CRUD Operations
// Requires apiClient to be available globally

class AdminAPI {
    constructor() {
        this.basePath = '/api/v1';
    }

    // Fetch all admins
    async getAdmins() {
        return await apiClient.get(`${this.basePath}/admin`);
    }

    // Delete an admin
    async deleteAdmin(adminId) {
        return await apiClient.delete(`${this.basePath}/admin/${adminId}`);
    }

    // Add a new admin
    async addAdmin(username, password) {
        return await apiClient.post(`${this.basePath}/auth/admin/register`, { username, password });
    }

    // Admin login (no auth token needed for login)
    async adminLogin(username, password) {
        return await apiClient.post(`${this.basePath}/auth/admin/login`, { username, password });
    }
}

// Create global instance
const adminAPI = new AdminAPI();