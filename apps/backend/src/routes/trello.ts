import { Router } from 'express';
import { getBoards, getBoardLists, getListCards, getWeeklyMeals, getGroceryDescription, getMealSources, getMealSourceLists, moveCardToList, moveCardToWeekly } from '../controllers/trelloController.js';

const router = Router();

router.get('/boards', getBoards);
router.get('/boards/:boardId/lists', getBoardLists);
router.get('/lists/:listId/cards', getListCards);
router.get('/weekly-meals', getWeeklyMeals);
router.get('/grocery-description', getGroceryDescription);
router.get('/meal-sources', getMealSources);
router.get('/meal-source-lists', getMealSourceLists);
router.put('/cards/:cardId/move', moveCardToList);
router.put('/cards/:cardId/move-to-weekly', moveCardToWeekly);

export default router;
