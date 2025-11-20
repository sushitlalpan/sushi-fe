// Users CRUD Operations
// Requires apiClient to be available globally

class UsersAPI {
    constructor() {
        this.basePath = '/api/v1';
    }

    // Fetch all users/operators
    async getUsers() {
        return await apiClient.get(`${this.basePath}/users`);
    }

    // User login (no auth token needed for login)
    async login(username, password) {
        return await apiClient.post(`${this.basePath}/login`, { username, password });
    }

    // Get users with passwords
    async getUsersWithPasswords() {
        return await apiClient.get(`${this.basePath}/users-with-passwords`);
    }

    // Add new user
    async addUser(username, password) {
        return await apiClient.post(`${this.basePath}/add-user`, { username, password });
    }

    // Delete user
    async deleteUser(username) {
        return await apiClient.post(`${this.basePath}/delete-user`, { username });
    }
}

// Create global instance
const usersAPI = new UsersAPI();