import { Router } from 'express';
import { getBoards, getBoardLists, getListCards, getWeeklyMeals, getGroceryDescription } from '../controllers/trelloController.js';

const router = Router();

router.get('/boards', getBoards);
router.get('/boards/:boardId/lists', getBoardLists);
router.get('/lists/:listId/cards', getListCards);
router.get('/weekly-meals', getWeeklyMeals);
router.get('/grocery-description', getGroceryDescription);

export default router;
