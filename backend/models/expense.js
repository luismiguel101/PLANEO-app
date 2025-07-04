const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    enum: ['comida', 'transporte', 'hogar', 'entretenimiento', 'salud', 'otros'],
    default: 'otros'
  },
  createdAt: { 
    type: Date,
    default: Date.now
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
});

module.exports = mongoose.model('Expense', expenseSchema);


