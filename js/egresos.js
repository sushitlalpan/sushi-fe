// Egresos CRUD Operations
// Requires apiClient to be available globally

class EgresosAPI {
    constructor() {
        this.basePath = '/api/v1';
    }

    // Fetch egresos list
    async getEgresosList() {
        return await apiClient.get(`${this.basePath}/expenses`);
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
}

// Create global instance
const egresosAPI = new EgresosAPI();