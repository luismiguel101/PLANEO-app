const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./db');
const app = require('./app');

const PORT = process.env.PORT || 5000;

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

