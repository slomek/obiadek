import fetch from 'node-fetch';

const TRELLO_API_BASE = 'https://api.trello.com/1';

function buildTrelloUrl(path: string): string {
  const apiKey = process.env.TRELLO_API_KEY;
  const apiToken = process.env.TRELLO_API_TOKEN;
  return `${TRELLO_API_BASE}${path}?key=${apiKey}&token=${apiToken}`;
}

export async function fetchBoards() {
  const url = buildTrelloUrl('/members/me/boards');
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Trello API error: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchBoardLists(boardId: string) {
  const url = buildTrelloUrl(`/boards/${boardId}/lists`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Trello API error: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchListCards(listId: string) {
  const url = buildTrelloUrl(`/lists/${listId}/cards`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Trello API error: ${response.statusText}`);
  }
  return response.json();
}
