const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Registro de usuario
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    console.log('Registro recibido:', req.body);

    // Verificar si el usuario ya existe
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: '❌ El usuario ya existe' });
    }

    // Crear nuevo usuario
    user = new User({ username, email, password });
    await user.save();

    // Generar token JWT
    const payload = { userId: user._id };
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
  expiresIn: '7d',
});


    res.status(201).json({ token });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: '❌ Error al registrar el usuario', error: error.message });
  }
};

// Login de usuario
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Login recibido:', req.body);

    // Verificar si el usuario existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: '❌ Usuario o contraseña incorrectos' });
    }

    // Usar el método del modelo para comparar contraseñas
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: '❌ Usuario o contraseña incorrectos' });
    }

    // Generar token JWT
    const payload = { userId: user._id };
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
  expiresIn: '7d',
});


    res.json({ token });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: '❌ Error al iniciar sesión', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};