const express = require('express');
const cors = require('cors');
const app = express();

// Configuración de CORS para desarrollo y producción
const corsOptions = {
  origin: [
    // Producción - Vercel
    'https://planeo-app.vercel.app',
    
    // Desarrollo local - Live Server
    'http://127.0.0.1:5500',
    'http://localhost:5500',
    'http://127.0.0.1:5501',
    'http://localhost:5501',
    'http://127.0.0.1:3000',
    'http://localhost:3000',
    
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};


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
