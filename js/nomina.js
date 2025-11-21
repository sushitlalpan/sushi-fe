// Nomina CRUD Operations
// Requires apiClient to be available globally

class NominaAPI {
    constructor() {
        this.basePath = '/api/v1';
    }

    // Fetch nomina list
    async getNominaList() {
        return await apiClient.get(`${this.basePath}/payroll`);
    }

    // Download nomina data as Excel
    async downloadNomina(filteredData) {
        return await apiClient.downloadFile(`${this.basePath}/payroll/download`, filteredData);
    }

    // Search payroll records with date range
    async searchPayroll(startDate = null, endDate = null) {
        let url = `${this.basePath}/payroll/search`;
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

    // Submit new nomina record
    async submitNomina(nominaData) {
        return await apiClient.post(`${this.basePath}/payroll`, nominaData);
    }
}

// Create global instance
const nominaAPI = new NominaAPI();