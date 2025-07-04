const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getExpenses, 
    createExpense,
     deleteExpense }
 = require('../controllers/expenseController');

router.get('/', auth, getExpenses);
router.post('/', auth, createExpense);
router.delete('/:id', auth, deleteExpense);

module.exports = router;

