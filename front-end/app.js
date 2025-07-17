const API = 'https://planeo-x4hm.onrender.com/api/tasks';
const EXPENSE_API = 'https://planeo-x4hm.onrender.com/api/expenses';

// === Protección anticipada: evitar que se vea el dashboard sin token ===
const token = localStorage.getItem('token');

// Redirige visualmente según estado de autenticación incluso antes del DOMContentLoaded
if (!token) {
  document.addEventListener('DOMContentLoaded', () => {
    const authSection = document.getElementById('auth-section');
    const appSection = document.getElementById('app-section');
    authSection.style.display = 'block';
    appSection.style.display = 'none';
    document.body.classList.add('auth-mode');
  });
} else {
  document.addEventListener('DOMContentLoaded', () => {
    const authSection = document.getElementById('auth-section');
    const appSection = document.getElementById('app-section');
    authSection.style.display = 'none';
    appSection.style.display = 'block';
    document.body.classList.remove('auth-mode');

    // === HEADERS PARA AUTORIZACIÓN JWT ===
    const authHeaders = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    };

    // === BOTÓN DE CERRAR SESIÓN ===
    const logoutBtn = document.getElementById('logout-btn');
    const logoutTab = document.getElementById('logout-tab');
    const logoutDropdown = document.getElementById('logout-dropdown');

    if (logoutTab && logoutDropdown) {
  logoutTab.addEventListener('click', () => {
    logoutDropdown.classList.toggle('hidden');
  });

  // Opcional: cerrar el dropdown si haces clic fuera
  document.addEventListener('click', (e) => {
    if (!logoutTab.contains(e.target) && !logoutDropdown.contains(e.target)) {
      logoutDropdown.classList.add('hidden');
    }
  });
}

    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.reload(); // Recarga para mostrar login
      });
    }

    // === ELEMENTOS DE LA APP ===
    const titleInput = document.getElementById('task-title');
    const priorityInput = document.getElementById('task-priority');
    const addTaskBtn = document.getElementById('add-task');
    const taskListContainer = document.getElementById('task-list');
    const taskCounter = document.getElementById('task-counter');
    const notification = document.getElementById('notification');
    const expenseDesc = document.getElementById('expense-description');
    const expenseAmount = document.getElementById('expense-amount');
    const expenseCategory = document.getElementById('expense-category');
    const addExpenseBtn = document.getElementById('add-expense');
    const expenseList = document.getElementById('expense-list');
    const incomeInput = document.getElementById('monthly-income');
    const balanceDisplay = document.getElementById('dashboard-balance');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    // === PESTAÑAS ===
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(tab => tab.classList.remove('active'));
        button.classList.add('active');
        const tabId = button.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
      });
    });

    // === CARGAR TAREAS ===
    async function loadTasks() {
      try {
        const res = await fetch(API, { headers: authHeaders });
        if (res.status === 401) throw new Error('Token inválido');
        const tasks = await res.json();
        taskListContainer.innerHTML = '';
        let total = 0;
        let highPriority = 0;

        tasks.forEach(task => {
          if (!task.completed) total++;
          if (!task.completed && task.priority === 'alta') highPriority++;

          const item = document.createElement('div');
          item.className = `item ${task.completed ? 'completed' : ''}`;
          item.innerHTML = `
            <div class="item-content">
              <div class="item-checkbox ${task.completed ? 'checked' : ''}" data-id="${task._id}">
                ${task.completed ? '✓' : ''}
              </div>
              <div class="item-info ${task.completed ? 'completed' : ''}">
                <h4>${task.title}</h4>
                <div class="item-meta">
                  <span class="priority-badge priority-${task.priority}">${task.priority}</span>
                  <span class="date-badge">📅 ${new Date(task.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div class="item-actions">
              <button class="btn-icon-only btn-delete" data-id="${task._id}">🗑️</button>
            </div>
          `;
          taskListContainer.appendChild(item);
        });

        taskCounter.textContent = total;
        showNotification(total, highPriority);
      } catch (err) {
        console.error('❌ Error al cargar tareas:', err);
        if (err.message.includes('Token')) {
          localStorage.removeItem('token');
          window.location.reload();
        }
      }
    }

    function showNotification(total, highPriority) {
      if (total === 0) return notification.style.display = 'none';
      notification.style.display = 'block';
      notification.innerHTML = `🔔 Tienes <strong>${total}</strong> tareas pendientes (${highPriority} de alta prioridad)`;
    }

    // === AGREGAR TAREA ===
    addTaskBtn.addEventListener('click', async () => {
      const title = titleInput.value.trim();
      const priority = priorityInput.value;
      if (!title) return alert('El título es obligatorio');

      try {
        await fetch(API, {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify({ title, priority })
        });
        titleInput.value = '';
        priorityInput.value = 'media';
        await loadTasks();
      } catch (err) {
        console.error('❌ Error al agregar tarea:', err);
      }
    });

    taskListContainer.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      if (!id) return;

      try {
        if (e.target.classList.contains('btn-delete')) {
          await fetch(`${API}/${id}`, {
            method: 'DELETE',
            headers: authHeaders
          });
        } else if (e.target.classList.contains('item-checkbox')) {
          const res = await fetch(API, { headers: authHeaders });
          const tasks = await res.json();
          const task = tasks.find(t => t._id === id);
          await fetch(`${API}/${id}`, {
            method: 'PUT',
            headers: authHeaders,
            body: JSON.stringify({ completed: !task.completed })
          });
        }
        await loadTasks();
      } catch (err) {
        console.error('❌ Error al modificar tarea:', err);
      }
    });

    // === CARGAR GASTOS ===
    async function loadExpenses() {
      try {
        const res = await fetch(EXPENSE_API, { headers: authHeaders });
        if (res.status === 401) throw new Error('Token inválido');
        const expenses = await res.json();
        expenseList.innerHTML = '';
        let total = 0;

        expenses.forEach(exp => {
          total += exp.amount;
          const item = document.createElement('div');
          item.className = 'item expense-item';
          item.innerHTML = `
            <div class="expense-info">
              <div class="expense-icon">💵</div>
              <div class="expense-details">
                <h4>${exp.description}</h4>
                <div class="expense-meta">${exp.category} • ${new Date(exp.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 1rem;">
              <span class="expense-amount">-S/ ${exp.amount.toFixed(2)}</span>
              <button class="btn-icon-only btn-delete" data-id="${exp._id}">🗑️</button>
            </div>
          `;
          expenseList.appendChild(item);
        });

        updateBalanceDisplay(total);
        document.getElementById('dashboard-expenses').textContent = `S/ ${total.toFixed(2)}`;
      } catch (err) {
        console.error('❌ Error al cargar gastos:', err);
        if (err.message.includes('Token')) {
          localStorage.removeItem('token');
          window.location.reload();
        }
      }
    }

    function updateBalanceDisplay(totalExpenses) {
      const income = parseFloat(incomeInput.value) || 0;
      const balance = income - totalExpenses;
      balanceDisplay.textContent = `S/ ${balance.toFixed(2)}`;
    }

    addExpenseBtn.addEventListener('click', async () => {
      const description = expenseDesc.value.trim();
      const amount = parseFloat(expenseAmount.value);
      const category = expenseCategory.value;

      if (!description || isNaN(amount) || amount <= 0) {
        return alert('Completa todos los campos correctamente');
      }

      try {
        await fetch(EXPENSE_API, {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify({ description, amount, category })
        });

        expenseDesc.value = '';
        expenseAmount.value = '';
        expenseCategory.value = 'otros';
        await loadExpenses();
      } catch (err) {
        console.error('❌ Error al agregar gasto:', err);
      }
    });

    expenseList.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      if (!id) return;

      try {
        await fetch(`${EXPENSE_API}/${id}`, {
          method: 'DELETE',
          headers: authHeaders
        });
        await loadExpenses();
      } catch (err) {
        console.error('❌ Error al eliminar gasto:', err);
      }
    });

    incomeInput.addEventListener('input', () => loadExpenses());

    // === INICIO ===
    loadTasks();
    loadExpenses();
  });
}

