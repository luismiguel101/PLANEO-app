const Task = require('../models/Task');

// Obtener tareas del usuario autenticado
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: '❌ Error al obtener las tareas', error: error.message });
  }
};

// Crear nueva tarea
const createTask = async (req, res) => {
  try {
    const { title, description = '', priority = 'media' } = req.body;
    const newTask = new Task({
      title,
      description,
      priority,
      user: req.userId
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: '❌ Error al crear la tarea', error: error.message });
  }
};

// Actualizar tarea
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, user: req.userId },
      req.body,
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: '❌ Tarea no encontrada' });
    }
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: '❌ Error al actualizar la tarea', error: error.message });
  }
};

// Eliminar tarea
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findOneAndDelete({ _id: id, user: req.userId });
    if (!deletedTask) {
      return res.status(404).json({ message: '❌ Tarea no encontrada' });
    }
    res.json({ message: '🗑️ Tarea eliminada correctamente' });
  } catch (error) {
    res.status(400).json({ message: '❌ Error al eliminar la tarea', error: error.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
};
