// Nomina CRUD Operations
// Requires apiClient to be available globally

class NominaAPI {
    constructor() {
        this.basePath = '/api/v1';
    }

    // Fetch nomina list with filters
    async getNominaList(skip = 0, filters = {}) {
        const params = new URLSearchParams();
        
        if (skip > 0) params.append('skip', skip);
        if (filters.worker_id) params.append('worker_id', filters.worker_id);
        if (filters.branch_id) params.append('branch_id', filters.branch_id);
        if (filters.payroll_type) params.append('payroll_type', filters.payroll_type);
        if (filters.start_date) params.append('start_date', filters.start_date);
        if (filters.end_date) params.append('end_date', filters.end_date);
        if (filters.order_by) params.append('order_by', filters.order_by);
        
        const queryString = params.toString();
        const url = `${this.basePath}/payroll${queryString ? '?' + queryString : ''}`;
        return await apiClient.get(url);
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