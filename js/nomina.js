// Nomina CRUD Operations
// Requires apiClient to be available globally

class NominaAPI {
    constructor() {
        this.basePath = '/api/v1';
    }

    // Fetch nomina list
    async getNominaList() {
        return await apiClient.get(`${this.basePath}/nomina/list`);
    }

    // Download nomina data as Excel
    async downloadNomina(filteredData) {
        return await apiClient.downloadFile(`${this.basePath}/nomina/download`, filteredData);
    }

    // Submit new nomina record (note: this uses FormData, so we need special handling)
    async submitNomina(formData) {
        // For FormData, we need to use fetch directly with multipart/form-data
        const token = apiClient.getAuthToken();
        const headers = {
            'ngrok-skip-browser-warning': 'true'
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch(`${apiClient.baseUrl}${this.basePath}/nomina`, {
            method: 'POST',
            body: formData,
            headers: headers
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        return await response.json();
    }
}

// Create global instance
const nominaAPI = new NominaAPI();