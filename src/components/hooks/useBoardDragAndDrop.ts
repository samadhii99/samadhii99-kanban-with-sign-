import { useState } from "react";
import { Dispatch } from "redux";
import { KanbanColumn, KanbanCard } from "../../types/kanban";
import { moveCard } from "../../store/kanbanSlice";
import {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  UniqueIdentifier,
} from "@dnd-kit/core";

export const useBoardDragAndDrop = (
  columns: KanbanColumn[],
  dispatch: Dispatch
) => {
  const [activeItem, setActiveItem] = useState<{
    id: string;
    type: "card" | "column";
    card?: KanbanCard;
    columnId?: string;
  } | null>(null);

  // Configure sensors for better drag and drop experience
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const { id } = active;

    // Determine if dragging a card or column
    if (active.data.current?.type === "card") {
      const columnId = active.data.current.columnId;
      const columnIndex = columns.findIndex((col) => col.id === columnId);
      if (columnIndex !== -1) {
        const cardIndex = columns[columnIndex].cards.findIndex(
          (card: { id: UniqueIdentifier; }) => card.id === id
        );
        if (cardIndex !== -1) {
          setActiveItem({
            id: id as string,
            type: "card",
            card: columns[columnIndex].cards[cardIndex],
            columnId,
          });
        }
      }
    } else if (active.data.current?.type === "column") {
      setActiveItem({
        id: id as string,
        type: "column",
      });
    }
  };

  const handleDragOver = (_event: DragOverEvent) => {
    // This is only needed for complex drag behaviors like card-to-new-column
    // Leave empty for now as we'll handle movement in dragEnd
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveItem(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Do nothing if dropped on itself
    if (activeId === overId) {
      setActiveItem(null);
      return;
    }

    // Handle card movement
    if (active.data.current?.type === "card") {
      const activeColumnId = active.data.current.columnId;
      const activeIndex =
        columns
          .find((col) => col.id === activeColumnId)
          ?.cards.findIndex((card: { id: string; }) => card.id === activeId) || 0;

      let overColumnId = activeColumnId;
      let overIndex = 0;

      // Find the drop target
      if (over.data.current?.type === "card") {
        // Dropped on another card
        overColumnId = over.data.current.columnId;
        overIndex =
          columns
            .find((col) => col.id === overColumnId)
            ?.cards.findIndex((card: { id: string; }) => card.id === overId) || 0;
      } else if (over.data.current?.type === "column") {
        // Dropped directly on a column
        overColumnId = overId;
        // Place at the end of the column
        overIndex =
          columns.find((col) => col.id === overColumnId)?.cards.length || 0;
      }

      // Only dispatch if there's an actual change
      if (activeColumnId !== overColumnId || activeIndex !== overIndex) {
        dispatch(
          moveCard({
              sourceColumnId: activeColumnId,
              destinationColumnId: overColumnId,
              sourceIndex: activeIndex,
              destinationIndex: overIndex,
              cardId: activeId,
              projectId: ""
          })
        );
      }
    }

    // Reset active item
    setActiveItem(null);
  };

  return {
    activeItem,
    sensors,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
};
