import { Router } from 'express';
import { getBoards, getBoardLists, getListCards, getWeeklyMeals, getGroceryDescription, getMealSources } from '../controllers/trelloController.js';

const router = Router();

router.get('/boards', getBoards);
router.get('/boards/:boardId/lists', getBoardLists);
router.get('/lists/:listId/cards', getListCards);
router.get('/weekly-meals', getWeeklyMeals);
router.get('/grocery-description', getGroceryDescription);
router.get('/meal-sources', getMealSources);

export default router;
