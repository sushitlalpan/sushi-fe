// Egresos CRUD Operations
// Requires apiClient to be available globally

class EgresosAPI {
    constructor() {
        this.basePath = '/api/v1';
    }

    // Fetch egresos list
    async getEgresosList(skip = 0) {
        const params = skip > 0 ? `?skip=${skip}` : '';
        return await apiClient.get(`${this.basePath}/expenses${params}`);
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