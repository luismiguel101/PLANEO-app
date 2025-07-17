const AUTH_API = 'https://planeo-x4hm.onrender.com/api/auth';

// Mostrar sección principal de la app
function mostrarApp() {
  document.getElementById('auth-section').style.display = 'none';
  document.getElementById('app-section').style.display = 'block';
  document.body.classList.remove('auth-mode');

  // Cargar tareas y gastos solo si las funciones existen
  if (typeof loadTasks === 'function') loadTasks();
  if (typeof loadExpenses === 'function') loadExpenses();
}

document.addEventListener('DOMContentLoaded', () => {
  // Verificar si ya hay token => usuario autenticado
  const token = localStorage.getItem('token');
  if (token) {
    mostrarApp(); // Se ejecuta cuando el DOM ya está cargado
  }

  // pestañas de login/registro
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

      mostrarApp(); // ✅ Llama a mostrarApp tras iniciar sesión

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

      mostrarApp(); // ✅ Mostrar la app directamente tras registro

    } catch (err) {
      alert('❌ ' + err.message);
    }
  });
});



