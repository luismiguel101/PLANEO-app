const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Registro de usuario
const registerUser = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Verificar si el usuario ya existe
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: '❌ El usuario ya existe' });
    }

    // Crear un nuevo usuario
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = new User({ email, password: hashedPassword });

    // Guardar el usuario en la base de datos
    await user.save();

    // Crear el token JWT
    const payload = {
      userId: user._id,
    };

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
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: '❌ Usuario o contraseña incorrectos' });
    }

    // Comparar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: '❌ Usuario o contraseña incorrectos' });
    }

    // Crear el token JWT
    const payload = {
      userId: user._id,
    };

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
