export interface Project {
  id: string;
  name: string;
  projectName?: string;
  client: string;
  category: string;
  status: string;
  progress: number;
  lastUpdated: string;
  members: string[];
  isFavorite: boolean;
  isArchived: boolean;
  key?: string;
  defaultView?: string;
  health?: string;
  notes?: string;
  color?: string;
  projectManager?: string;
  startDate?: string;
  endDate?: string;
  estimatedWorkingDays?: number;
  estimatedManDays?: number;
  hoursPerDay?: number;
  // Kanban board data
  columns?: any[];
}

export type ProjectTab = "all" | "favorites" | "archived";
