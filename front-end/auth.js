

const AUTH_API = 'https://planeo-x4hm.onrender.com/api/auth';

// Mostrar sección principal de la app con loader
function mostrarApp() {
  const authSection = document.getElementById('auth-section');
  const appSection = document.getElementById('app-section');
  const loader = document.getElementById('loader');

  // Ocultar auth y mostrar loader
  authSection.style.display = 'none';
  loader.style.display = 'flex';
  appSection.style.display = 'none';
  document.body.classList.remove('auth-mode');

  // Inicializar la app después de mostrar el loader
  setTimeout(() => {
    if (window.initDashboard && typeof window.initDashboard === 'function') {
      window.initDashboard();
    }
  }, 100);
}

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  
  // Si ya hay token, no mostrar loader aún, se manejará en app.js
  if (token) {
    document.getElementById('auth-section').style.display = 'none';
    document.body.classList.remove('auth-mode');
    return;
  }

  // pestañas de login / registro
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');
    });
  });

  // Login
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
      alert('Por favor, completa todos los campos');
      return;
    }

    try {
      const res = await fetch(`${AUTH_API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al iniciar sesión');

      localStorage.setItem('token', data.token);
      mostrarApp(); // ✅ Muestra loader y carga datos

    } catch (err) {
      alert('❌ ' + err.message);
    }
  });

  // Registro
  document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('register-username').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;

    if (!username || !email || !password) {
      alert('Por favor, completa todos los campos');
      return;
    }

    try {
      const res = await fetch(`${AUTH_API}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al registrarse');

      localStorage.setItem('token', data.token);
      mostrarApp(); // ✅ Muestra loader y carga datos

    } catch (err) {
      alert('❌ ' + err.message);
    }
  });
});