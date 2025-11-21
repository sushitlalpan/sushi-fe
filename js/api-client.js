// API Client with automatic authentication token handling
// Requires window.env.API_URL to be defined

class ApiClient {
    constructor() {
        this.baseUrl = this.getApiUrl();
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
        };
    }
    
    getApiUrl() {
        // Wait for window.env to be available or provide fallback
        if (window.env && window.env.API_URL) {
            return window.env.API_URL;
        }
        // Fallback for development
        console.warn('window.env.API_URL not found, using fallback');
        return 'http://localhost:8000';
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

// Create global instance with delayed initialization
let apiClient;

// Initialize API client when DOM is ready and env is loaded
function initializeApiClient() {
    if (!apiClient) {
        apiClient = new ApiClient();
    }
    return apiClient;
}

// Ensure apiClient is always available when accessed
Object.defineProperty(window, 'apiClient', {
    get: function() {
        if (!apiClient) {
            apiClient = new ApiClient();
        }
        return apiClient;
    },
    configurable: true
});

// Try to initialize immediately if env is available
if (window.env && window.env.API_URL) {
    apiClient = new ApiClient();
} else {
    // Wait for DOM load to ensure env.js has loaded
    document.addEventListener('DOMContentLoaded', function() {
        if (!apiClient) {
            apiClient = new ApiClient();
        }
    });
}