const express = require('express');
const cors = require('cors');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {   //DEBUGGING TEMPORAL
  console.log(`📨 ${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Body:', req.body);
  next();
});

// Rutas
const taskRoutes = require('./routes/tasks');
const expenseRoutes = require('./routes/expenses');
const authRoutes = require('./routes/auth'); // Ruta de autenticación

// Usar rutas
app.use('/api/tasks', taskRoutes);       // Rutas protegidas por JWT
app.use('/api/expenses', expenseRoutes); // Rutas protegidas por JWT
app.use('/api/auth', authRoutes);        // Rutas públicas de login y registro

module.exports = app;
