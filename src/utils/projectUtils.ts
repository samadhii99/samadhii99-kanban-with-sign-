import { Project } from "../types/Project";
import dayjs from "dayjs";

/**
 * Creates a new project object with default values
 */
export const createNewProject = (formValues: any): Project => {
  const now = new Date();
  return {
    id: Date.now().toString(),
    name: formValues.projectName,
    client: formValues.client || "-",
    category: formValues.category || "Test",
    status: formValues.status || "Proposed",
    progress: 0,
    lastUpdated: now.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    members: ["C"],
    key: formValues.key || formValues.projectName.slice(0, 3).toUpperCase(),
    defaultView: formValues.defaultView || "kanbanBoard",
    health: formValues.health || "Not Set",
    notes: formValues.notes || "",
    color: formValues.projectColor || "blue",
    projectManager: formValues.projectManager || "",
    startDate: formValues.startDate
      ? formValues.startDate.format("YYYY-MM-DD")
      : undefined,
    endDate: formValues.endDate
      ? formValues.endDate.format("YYYY-MM-DD")
      : undefined,
    estimatedWorkingDays: formValues.estimatedWorkingDays
      ? Number(formValues.estimatedWorkingDays)
      : 0,
    estimatedManDays: formValues.estimatedManDays
      ? Number(formValues.estimatedManDays)
      : 0,
    hoursPerDay: formValues.hoursPerDay ? Number(formValues.hoursPerDay) : 8,
    isFavorite: false,
    isArchived: false,
    // Initialize kanban board with default columns
    columns: [
      {
        id: `${now.getTime()}-todo`,
        title: "To Do",
        cards: [],
      },
      {
        id: `${now.getTime()}-inprogress`,
        title: "In Progress",
        cards: [],
      },
      {
        id: `${now.getTime()}-done`,
        title: "Done",
        cards: [],
      },
    ],
  };
};

/**
 * Maps form values to an updated project object
 */
export const mapFormValuesToProject = (
  project: Project,
  values: any
): Project => {
  return {
    ...project,
    name: values.projectName,
    key: values.key,
    client: values.client,
    category: values.category,
    status: values.status,
    health: values.health,
    notes: values.notes,
    defaultView: values.defaultView,
    color: values.projectColor,
    projectManager: values.projectManager,
    startDate: values.startDate
      ? values.startDate.format("YYYY-MM-DD")
      : undefined,
    endDate: values.endDate ? values.endDate.format("YYYY-MM-DD") : undefined,
    estimatedWorkingDays: values.estimatedWorkingDays,
    estimatedManDays: values.estimatedManDays,
    hoursPerDay: values.hoursPerDay,
    lastUpdated: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  };
};

/**
 * Maps a project to form values for editing
 */
export const mapProjectToFormValues = (project: Project) => {
  return {
    projectName: project.name,
    key: project.key,
    client: project.client,
    category: project.category,
    status: project.status,
    health: project.health,
    notes: project.notes,
    defaultView: project.defaultView,
    projectColor: project.color,
    projectManager: project.projectManager,
    startDate: project.startDate ? dayjs(project.startDate) : undefined,
    endDate: project.endDate ? dayjs(project.endDate) : undefined,
    estimatedWorkingDays: project.estimatedWorkingDays,
    estimatedManDays: project.estimatedManDays,
    hoursPerDay: project.hoursPerDay,
  };
};
