// Egresos CRUD Operations
// Requires apiClient to be available globally

class EgresosAPI {
    constructor() {
        this.basePath = '/api/v1';
    }

    // Fetch egresos list
    async getEgresosList() {
        return await apiClient.get(`${this.basePath}/egresos/list`);
    }

    // Download egresos data as Excel
    async downloadEgresos(filteredData) {
        return await apiClient.downloadFile(`${this.basePath}/egresos/download`, filteredData);
    }

    // Submit new egreso (note: this uses FormData, so we need special handling)
    async submitEgreso(formData) {
        // For FormData, we need to use fetch directly with multipart/form-data
        const token = apiClient.getAuthToken();
        const headers = {
            'ngrok-skip-browser-warning': 'true'
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch(`${apiClient.baseUrl}${this.basePath}/egresos`, {
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
const egresosAPI = new EgresosAPI();