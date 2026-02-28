const API_URL = 'https://football-mf27.onrender.com/api';

document.addEventListener('DOMContentLoaded', () => {
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
            const res = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
            loginError.innerText = 'Server error. Try again later.';
            submitBtn.disabled = false;
            submitBtn.innerText = originalBtnText;
            console.error(err);
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
            const res = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
            regError.innerText = 'Server error. Try again later.';
            submitBtn.disabled = false;
            submitBtn.innerText = originalBtnText;
            console.error(err);
        }
    });
});
