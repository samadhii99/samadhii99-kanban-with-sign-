// src/types/kanban.ts
export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  assignee?: string;
  dueDate?: string;
}

// types/kanban.ts
export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  labels?: string[];
  dueDate?: string;
  completed?: boolean;
  assignees?: string[];
  subtasks?: SubTask[];
  createdAt?: number;
  updatedAt?: number;
}

export interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
}

export interface KanbanBoard {
  boards: any;
  columns: KanbanColumn[];
}

export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  labels?: string[];
  dueDate?: string;
  completed?: boolean;
  assignees?: string[];
  createdAt?: number;
  updatedAt?: number;
}

export interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
}

export interface KanbanBoardState {
  columns: KanbanColumn[];
}

// Redux Action payloads
export interface AddColumnPayload {
  title: string;
}

export interface UpdateColumnPayload {
  columnId: string;
  title: string;
}

export interface DeleteColumnPayload {
  columnId: string;
}

export interface AddCardPayload {
  columnId: string;
  title: string;
  description: string;
  labels?: string[];
  dueDate?: string;
  completed?: boolean;
  assignees?: string[];
}

export interface UpdateCardPayload {
  columnId: string;
  cardId: string;
  title: string;
  description: string;
  labels?: string[];
  dueDate?: string;
  completed?: boolean;
  assignees?: string[];
}

export interface DeleteCardPayload {
  columnId: string;
  cardId: string;
}

export interface MoveCardPayload {
  sourceColumnId: string;
  destinationColumnId: string;
  sourceIndex: number;
  destinationIndex: number;
  cardId: string;
}
