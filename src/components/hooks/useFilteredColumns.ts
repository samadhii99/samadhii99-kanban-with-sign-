import { useMemo } from "react";
import { KanbanColumn, KanbanCard } from "../../types/kanban";

export const useFilteredColumns = (
  columns: KanbanColumn[],
  sortBy: string | null,
  priorityFilter: string[],
  labelFilter: string[],
  memberFilter: string[]
) => {
  return useMemo(() => {
    return columns.map((column) => {
      // Filter cards based on current filter criteria
      const filteredCards = column.cards.filter((card: KanbanCard) => {
        // Priority filter
        if (priorityFilter.length > 0) {
          const cardPriorities = card.labels?.filter(label => 
            label.includes("Priority")) || [];

          if (
            !cardPriorities.some(priority =>
              priorityFilter.includes(priority)
            )
          ) {
            return false;
          }
        }

        // Label filter
        if (labelFilter.length > 0) {
          if (
            !card.labels ||
            !card.labels.some(label => labelFilter.includes(label))
          ) {
            return false;
          }
        }

        // Member filter
        if (memberFilter.length > 0) {
          if (
            !card.assignees ||
            !card.assignees.some(member => memberFilter.includes(member))
          ) {
            return false;
          }
        }

        return true;
      });

      // Sort cards if sortBy is specified
      let sortedCards = [...filteredCards];

      if (sortBy) {
        sortedCards.sort((a, b) => {
          switch (sortBy) {
            case "title":
              return (a.title || "").localeCompare(b.title || "");
            case "priority":
              const getPriorityValue = (card: KanbanCard): number => {
                if (card.labels?.includes("High Priority")) return 3;
                if (card.labels?.includes("Medium Priority")) return 2;
                if (card.labels?.includes("Low Priority")) return 1;
                return 0;
              };
              return getPriorityValue(b) - getPriorityValue(a);
            case "dueDate":
              // Handle nullable dates properly
              const aDate = a.dueDate
                ? new Date(a.dueDate).getTime()
                : Number(Infinity);
              const bDate = b.dueDate
                ? new Date(b.dueDate).getTime()
                : Number(Infinity);
              return aDate - bDate;
            case "createdDate":
              return (a.createdAt || 0) - (b.createdAt || 0);
            case "updatedDate":
              return (a.updatedAt || 0) - (b.updatedAt || 0);
            default:
              return 0;
          }
        });
      }

      // Return a new column object with filtered cards
      return {
        ...column,
        cards: sortedCards,
      };
    });
  }, [columns, sortBy, priorityFilter, labelFilter, memberFilter]);
};