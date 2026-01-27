// API Client with automatic authentication token handling

class ApiClient {
    constructor() {
        this.baseUrl = this.getApiUrl();
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
        };
    }
    
    getApiUrl() {
        // Constants
        const RAILWAY_API_URL = 'https://sushitlalpan-service.up.railway.app';
        const LOCAL_API_URL = 'http://localhost:8000';
        
        // Environment detection for automatic URL selection
        const hostname = window.location.hostname;
        
        if (hostname === 'sushitlalpan.netlify.app') {
            // Production Netlify deployment
            return RAILWAY_API_URL;
        } else if (hostname.includes('.netlify.app')) {
            // Preview/branch deployments on Netlify
            return RAILWAY_API_URL;
        } else if (hostname === 'localhost' || hostname === '127.0.0.1') {
            // Local development
            return LOCAL_API_URL;
        } else {
            // Default fallback
            console.warn('Unknown environment, using Railway production API');
            return RAILWAY_API_URL;
        }
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

    // Helper to extract detailed error messages from API responses
    extractErrorMessage(errorData) {
        if (errorData.detail && Array.isArray(errorData.detail)) {
            // FastAPI validation errors - format them nicely
            return errorData.detail.map(err => {
                const field = err.loc ? err.loc[err.loc.length - 1] : 'campo';
                const fieldName = field.replace(/_/g, ' ');
                return `${fieldName}: ${err.msg}`;
            }).join('\n');
        } else if (errorData.detail && typeof errorData.detail === 'string') {
            // Simple error message
            return errorData.detail;
        } else if (errorData.message) {
            return errorData.message;
        }
        return 'Error desconocido del servidor';
    }

    // Authenticated GET request
    async get(endpoint, additionalHeaders = {}) {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'GET',
            headers: this.getHeaders(additionalHeaders)
        });
        
        if (response.status === 401 && !this.isLoginEndpoint(endpoint)) {
            // Token expired - redirect to login (but not for login attempts)
            this.handleTokenExpiration();
            return;
        }
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = this.extractErrorMessage(errorData);
            throw new Error(errorMessage);
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
        
        if (response.status === 401 && !this.isLoginEndpoint(endpoint)) {
            // Token expired - redirect to login (but not for login attempts)
            this.handleTokenExpiration();
            return;
        }
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = this.extractErrorMessage(errorData);
            throw new Error(errorMessage);
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
        
        if (response.status === 401 && !this.isLoginEndpoint(endpoint)) {
            // Token expired - redirect to login (but not for login attempts)
            this.handleTokenExpiration();
            return;
        }
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = this.extractErrorMessage(errorData);
            throw new Error(errorMessage);
        }
        
        return await response.json();
    }

    // Authenticated PATCH request with JSON body
    async patch(endpoint, data = null, additionalHeaders = {}) {
        const config = {
            method: 'PATCH',
            headers: this.getHeaders(additionalHeaders)
        };

        if (data !== null) {
            config.body = JSON.stringify(data);
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`, config);
        
        if (response.status === 401 && !this.isLoginEndpoint(endpoint)) {
            // Token expired - redirect to login (but not for login attempts)
            this.handleTokenExpiration();
            return;
        }
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = this.extractErrorMessage(errorData);
            throw new Error(errorMessage);
        }
        
        return await response.json();
    }

    // Authenticated DELETE request
    async delete(endpoint, additionalHeaders = {}) {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'DELETE',
            headers: this.getHeaders(additionalHeaders)
        });
        
        if (response.status === 401 && !this.isLoginEndpoint(endpoint)) {
            // Token expired - redirect to login (but not for login attempts)
            this.handleTokenExpiration();
            return;
        }
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = this.extractErrorMessage(errorData);
            throw new Error(errorMessage);
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
        
        if (response.status === 401 && !this.isLoginEndpoint(endpoint)) {
            // Token expired - redirect to login (but not for login attempts)
            this.handleTokenExpiration();
            return;
        }
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        return await response.blob();
    }

    // Handle token expiration by redirecting to login
    handleTokenExpiration() {
        console.warn('Session token expired. Redirecting to login...');
        this.clearAuth();
        window.location.href = '/index.html';
    }

    // Check if current request is a login attempt
    isLoginEndpoint(endpoint) {
        return endpoint.includes('/login') || endpoint.includes('/auth/login') || endpoint.includes('/authenticate');
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

// Initialize immediately - no longer dependent on env.js
apiClient = new ApiClient();

console.log('ApiClient initialized with URL:', apiClient.baseUrl);