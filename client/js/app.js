const getApiUrl = () => {
    const hostname = window.location.hostname;
    const isLocal =
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname === '' ||
        hostname.startsWith('192.168.') ||
        hostname.startsWith('10.') ||
        hostname.startsWith('172.') ||
        window.location.protocol === 'file:';

    return isLocal ? 'http://127.0.0.1:5000/api' : 'https://football-mf27.onrender.com/api';
};

const API_URL = getApiUrl();
const API_BASE = API_URL.replace('/api', '');

console.log('🚀 FCMS Client Started. API Path:', API_URL);

// Global Fetch Wrapper for consistent error handling and performance
async function apiFetch(endpoint, options = {}) {
    const defaultHeaders = {
        'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : ''
    };

    if (!(options.body instanceof FormData)) {
        defaultHeaders['Content-Type'] = 'application/json';
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers
            }
        });

        if (response.status === 401) {
            // Handle expired token
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (!window.location.pathname.endsWith('index.html')) {
                window.location.href = 'index.html';
            }
        }

        if (!response.ok) {
            const errBody = await response.clone().text();
            console.error('Fetch error response:', errBody);
            throw new Error(`Server error (${response.status}).`);
        }

        return response;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Pre-warm the server immediately on load
    fetch(API_BASE).catch(() => { });

    const modal = document.getElementById('authModal');
    const loginBtn = document.getElementById('loginBtn');
    const closeBtn = document.getElementById('closeModal');
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    const loginError = document.getElementById('loginError');
    const regError = document.getElementById('regError');

    // Toggle Modal
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('show');
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });

    // Toggle Tabs
    tabLogin.addEventListener('click', () => {
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        loginError.innerText = '';
        regError.innerText = '';
    });

    tabRegister.addEventListener('click', () => {
        tabRegister.classList.add('active');
        tabLogin.classList.remove('active');
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
        loginError.innerText = '';
        regError.innerText = '';
    });

    // Handle Login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const isAdmin = document.getElementById('loginIsAdmin').checked;
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerText;

        const endpoint = isAdmin ? '/auth/admin/login' : '/auth/login';

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
        loginError.innerText = '';

        try {
            const res = await apiFetch(endpoint, {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data));
                window.location.href = 'dashboard.html';
            } else {
                loginError.innerText = data.message || 'Login failed';
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
            }
        } catch (err) {
            loginError.innerText = err.message;
            submitBtn.disabled = false;
            submitBtn.innerText = originalBtnText;
        }
    });

    // Handle Register
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('regUsername').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const isAdmin = document.getElementById('regIsAdmin').checked;
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerText;

        const endpoint = isAdmin ? '/auth/admin/register' : '/auth/register';

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
        regError.innerText = '';

        try {
            const res = await apiFetch(endpoint, {
                method: 'POST',
                body: JSON.stringify({ username, email, password })
            });
            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data));
                window.location.href = 'dashboard.html';
            } else {
                regError.innerText = data.message || 'Registration failed';
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
            }
        } catch (err) {
            regError.innerText = err.message;
            submitBtn.disabled = false;
            submitBtn.innerText = originalBtnText;
        }
    });
});
