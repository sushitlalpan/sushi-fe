// Users CRUD Operations
// Requires apiClient to be available globally

class UsersAPI {
    constructor() {
        this.basePath = '/api/v1';
    }

    // Get logged in user info
    async getLoggedInUser() {
        return await apiClient.get(`${this.basePath}/users/me`);
    }

    // Fetch all users/operators
    async getUsers() {
        return await apiClient.get(`${this.basePath}/users`);
    }

    // Delete user
    async deleteUser(userId) {
        return await apiClient.delete(`${this.basePath}/users/${userId}`);
    }

    // Add new user
    async addUser(username, password, branchId, phoneNumber) {
        return await apiClient.post(`${this.basePath}/auth/user/register`,
            {
                username,
                password,
                branch_id: branchId,
                phone_number: phoneNumber
            }
        );
    }

    // User login (no auth token needed for login)
    async login(username, password) {
        return await apiClient.post(`${this.basePath}/auth/user/login`, { username, password });
    }
}

// Create global instance
const usersAPI = new UsersAPI();