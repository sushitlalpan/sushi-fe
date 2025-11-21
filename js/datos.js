// Datos CRUD Operations
// Requires apiClient to be available globally

class DatosAPI {
    constructor() {
        this.basePath = '/api/v1';
    }

    // Fetch general data (ventas, egresos, nomina)
    async getDatosGenerales(startDate = null, endDate = null) {
        let url = `${this.basePath}/general/combined-data`;
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
}

// Create global instance
const datosAPI = new DatosAPI();