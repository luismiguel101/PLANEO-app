const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Registro de usuario
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: '❌ El usuario ya existe' });
    }

    user = new User({ username, email, password });
    await user.save();

    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: '❌ Error al registrar el usuario', error: error.message });
  }
};

// Login de usuario
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
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

    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: '❌ Error al iniciar sesión', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};