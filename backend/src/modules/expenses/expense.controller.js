import expenseService from './expense.service.js';

export const getExpenses = async (req, res) => {
  const { restaurantId } = req.user;
  const { category, startDate, endDate } = req.query;
  const expenses = await expenseService.getExpenses(restaurantId, { category, startDate, endDate });
  res.json(expenses);
};

export const createExpense = async (req, res) => {
  const { restaurantId } = req.user;
  const expense = await expenseService.createExpense(restaurantId, req.body);
  res.status(201).json(expense);
};

export const updateExpense = async (req, res) => {
  const { restaurantId } = req.user;
  const { id } = req.params;
  const expense = await expenseService.updateExpense(id, restaurantId, req.body);
  res.json(expense);
};

export const deleteExpense = async (req, res) => {
  const { restaurantId } = req.user;
  const { id } = req.params;
  await expenseService.deleteExpense(id, restaurantId);
  res.status(204).end();
};

export const getExpenseStats = async (req, res) => {
  const { restaurantId } = req.user;
  const { days } = req.query;
  const stats = await expenseService.getExpenseStats(restaurantId, parseInt(days) || 30);
  res.json(stats);
};
