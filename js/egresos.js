// Egresos CRUD Operations
// Requires apiClient to be available globally

class EgresosAPI {
    constructor() {
        this.basePath = '/api/v1';
    }

    // Fetch egresos list with filters
    async getEgresosList(skip = 0, filters = {}) {
        const params = new URLSearchParams();
        
        if (skip > 0) params.append('skip', skip);
        if (filters.worker_id) params.append('worker_id', filters.worker_id);
        if (filters.branch_id) params.append('branch_id', filters.branch_id);
        if (filters.expense_category) params.append('expense_category', filters.expense_category);
        if (filters.start_date) params.append('start_date', filters.start_date);
        if (filters.end_date) params.append('end_date', filters.end_date);
        if (filters.order_by) params.append('order_by', filters.order_by);
        
        const queryString = params.toString();
        const url = `${this.basePath}/expenses${queryString ? '?' + queryString : ''}`;
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
}

// Create global instance
const egresosAPI = new EgresosAPI();