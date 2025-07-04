const Expense = require('../models/expense');

// Obtener gastos del usuario autenticado
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: '❌ Error al obtener los gastos', error: error.message });
  }
};

// Crear nuevo gasto
const createExpense = async (req, res) => {
  try {
    const { description, amount, category = 'otros' } = req.body;
    const newExpense = new Expense({
      description,
      amount,
      category,
      user: req.userId
    });
    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(400).json({ message: '❌ Error al crear el gasto', error: error.message });
  }
};

// Eliminar gasto
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedExpense = await Expense.findOneAndDelete({ _id: id, user: req.userId });
    if (!deletedExpense) {
      return res.status(404).json({ message: '❌ Gasto no encontrado' });
    }
    res.json({ message: '🗑️ Gasto eliminado correctamente' });
  } catch (error) {
    res.status(400).json({ message: '❌ Error al eliminar el gasto', error: error.message });
  }
};

module.exports = {
  getExpenses,
  createExpense,
  deleteExpense
};
