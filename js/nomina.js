// Nomina CRUD Operations
// Requires apiClient to be available globally

class NominaAPI {
    constructor() {
        this.basePath = '/api/v1';
    }

    // Fetch nomina list
    async getNominaList(skip = 0) {
        const params = skip > 0 ? `?skip=${skip}` : '';
        return await apiClient.get(`${this.basePath}/payroll${params}`);
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

    // Review payroll record
    async reviewPayroll(payrollId, reviewUpdate) {
        return await apiClient.patch(`${this.basePath}/payroll/${payrollId}/review`, reviewUpdate);
    }

    // Delete payroll record
    async deletePayroll(payrollId) {
        return await apiClient.delete(`${this.basePath}/payroll/${payrollId}`);
    }
}

// Create global instance
const nominaAPI = new NominaAPI();