const AUTH_API = 'https://planeo-x4hm.onrender.com/api/auth';

// pestañas de login/registro
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// Mostrar sección principal de la app
function mostrarApp() {
  document.getElementById('auth-section').style.display = 'none';
  document.getElementById('app-section').style.display = 'block';
  document.body.classList.remove('auth-mode');

  // Espera un breve momento para asegurar que app.js esté cargado
  setTimeout(() => {
    if (typeof loadTasks === 'function') loadTasks();
    if (typeof loadExpenses === 'function') loadExpenses();
  }, 100); // Espera 100ms (ajustable si fuera necesario)
}

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

    // ✅ Llama a mostrarApp después de guardar el token
    mostrarApp();

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

    // ✅ Mostrar la app directamente tras registro
    mostrarApp();

  } catch (err) {
    alert('❌ ' + err.message);
  }
});


