// Auth Guard - Checks authentication and provides shared header functionality
// Include this script on all protected pages AFTER api-client.js

(function() {
    'use strict';

    // Check if user is authenticated
    function isAuthenticated() {
        return !!localStorage.getItem('accessToken');
    }

    // Get logged in user info
    function getLoggedInUser() {
        return localStorage.getItem('loggedInUser') || '';
    }

    // Get user type (admin or user)
    function getUserType() {
        return localStorage.getItem('userType') || 'usuario';
    }

    // Redirect to login if not authenticated
    function requireAuth() {
        if (!isAuthenticated()) {
            window.location.href = 'index.html';
            return false;
        }
        return true;
    }

    // Logout function
    function logout() {
        if (typeof apiClient !== 'undefined') {
            apiClient.clearAuth();
        } else {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('loggedInUser');
            localStorage.removeItem('userType');
        }
        window.location.href = 'index.html';
    }

    // Navigate to menu based on user type
    function goToMenu() {
        const userType = getUserType();
        window.location.href = userType === 'administrador' ? 'menu-admin.html' : 'menu-cliente.html';
    }

    // Update clock display
    function updateClock() {
        const dateElem = document.getElementById('header-date');
        const timeElem = document.getElementById('header-time');
        if (!dateElem || !timeElem) return;
        const now = new Date();
        const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
        dateElem.textContent = now.toLocaleDateString('es-ES', dateOptions);
        timeElem.textContent = now.toLocaleTimeString('es-ES', timeOptions);
    }

    // Check server status
    async function checkServerStatus() {
        const indicator = document.getElementById('connectionStatusIndicator');
        const text = document.getElementById('connectionStatusText');
        if (!indicator || !text) return;

        try {
            const baseUrl = typeof apiClient !== 'undefined' ? apiClient.baseUrl : 'https://sushitlalpan-service.up.railway.app';
            const response = await fetch(`${baseUrl}/`, { 
                headers: { 'ngrok-skip-browser-warning': 'true' } 
            });
            if (response.ok) {
                indicator.className = 'status-dot connected';
                text.textContent = 'Servidor Conectado';
            } else {
                throw new Error('Response not ok');
            }
        } catch (error) {
            indicator.className = 'status-dot disconnected';
            text.textContent = 'Servidor Desconectado';
        }
    }

    // Inject the shared header into the page
    function injectHeader() {
        const username = getLoggedInUser();
        const userType = getUserType();
        
        const headerHTML = `
        <div class="app-header" id="appHeader">
            <div class="header-left">
                <button class="menu-btn" onclick="window.authGuard.goToMenu()" title="Ir al Menú">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
                </button>
                <div class="user-info">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                    <span>Usuario: <strong>${username}</strong></span>
                </div>
            </div>
            
            <div class="header-right">
                <div class="time-info">
                    <span id="header-date"></span>
                    <span id="header-time"></span>
                </div>
                <div class="connection-status">
                    <div class="status-dot" id="connectionStatusIndicator"></div>
                    <span id="connectionStatusText">Verificando...</span>
                </div>
                <button class="logout-btn" onclick="window.authGuard.logout()">Cerrar Sesión</button>
            </div>
        </div>
        `;

        // Inject header styles if not already present
        if (!document.getElementById('auth-guard-styles')) {
            const styles = document.createElement('style');
            styles.id = 'auth-guard-styles';
            styles.textContent = `
                .app-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                    color: white;
                    padding: 12px 24px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 9999;
                    min-height: 56px;
                    box-sizing: border-box;
                }
                body {
                    padding-top: 64px !important;
                }
                .app-header .header-left,
                .app-header .header-right {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }
                .app-header .menu-btn {
                    background: rgba(255,255,255,0.1);
                    border: none;
                    color: white;
                    padding: 8px;
                    border-radius: 8px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.2s;
                }
                .app-header .menu-btn:hover {
                    background: rgba(255,255,255,0.2);
                }
                .app-header .user-info {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 14px;
                }
                .app-header .time-info {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    font-size: 12px;
                    opacity: 0.9;
                }
                .app-header .connection-status {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 12px;
                }
                .app-header .status-dot {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: #ffc107;
                }
                .app-header .status-dot.connected {
                    background: #4caf50;
                }
                .app-header .status-dot.disconnected {
                    background: #f44336;
                }
                .app-header .logout-btn {
                    background: #e91e63;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: 500;
                    transition: background 0.2s;
                }
                .app-header .logout-btn:hover {
                    background: #c2185b;
                }
                @media (max-width: 768px) {
                    .app-header {
                        flex-direction: column;
                        gap: 10px;
                        padding: 10px 15px;
                        min-height: auto;
                    }
                    body {
                        padding-top: 100px !important;
                    }
                    .app-header .header-left,
                    .app-header .header-right {
                        width: 100%;
                        justify-content: space-between;
                    }
                    .app-header .time-info {
                        display: none;
                    }
                }
            `;
            document.head.appendChild(styles);
        }

        // Insert header at the beginning of body
        document.body.insertAdjacentHTML('afterbegin', headerHTML);
    }

    // Initialize auth guard
    function init() {
        // Check auth first - redirect if not authenticated
        if (!requireAuth()) {
            return;
        }

        // Inject header
        injectHeader();

        // Start clock
        updateClock();
        setInterval(updateClock, 1000);

        // Check server status
        checkServerStatus();
        setInterval(checkServerStatus, 1800000); // Every 30 minutes
    }

    // Expose functions globally
    window.authGuard = {
        isAuthenticated,
        getLoggedInUser,
        getUserType,
        requireAuth,
        logout,
        goToMenu,
        init
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
