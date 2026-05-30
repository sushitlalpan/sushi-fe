// Egresos CRUD Operations
// Requires apiClient to be available globally

class EgresosAPI {
    constructor() {
        this.basePath = '/api/v1';
    }

    // Fetch egresos list with filters
    async getEgresosList(skip = 0, filters = {}, limit = null) {
        const params = new URLSearchParams();
        
        if (skip > 0) params.append('skip', skip);
        if (limit !== null) params.append('limit', limit);
        if (filters.worker_id) params.append('worker_id', filters.worker_id);
        if (filters.branch_id) params.append('branch_id', filters.branch_id);
        if (filters.expense_category) params.append('expense_category', filters.expense_category);
        if (filters.start_date) params.append('start_date', filters.start_date);
        if (filters.end_date) params.append('end_date', filters.end_date);
        if (filters.order_by) params.append('order_by', filters.order_by);
        
        const queryString = params.toString();
        const url = `${this.basePath}/expenses?${queryString}`;
        return await apiClient.get(url);
    }

    // Download egresos data as Excel
    async downloadEgresos(filteredData) {
        return await apiClient.downloadFile(`${this.basePath}/expenses/download`, filteredData);
    }

    // Search expense records with date range
    async searchExpenses(startDate = null, endDate = null) {
        let url = `${this.basePath}/expenses/search`;
        const params = new URLSearchParams();
        
        if (startDate) {
            params.append('start_date', startDate);
        }
        if (endDate) {
            params.append('end_date', endDate);
        }
        
        if (params.toString()) {
            url += `?${params.toString()}`;
        }
        
        return await apiClient.get(url);
    }

    // Submit new egreso as JSON
    async submitEgreso(egresoData) {
        return await apiClient.post(`${this.basePath}/expenses`, egresoData);
    }

    // Review expense record
    async reviewExpense(expenseId, reviewUpdate) {
        return await apiClient.patch(`${this.basePath}/expenses/${expenseId}/review`, reviewUpdate);
    }

    // Delete expense record
    async deleteExpense(expenseId) {
        return await apiClient.delete(`${this.basePath}/expenses/${expenseId}`);
    }

    // Bulk lock expense records (superadmin only)
    async bulkLockExpenses(payload) {
        return await apiClient.post(`${this.basePath}/expenses/bulk-lock`, payload);
    }

    // Bulk unlock expense records (superadmin only)
    async bulkUnlockExpenses(payload) {
        return await apiClient.post(`${this.basePath}/expenses/bulk-unlock`, payload);
    }

    // Update expense branch (superadmin only)
    async updateExpenseBranch(expenseId, branchId) {
        return await apiClient.patch(`${this.basePath}/expenses/${expenseId}/branch`, { branch_id: branchId });
    }

    // Export expenses to Excel
    async exportExpensesExcel(filters = {}) {
        try {
            const params = new URLSearchParams();
            
            if (filters.worker_id) params.append('worker_id', filters.worker_id);
            if (filters.branch_id) params.append('branch_id', filters.branch_id);
            if (filters.expense_category) params.append('expense_category', filters.expense_category);
            if (filters.start_date) params.append('start_date', filters.start_date);
            if (filters.end_date) params.append('end_date', filters.end_date);
            if (filters.order_by) params.append('order_by', filters.order_by);
            
            const queryString = params.toString();
            const url = `${this.basePath}/expenses/export/excel${queryString ? '?' + queryString : ''}`;
            const blob = await apiClient.downloadFile(url, null);
            
            // Create download link
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `egresos_export_${new Date().toISOString().split('T')[0]}.xlsx`;
            document.body.appendChild(a);
            a.click();
            
            // Cleanup
            window.URL.revokeObjectURL(downloadUrl);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error exporting expenses to Excel:', error);
            throw error;
        }
    }
}

// Create global instance
const egresosAPI = new EgresosAPI();
