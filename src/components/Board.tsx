import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "antd";
import { PlusOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { RootState } from "../store";
import { Project } from "../types/Project"; // We need this for the Project type

// Import custom components
import BoardContent from "./BoardContent";
import FilterBar from "./FilterBar";
import AddColumnModal from "./AddColumnModal";

// Import types
import { KanbanCard, SubTask } from "../types/kanban";

// Import actions
import {
  addColumn,
  updateColumn,
  deleteColumn,
  addCard,
  updateCard,
  deleteCard,
  moveCard,
  initializeBoard,
} from "../store/kanbanSlice";

// Import custom hooks
import {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";

const Board: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get the columns for the current project
  const allBoards = useSelector((state: RootState) => state.kanban.boards);
  const currentBoard = allBoards[projectId || ""] || { columns: [] };
  const columns = currentBoard.columns;

  // States
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");

  // Since there's no projects slice in the store yet, we'll use a safer approach
  // We'll get project data from props or local storage as a fallback
  // You'll need to implement the actual data access based on your application structure
  const [projectData, setProjectData] = useState<Project | null>(null);

  // Fetch project data effect
  useEffect(() => {
    // This is where you would normally fetch the project data
    // For now, we'll create a placeholder project
    if (projectId) {
      // Try to get from localStorage as fallback
      const storedProjects = localStorage.getItem("projects");
      let foundProject: Project | null = null;

      if (storedProjects) {
        try {
          const parsedProjects = JSON.parse(storedProjects);
          foundProject = parsedProjects.find(
            (p: Project) => p.id === projectId
          );
        } catch (error) {
          console.error("Error parsing stored projects:", error);
        }
      }

      // If we found a project in localStorage, use it
      if (foundProject) {
        setProjectData(foundProject);
      } else {
        // Otherwise create a placeholder project
        setProjectData({
          id: projectId,
          name: `Project-${projectId}`,
          client: "",
          category: "",
          status: "Active",
          progress: 0,
          lastUpdated: new Date().toISOString(),
          members: [],
          isFavorite: false,
          isArchived: false,
        });
      }
    }
  }, [projectId]);

  // Initialize board flag
  const isInitialized = useRef(false);

  // Filter states
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  const [labelFilter, setLabelFilter] = useState<string[]>([]);
  const [memberFilter, setMemberFilter] = useState<string[]>([]);

  // Configure sensors for better drag and drop experience
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Active drag item state
  const [activeItem, setActiveItem] = useState<{
    id: string;
    type: "card" | "column";
    card?: KanbanCard;
    columnId?: string;
  } | null>(null);

  // Load initial data
  useEffect(() => {
    if (projectId && columns.length === 0 && !isInitialized.current) {
      isInitialized.current = true;
      dispatch(
        initializeBoard({
          projectId,
          columns: [
            { title: "To Do", cards: [] },
            { title: "In Progress", cards: [] },
            { title: "Done", cards: [] },
          ],
        })
      );
    }
  }, [dispatch, projectId, columns.length]);

  // Navigation handler
  const handleBackToProjects = () => {
    navigate("/");
  };

  // Get all available labels from cards
  const getAllLabels = (): string[] => {
    const labelsSet = new Set<string>();

    columns.forEach((column) => {
      column.cards.forEach((card) => {
        card.labels?.forEach((label) => {
          labelsSet.add(label);
        });
      });
    });

    return Array.from(labelsSet);
  };

  // Get all available members from cards
  const getAllMembers = (): string[] => {
    const membersSet = new Set<string>();

    columns.forEach((column) => {
      column.cards.forEach((card) => {
        card.assignees?.forEach((assignee) => {
          membersSet.add(assignee);
        });
      });
    });

    return Array.from(membersSet);
  };

  // Get filtered columns based on current filters
  const getFilteredColumns = () => {
    return columns.map((column) => {
      // Filter cards based on current filter criteria
      const filteredCards = column.cards.filter((card) => {
        // Priority filter
        if (priorityFilter.length > 0) {
          const cardPriorities =
            card.labels?.filter((label) => label.includes("Priority")) || [];

          if (
            !cardPriorities.some((priority) =>
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
            !card.labels.some((label) => labelFilter.includes(label))
          ) {
            return false;
          }
        }

        // Member filter
        if (memberFilter.length > 0) {
          if (
            !card.assignees ||
            !card.assignees.some((member) => memberFilter.includes(member))
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
  };

  // Column handlers
  const handleAddColumn = () => {
    if (newColumnTitle.trim() && projectId) {
      dispatch(addColumn({ projectId, title: newColumnTitle.trim() }));
      setNewColumnTitle("");
      setIsModalVisible(false);
    }
  };

  const handleUpdateColumn = (columnId: string, title: string) => {
    if (projectId) {
      dispatch(updateColumn({ projectId, columnId, title }));
    }
  };

  const handleDeleteColumn = (columnId: string) => {
    if (projectId) {
      dispatch(deleteColumn({ projectId, columnId }));
    }
  };

  // Card handlers
  const handleAddCard = (
    columnId: string,
    title: string,
    description: string,
    labels?: string[],
    dueDate?: string,
    completed?: boolean,
    assignees?: string[],
    subtasks?: SubTask[]
  ) => {
    if (projectId) {
      dispatch(
        addCard({
          projectId,
          columnId,
          title,
          description,
          labels: labels || [],
          dueDate,
          completed: completed || false,
          assignees: assignees || [],
          subtasks: subtasks || [],
        })
      );
    }
  };

  const handleEditCard = (
    columnId: string,
    cardId: string,
    title: string,
    description: string,
    labels?: string[],
    dueDate?: string,
    completed?: boolean,
    assignees?: string[],
    subtasks?: SubTask[]
  ) => {
    if (projectId) {
      dispatch(
        updateCard({
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
        })
      );
    }
  };

  const handleDeleteCard = (columnId: string, cardId: string) => {
    if (projectId) {
      dispatch(deleteCard({ projectId, columnId, cardId }));
    }
  };

  const handleUpdateCard = (columnId: string, updatedCard: KanbanCard) => {
    if (projectId) {
      dispatch(
        updateCard({
          projectId,
          columnId,
          cardId: updatedCard.id,
          title: updatedCard.title,
          description: updatedCard.description,
          labels: updatedCard.labels,
          dueDate: updatedCard.dueDate,
          completed: updatedCard.completed,
          assignees: updatedCard.assignees,
          subtasks: updatedCard.subtasks,
        })
      );
    }
  };

  // Placeholder for card click in drag overlay
  const handleCardClick = () => {
    // This is just a placeholder function as the dragged card isn't interactive
  };

  // DnD handlers
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const { id } = active;

    // Determine if dragging a card or column
    if (active.data.current?.type === "card") {
      const columnId = active.data.current.columnId;
      const columnIndex = columns.findIndex((col) => col.id === columnId);
      if (columnIndex !== -1) {
        const cardIndex = columns[columnIndex].cards.findIndex(
          (card) => card.id === id
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
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !projectId) {
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
          ?.cards.findIndex((card) => card.id === activeId) || 0;

      let overColumnId = activeColumnId;
      let overIndex = 0;

      // Find the drop target
      if (over.data.current?.type === "card") {
        // Dropped on another card
        overColumnId = over.data.current.columnId;
        overIndex =
          columns
            .find((col) => col.id === overColumnId)
            ?.cards.findIndex((card) => card.id === overId) || 0;
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
            projectId,
            sourceColumnId: activeColumnId,
            destinationColumnId: overColumnId,
            sourceIndex: activeIndex,
            destinationIndex: overIndex,
            cardId: activeId,
          })
        );
      }
    }

    // Reset active item
    setActiveItem(null);
  };

  // Handle filter changes
  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const handlePriorityFilter = (priorities: string[]) => {
    setPriorityFilter(priorities);
  };

  const handleLabelFilter = (labels: string[]) => {
    setLabelFilter(labels);
  };

  const handleMemberFilter = (members: string[]) => {
    setMemberFilter(members);
  };

  const handleGroupByChange = (_value: string) => {
    // Implementation for group by logic would go here
  };

  // Get filtered columns based on current filters
  const filteredColumns = getFilteredColumns();

  // If no project ID, show error
  if (!projectId) {
    return <div>Error: No project ID specified</div>;
  }

  // Determine project name from our state
  const projectName = projectData
    ? projectData.name || `Project-${projectId}`
    : `Project-${projectId}`;

  return (
    <>
      <div className="board-header">
        <div className="board-title">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={handleBackToProjects}
            className="back-button"
          >
            {/* Display project name from the Redux store */}
            <h2>{projectName}</h2>
          </Button>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Add Column
        </Button>
      </div>

      <FilterBar
        onSortChange={handleSortChange}
        onPriorityFilter={handlePriorityFilter}
        onLabelFilter={handleLabelFilter}
        onMemberFilter={handleMemberFilter}
        onGroupByChange={handleGroupByChange}
        availableLabels={getAllLabels()}
        availableMembers={getAllMembers()}
      />

      <BoardContent
        filteredColumns={filteredColumns}
        sensors={sensors}
        activeItem={activeItem}
        handleDragStart={handleDragStart}
        handleDragOver={handleDragOver}
        handleDragEnd={handleDragEnd}
        handleAddCard={handleAddCard}
        handleEditCard={handleEditCard}
        handleDeleteCard={handleDeleteCard}
        handleUpdateColumn={handleUpdateColumn}
        handleDeleteColumn={handleDeleteColumn}
        handleUpdateCard={handleUpdateCard}
        handleCardClick={handleCardClick}
      />

      <AddColumnModal
        isVisible={isModalVisible}
        columnTitle={newColumnTitle}
        onTitleChange={setNewColumnTitle}
        onOk={handleAddColumn}
        onCancel={() => setIsModalVisible(false)}
      />
    </>
  );
};

export default Board;
