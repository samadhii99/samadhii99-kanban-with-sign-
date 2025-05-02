import React from "react";
import { KanbanCard, SubTask } from "../types/kanban";
import Column from "./Column";
import KanbanCardComponent from "./KanbanCard";
import {
  DndContext,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SensorDescriptor, SensorOptions } from "@dnd-kit/core";


export interface BoardContentProps {
  filteredColumns: {
    id: string;
    title: string;
    cards: KanbanCard[];
  }[];
  sensors: SensorDescriptor<SensorOptions>[];
  activeItem: {
    id: string;
    type: "card" | "column";
    card?: KanbanCard;
    columnId?: string;
  } | null;
  handleDragStart: (event: any) => void;
  handleDragOver: (event: any) => void;
  handleDragEnd: (event: any) => void;
  handleAddCard: (
    columnId: string,
    title: string,
    description: string,
    labels?: string[],
    dueDate?: string,
    completed?: boolean,
    assignees?: string[],
    subtasks?: SubTask[]
  ) => void;
  handleEditCard: (
    columnId: string,
    cardId: string,
    title: string,
    description: string,
    labels?: string[],
    dueDate?: string,
    completed?: boolean,
    assignees?: string[],
    subtasks?: SubTask[]
  ) => void;
  handleDeleteCard: (columnId: string, cardId: string) => void;
  handleUpdateColumn: (columnId: string, title: string) => void;
  handleDeleteColumn: (columnId: string) => void;
  handleUpdateCard: (columnId: string, updatedCard: KanbanCard) => void;
  handleCardClick: () => void;
  // Add this line if you want to keep the handleAddSubtask functionality
  handleAddSubtask?: (columnId: string, cardId: string, subtask: SubTask) => void;
}

const BoardContent: React.FC<BoardContentProps> = ({
  filteredColumns,
  sensors,
  activeItem,
  handleDragStart,
  handleDragOver,
  handleDragEnd,
  handleAddCard,
  handleEditCard,
  handleDeleteCard,
  handleUpdateColumn,
  handleDeleteColumn,
  handleUpdateCard,
  handleCardClick,
}) => {
  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div
        className="kanban-board"
        style={{
          width: "100%",
          overflowX: "auto",
          height: "calc(100% - 120px)",
          padding: "16px 0",
          display: "flex",
        }}
      >
        <SortableContext
          items={filteredColumns.map((col) => col.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div
            className="columns-container"
            style={{
              display: "flex",
              flexWrap: "nowrap",
              height: "100%",
              paddingRight: "16px",
            }}
          >
            {filteredColumns.map((column) => (
              <div
                key={column.id}
                className="column-wrapper"
                style={{
                  height: "100%",
                  margin: "0 8px",
                  minWidth: "360px",
                }}
              >
                <Column
                  column={column}
                  onAddCard={handleAddCard}
                  onEditCard={handleEditCard}
                  onDeleteCard={handleDeleteCard}
                  onEditColumn={handleUpdateColumn}
                  onDeleteColumn={handleDeleteColumn}
                  onUpdateCard={handleUpdateCard}
                />
              </div>
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeItem && activeItem.type === "card" && activeItem.card && (
            <div style={{ width: "300px", opacity: 0.8 }}>
              <KanbanCardComponent
                card={activeItem.card}
                onClick={handleCardClick}
                onUpdateCard={(updatedCard: KanbanCard) => {
                  // This is just a placeholder for the drag overlay
                  // We don't actually update the card in the overlay
                  console.log("Attempted to update card in overlay", updatedCard);
                }}
              />
            </div>
          )}
        </DragOverlay>
      </div>
    </DndContext>
  );
};

export default BoardContent;