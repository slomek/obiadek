import { Request, Response } from 'express';
import * as trelloService from '../services/trelloService.js';

export async function getBoards(_req: Request, res: Response) {
  try {
    const boards = await trelloService.fetchBoards();
    res.json(boards);
  } catch (error) {
    console.error('Error fetching boards:', error);
    res.status(500).json({ error: 'Failed to fetch boards' });
  }
}

export async function getBoardLists(req: Request, res: Response) {
  try {
    const { boardId } = req.params;
    const lists = await trelloService.fetchBoardLists(boardId);
    res.json(lists);
  } catch (error) {
    console.error('Error fetching lists:', error);
    res.status(500).json({ error: 'Failed to fetch lists' });
  }
}

export async function getListCards(req: Request, res: Response) {
  try {
    const { listId } = req.params;
    const cards = await trelloService.fetchListCards(listId);
    res.json(cards);
  } catch (error) {
    console.error('Error fetching cards:', error);
    res.status(500).json({ error: 'Failed to fetch cards' });
  }
}

export async function getWeeklyMeals(_req: Request, res: Response) {
  const listId = process.env.TRELLO_WEEKLY_LIST_ID;
  if (!listId) {
    res.status(500).json({ error: 'TRELLO_WEEKLY_LIST_ID is not configured' });
    return;
  }
  try {
    const cards = await trelloService.fetchListCards(listId);
    res.json(cards);
  } catch (error) {
    console.error('Error fetching weekly meals:', error);
    res.status(500).json({ error: 'Failed to fetch weekly meals' });
  }
}
