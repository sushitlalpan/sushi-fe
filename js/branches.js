// Branches CRUD Operations
// Requires apiClient to be available globally

class BranchesAPI {
    constructor() {
        this.basePath = '/api/v1';
    }

    // Fetch all branches/sucursales
    async getBranches() {
        return await apiClient.get(`${this.basePath}/branches`);
    }

    // Add a new branch
    async addBranch(branchName) {
        return await apiClient.post(`${this.basePath}/branches`, { name: branchName });
    }

    // Delete a branch
    async deleteBranch(branchId) {
        return await apiClient.delete(`${this.basePath}/branches/${branchId}`);
    }
}

// Create global instance
const branchesAPI = new BranchesAPI();