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

export async function getMealSources(_req: Request, res: Response) {
  const rawIds = process.env.TRELLO_MEAL_SOURCE_LIST_IDS;
  if (!rawIds) {
    res.status(500).json({ error: 'TRELLO_MEAL_SOURCE_LIST_IDS is not configured' });
    return;
  }
  const listIds = rawIds.split(',').map((id) => id.trim()).filter(Boolean);
  try {
    const results = await Promise.all(
      listIds.map(async (listId) => {
        const [list, cards] = await Promise.all([
          trelloService.fetchList(listId) as Promise<{ id: string; name: string }>,
          trelloService.fetchListCards(listId) as Promise<{ id: string; name: string; desc: string; idList: string; labels: unknown[]; due: string | null; url: string }[]>,
        ]);
        return cards.map((card) => ({ ...card, listName: list.name }));
      }),
    );
    res.json(results.flat());
  } catch (error) {
    console.error('Error fetching meal sources:', error);
    res.status(500).json({ error: 'Failed to fetch meal sources' });
  }
}

export async function getGroceryDescription(_req: Request, res: Response) {
  const cardId = process.env.TRELLO_GROCERIES_CARD_ID;
  if (!cardId) {
    res.status(500).json({ error: 'TRELLO_GROCERIES_CARD_ID is not configured' });
    return;
  }
  try {
    const card = await trelloService.fetchCard(cardId);
    res.json({ description: (card as { desc: string }).desc });
  } catch (error) {
    console.error('Error fetching grocery card:', error);
    res.status(500).json({ error: 'Failed to fetch grocery description' });
  }
}
