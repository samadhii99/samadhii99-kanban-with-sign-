import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { KanbanCard, KanbanColumn, SubTask } from "../types/kanban";

interface KanbanBoard {
  columns: KanbanColumn[];
}

interface KanbanState {
  boards: {
    [projectId: string]: KanbanBoard;
  };
}

const initialState: KanbanState = {
  boards: {},
};

// Payload interfaces
interface InitializeBoardPayload {
  projectId: string;
  columns: { title: string; cards: any[] }[];
}

interface AddColumnPayload {
  projectId: string;
  title: string;
}

interface UpdateColumnPayload {
  projectId: string;
  columnId: string;
  title: string;
}

interface DeleteColumnPayload {
  projectId: string;
  columnId: string;
}

interface AddCardPayload {
  projectId: string;
  columnId: string;
  title: string;
  description: string;
  labels?: string[];
  dueDate?: string;
  completed?: boolean;
  assignees?: string[];
  subtasks?: SubTask[];
}

interface UpdateCardPayload {
  projectId: string;
  columnId: string;
  cardId: string;
  title?: string;
  description?: string;
  labels?: string[];
  dueDate?: string;
  completed?: boolean;
  assignees?: string[];
  subtasks?: SubTask[];
}

interface DeleteCardPayload {
  projectId: string;
  columnId: string;
  cardId: string;
}

interface MoveCardPayload {
  projectId: string;
  sourceColumnId: string;
  destinationColumnId: string;
  sourceIndex: number;
  destinationIndex: number;
  cardId: string;
}

interface AddSubtaskPayload {
  projectId: string;
  columnId: string;
  cardId: string;
  subtask: SubTask;
}

