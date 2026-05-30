// Nomina CRUD Operations
// Requires apiClient to be available globally

class NominaAPI {
    constructor() {
        this.basePath = '/api/v1';
    }

    // Fetch nomina list with filters
    async getNominaList(skip = 0, filters = {}, limit = null) {
        const params = new URLSearchParams();
        
        if (skip > 0) params.append('skip', skip);
        if (limit !== null) params.append('limit', limit);
        if (filters.worker_id) params.append('worker_id', filters.worker_id);
        if (filters.branch_id) params.append('branch_id', filters.branch_id);
        if (filters.payroll_type) params.append('payroll_type', filters.payroll_type);
        if (filters.start_date) params.append('start_date', filters.start_date);
        if (filters.end_date) params.append('end_date', filters.end_date);
        if (filters.order_by) params.append('order_by', filters.order_by);
        
        const queryString = params.toString();
        const url = `${this.basePath}/payroll?${queryString}`;
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

    // Bulk lock payroll records (superadmin only)
    async bulkLockPayroll(payload) {
        return await apiClient.post(`${this.basePath}/payroll/bulk-lock`, payload);
    }

    // Bulk unlock payroll records (superadmin only)
    async bulkUnlockPayroll(payload) {
        return await apiClient.post(`${this.basePath}/payroll/bulk-unlock`, payload);
    }

    // Update payroll branch (superadmin only)
    async updatePayrollBranch(payrollId, branchId) {
        return await apiClient.patch(`${this.basePath}/payroll/${payrollId}/branch`, { branch_id: branchId });
    }

    // Export payroll to Excel
    async exportPayrollExcel(filters = {}) {
        try {
            const params = new URLSearchParams();
            
            if (filters.worker_id) params.append('worker_id', filters.worker_id);
            if (filters.branch_id) params.append('branch_id', filters.branch_id);
            if (filters.payroll_type) params.append('payroll_type', filters.payroll_type);
            if (filters.start_date) params.append('start_date', filters.start_date);
            if (filters.end_date) params.append('end_date', filters.end_date);
            if (filters.order_by) params.append('order_by', filters.order_by);
            
            const queryString = params.toString();
            const url = `${this.basePath}/payroll/export/excel${queryString ? '?' + queryString : ''}`;
            const blob = await apiClient.downloadFile(url, null);
            
            // Create download link
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `nomina_export_${new Date().toISOString().split('T')[0]}.xlsx`;
            document.body.appendChild(a);
            a.click();
            
            // Cleanup
            window.URL.revokeObjectURL(downloadUrl);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error exporting payroll to Excel:', error);
            throw error;
        }
    }
}

// Create global instance
const nominaAPI = new NominaAPI();
