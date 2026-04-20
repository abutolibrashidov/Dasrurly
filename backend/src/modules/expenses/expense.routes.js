import express from 'express';
import * as expenseController from './expense.controller.js';

const router = express.Router();

router.get('/', expenseController.getExpenses);
router.post('/', expenseController.createExpense);
router.put('/:id', expenseController.updateExpense);
router.delete('/:id', expenseController.deleteExpense);
router.get('/stats', expenseController.getExpenseStats);

export default router;