const kanbanSlice = createSlice({
  name: "kanban",
  initialState,
  reducers: {
    // Initialize a board for a project
    initializeBoard: (state, action: PayloadAction<InitializeBoardPayload>) => {
      const { projectId, columns } = action.payload;

      // Check if board already exists
      if (!state.boards[projectId]) {
        // Create new board with columns
        state.boards[projectId] = {
          columns: columns.map((column) => ({
            id: `column-${uuidv4()}`,
            title: column.title,
            cards: [],
          })),
        };
      }
    },

    // Add a new column to a project's board
    addColumn: (state, action: PayloadAction<AddColumnPayload>) => {
      const { projectId, title } = action.payload;

      // Create board if it doesn't exist
      if (!state.boards[projectId]) {
        state.boards[projectId] = { columns: [] };
      }

      state.boards[projectId].columns.push({
        id: `column-${uuidv4()}`,
        title,
        cards: [],
      });
    },

    // Update a column's title
    updateColumn: (state, action: PayloadAction<UpdateColumnPayload>) => {
      const { projectId, columnId, title } = action.payload;

      const board = state.boards[projectId];
      if (!board) return;

      const column = board.columns.find((col) => col.id === columnId);
      if (column) {
        column.title = title;
      }
    },

    // Delete a column
    deleteColumn: (state, action: PayloadAction<DeleteColumnPayload>) => {
      const { projectId, columnId } = action.payload;

      const board = state.boards[projectId];
      if (!board) return;

      board.columns = board.columns.filter((col) => col.id !== columnId);
    },

    // Add a card to a column
    addCard: (state, action: PayloadAction<AddCardPayload>) => {
      const {
        projectId,
        columnId,
        title,
        description,
        labels = [],
        dueDate,
        completed = false,
        assignees = [],
        subtasks = [],
      } = action.payload;

      const board = state.boards[projectId];
      if (!board) return;

      const columnIndex = board.columns.findIndex((col) => col.id === columnId);
      if (columnIndex === -1) return;

      const newCard: KanbanCard = {
        id: `card-${uuidv4()}`,
        title,
        description,
        labels,
        dueDate,
        completed,
        assignees,
        subtasks,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      board.columns[columnIndex].cards.push(newCard);
    },

    // Update a card
    updateCard: (state, action: PayloadAction<UpdateCardPayload>) => {
      const {
        projectId,
        columnId,
        cardId,
        title,
        description,
        labels,
        dueDate,
        completed,
        assignees,
        subtasks,
      } = action.payload;

      const board = state.boards[projectId];
      if (!board) return;

      const columnIndex = board.columns.findIndex((col) => col.id === columnId);
      if (columnIndex === -1) return;

      const cardIndex = board.columns[columnIndex].cards.findIndex(
        (card) => card.id === cardId
      );

      if (cardIndex !== -1) {
        const card = board.columns[columnIndex].cards[cardIndex];

        board.columns[columnIndex].cards[cardIndex] = {
          ...card,
          title: title !== undefined ? title : card.title,
          description:
            description !== undefined ? description : card.description,
          labels: labels !== undefined ? labels : card.labels,
          dueDate: dueDate !== undefined ? dueDate : card.dueDate,
          completed: completed !== undefined ? completed : card.completed,
          assignees: assignees !== undefined ? assignees : card.assignees,
          subtasks: subtasks !== undefined ? subtasks : card.subtasks,
          updatedAt: Date.now(),
        };
      }
    },

    // Delete a card
    deleteCard: (state, action: PayloadAction<DeleteCardPayload>) => {
      const { projectId, columnId, cardId } = action.payload;

      const board = state.boards[projectId];
      if (!board) return;

      const columnIndex = board.columns.findIndex((col) => col.id === columnId);
      if (columnIndex === -1) return;

      board.columns[columnIndex].cards = board.columns[
        columnIndex
      ].cards.filter((card) => card.id !== cardId);
    },

    // Move a card between columns or within the same column
    moveCard: (state, action: PayloadAction<MoveCardPayload>) => {
      const {
        projectId,
        sourceColumnId,
        destinationColumnId,
        sourceIndex,
        destinationIndex,
        cardId,
      } = action.payload;

      const board = state.boards[projectId];
      if (!board) return;

      const sourceColumnIndex = board.columns.findIndex(
        (col) => col.id === sourceColumnId
      );
      const destinationColumnIndex = board.columns.findIndex(
        (col) => col.id === destinationColumnId
      );

      if (sourceColumnIndex === -1 || destinationColumnIndex === -1) return;

      // Don't proceed if no actual change
      if (
        sourceColumnId === destinationColumnId &&
        sourceIndex === destinationIndex
      )
        return;

      // Create a deep copy of the card to move
      const cardToMove = JSON.parse(
        JSON.stringify(board.columns[sourceColumnIndex].cards[sourceIndex])
      );

      // Verify we found the right card
      if (cardToMove.id !== cardId) return;

      // Remove from source
      board.columns[sourceColumnIndex].cards.splice(sourceIndex, 1);

      // Add to destination - adjust index if same column and removing affects the destination index
      let adjustedDestIndex = destinationIndex;
      if (
        sourceColumnId === destinationColumnId &&
        sourceIndex < destinationIndex
      ) {
        adjustedDestIndex--;
      }

      // Add to destination at the adjusted index
      board.columns[destinationColumnIndex].cards.splice(
        adjustedDestIndex,
        0,
        cardToMove
      );
    },

    // Add a subtask to a card
    addSubtask: (state, action: PayloadAction<AddSubtaskPayload>) => {
      const { projectId, columnId, cardId, subtask } = action.payload;

      const board = state.boards[projectId];
      if (!board) return;

      const columnIndex = board.columns.findIndex((col) => col.id === columnId);
      if (columnIndex === -1) return;

      const cardIndex = board.columns[columnIndex].cards.findIndex(
        (card) => card.id === cardId
      );

      if (cardIndex !== -1) {
        const card = board.columns[columnIndex].cards[cardIndex];
        if (!card.subtasks) {
          card.subtasks = [];
        }
        card.subtasks.push(subtask);
        card.updatedAt = Date.now();
      }
    },
  },
});

export const {
  initializeBoard,
  addColumn,
  updateColumn,
  deleteColumn,
  addCard,
  updateCard,
  deleteCard,
  moveCard,
  addSubtask,
} = kanbanSlice.actions;

export default kanbanSlice.reducer;
