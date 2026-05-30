// Sales CRUD Operations
// Requires apiClient to be available globally

class SalesAPI {
    constructor() {
        this.basePath = '/api/v1';
    }

    // Fetch sales list with filters
    async getSalesList(skip = 0, filters = {}, limit = null) {
        const params = new URLSearchParams();
        
        if (skip > 0) params.append('skip', skip);
        if (limit !== null) params.append('limit', limit);
        if (filters.worker_id) params.append('worker_id', filters.worker_id);
        if (filters.branch_id) params.append('branch_id', filters.branch_id);
        if (filters.start_date) params.append('start_date', filters.start_date);
        if (filters.end_date) params.append('end_date', filters.end_date);
        if (filters.order_by) params.append('order_by', filters.order_by);
        
        const queryString = params.toString();
        const url = `${this.basePath}/sales?${queryString}`;
        return await apiClient.get(url);
    }

    // Download sales data as Excel
    async downloadSales(filteredData) {
        return await apiClient.downloadFile(`${this.basePath}/sales/download`, filteredData);
    }

    // Search sales records with date range
    async searchSales(startDate = null, endDate = null) {
        let url = `${this.basePath}/sales/search`;
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

    // Submit sales data as JSON
    async submitSales(salesData) {
        return await apiClient.post(`${this.basePath}/sales`, salesData);
    }

    // Review sales record
    async reviewSales(saleId, reviewUpdate) {
        return await apiClient.patch(`${this.basePath}/sales/${saleId}/review`, reviewUpdate);
    }

    // Delete sales record
    async deleteSales(saleId) {
        return await apiClient.delete(`${this.basePath}/sales/${saleId}`);
    }

    // Bulk lock sales records (superadmin only)
    async bulkLockSales(payload) {
        return await apiClient.post(`${this.basePath}/sales/bulk-lock`, payload);
    }

    // Bulk unlock sales records (superadmin only)
    async bulkUnlockSales(payload) {
        return await apiClient.post(`${this.basePath}/sales/bulk-unlock`, payload);
    }

    // Update sales branch (superadmin only)
    async updateSalesBranch(salesId, branchId) {
        return await apiClient.patch(`${this.basePath}/sales/${salesId}/branch`, { branch_id: branchId });
    }

    // Export sales to Excel
    async exportSalesExcel(filters = {}) {
        try {
            const params = new URLSearchParams();
            
            if (filters.worker_id) params.append('worker_id', filters.worker_id);
            if (filters.branch_id) params.append('branch_id', filters.branch_id);
            if (filters.start_date) params.append('start_date', filters.start_date);
            if (filters.end_date) params.append('end_date', filters.end_date);
            if (filters.order_by) params.append('order_by', filters.order_by);
            
            const queryString = params.toString();
            const url = `${this.basePath}/sales/export/excel${queryString ? '?' + queryString : ''}`;
            const blob = await apiClient.downloadFile(url, null);
            
            // Create download link
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `ventas_export_${new Date().toISOString().split('T')[0]}.xlsx`;
            document.body.appendChild(a);
            a.click();
            
            // Cleanup
            window.URL.revokeObjectURL(downloadUrl);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error exporting sales to Excel:', error);
            throw error;
        }
    }
}

// Create global instance
const salesAPI = new SalesAPI();
