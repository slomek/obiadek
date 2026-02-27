export interface TrelloBoard {
  id: string;
  name: string;
  desc: string;
  url: string;
}

export interface TrelloList {
  id: string;
  name: string;
  idBoard: string;
  pos: number;
}

export interface TrelloCard {
  id: string;
  name: string;
  desc: string;
  idList: string;
  labels: TrelloLabel[];
  due: string | null;
  url: string;
}

export interface TrelloLabel {
  id: string;
  name: string;
  color: string;
}
