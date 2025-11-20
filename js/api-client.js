// API Client with automatic authentication token handling
// Requires window.env.API_URL to be defined

class ApiClient {
    constructor() {
        this.baseUrl = `${window.env.API_URL}`;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
        };
    }

    // Get the auth token from sessionStorage
    getAuthToken() {
        return sessionStorage.getItem('accessToken');
    }

    // Set the auth token in sessionStorage
    setAuthToken(token) {
        if (token) {
            sessionStorage.setItem('accessToken', token);
        } else {
            sessionStorage.removeItem('accessToken');
        }
    }

    // Get headers with authentication if token exists
    getHeaders(additionalHeaders = {}) {
        const headers = { ...this.defaultHeaders, ...additionalHeaders };
        
        const token = this.getAuthToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        return headers;
    }

    // Authenticated GET request
    async get(endpoint, additionalHeaders = {}) {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'GET',
            headers: this.getHeaders(additionalHeaders)
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        return await response.json();
    }

    // Authenticated POST request with JSON body
    async post(endpoint, data = null, additionalHeaders = {}) {
        const config = {
            method: 'POST',
            headers: this.getHeaders(additionalHeaders)
        };

        if (data !== null) {
            config.body = JSON.stringify(data);
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`, config);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        return await response.json();
    }

    // Authenticated PUT request with JSON body
    async put(endpoint, data = null, additionalHeaders = {}) {
        const config = {
            method: 'PUT',
            headers: this.getHeaders(additionalHeaders)
        };

        if (data !== null) {
            config.body = JSON.stringify(data);
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`, config);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        return await response.json();
    }

    // Authenticated DELETE request
    async delete(endpoint, additionalHeaders = {}) {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'DELETE',
            headers: this.getHeaders(additionalHeaders)
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        return await response.json();
    }

    // Special method for file downloads that returns blob
    async downloadFile(endpoint, data = null, additionalHeaders = {}) {
        const config = {
            method: data ? 'POST' : 'GET',
            headers: this.getHeaders(additionalHeaders)
        };

        if (data !== null) {
            config.body = JSON.stringify(data);
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`, config);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        return await response.blob();
    }

    // Clear all authentication data (for logout)
    clearAuth() {
        this.setAuthToken(null);
        sessionStorage.removeItem('loggedInUser');
        sessionStorage.removeItem('userType');
    }
}

// Create global instance
const apiClient = new ApiClient();