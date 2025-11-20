// Datos CRUD Operations
// Requires apiClient to be available globally

class DatosAPI {
    constructor() {
        this.basePath = '/api/v1';
    }

    // Fetch general data (ventas, egresos, nomina)
    async getDatosGenerales() {
        return await apiClient.get(`${this.basePath}/datos/generales`);
    }
}

// Create global instance
const datosAPI = new DatosAPI();