import { TrelloCard } from './trello.js';

export interface Dinner extends TrelloCard {
  cookingTime?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  ingredients?: string[];
}

export interface DinnerSelection {
  dinner: Dinner;
  selectedDate: Date;
  notes?: string;
}
