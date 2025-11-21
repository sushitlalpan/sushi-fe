// Sales CRUD Operations
// Requires apiClient to be available globally

class SalesAPI {
    constructor() {
        this.basePath = '/api/v1';
    }

    // Fetch sales list
    async getSalesList() {
        return await apiClient.get(`${this.basePath}/sales`);
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
}

// Create global instance
const salesAPI = new SalesAPI();