const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./db');
const app = require('./app');

const PORT = process.env.PORT || 5000;

// 🔍 DEBUGGING TEMPORAL - Verificar variables de entorno
console.log('🔍 Variables de entorno:');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ Configurada' : '❌ No configurada');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Configurada' : '❌ No configurada');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);

console.log('🧠 Iniciando servidor...');

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ No se pudo iniciar el servidor:', error);
  }
};

startServer();

