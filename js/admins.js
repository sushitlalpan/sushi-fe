// Admin CRUD Operations
// Requires apiClient to be available globally

class AdminAPI {
    constructor() {
        this.basePath = '/api/v1';
    }

    // Fetch all admins
    async getAdmins() {
        return await apiClient.get(`${this.basePath}/admins`);
    }

    // Fetch admins with their passwords
    async getAdminsWithPasswords() {
        try {
            const result = await apiClient.get(`${this.basePath}/admins-with-passwords`);
            return result.admins || {};
        } catch (error) {
            console.error('Error al cargar contraseñas de admins:', error);
            return {};
        }
    }

    // Add a new admin
    async addAdmin(username, password) {
        return await apiClient.post(`${this.basePath}/add-admin`, { username, password });
    }

    // Delete an admin
    async deleteAdmin(username) {
        return await apiClient.post(`${this.basePath}/delete-admin`, { username });
    }

    // Admin login (no auth token needed for login)
    async adminLogin(username, password) {
        return await apiClient.post(`${this.basePath}/auth/admin/login`, { username, password });
    }
}

// Create global instance
const adminAPI = new AdminAPI();