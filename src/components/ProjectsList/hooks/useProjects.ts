import { useState, useEffect } from "react";
import { Project } from "../../../types/Project";

export const useProjects = () => {
  // Load projects from localStorage on initial render
  const [projects, setProjects] = useState<Project[]>(() => {
    const savedProjects = localStorage.getItem('projects');
    return savedProjects ? JSON.parse(savedProjects) : [];
  });
  
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Save projects to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  // Filter projects based on search text and active tab
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchText.toLowerCase()) ||
      project.client?.toLowerCase().includes(searchText.toLowerCase()) ||
      project.category?.toLowerCase().includes(searchText.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "favorites") return matchesSearch && project.isFavorite;
    if (activeTab === "active") return matchesSearch && !project.isArchived;
    if (activeTab === "archived") return matchesSearch && project.isArchived;
    
    return matchesSearch;
  });

  // CRUD operations
  const addProject = (newProject: Project) => {
    setProjects((prevProjects) => [...prevProjects, newProject]);
  };

  const updateProject = (updatedProject: Project) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === updatedProject.id ? updatedProject : project
      )
    );
  };

  const deleteProject = (projectId: string) => {
    setProjects((prevProjects) =>
      prevProjects.filter((project) => project.id !== projectId)
    );
  };

  const toggleFavorite = (projectId: string) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === projectId
          ? { ...project, isFavorite: !project.isFavorite }
          : project
      )
    );
  };

  const toggleArchive = (projectId: string) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === projectId
          ? { ...project, isArchived: !project.isArchived }
          : project
      )
    );
  };

  const handleRefresh = () => {
    // In a real application, you might fetch fresh data from an API here
    // For now, we'll just keep the current data
    console.log("Refreshing projects...");
  };

  return {
    projects,
    filteredProjects,
    searchText,
    setSearchText,
    activeTab,
    setActiveTab,
    selectedProject,
    setSelectedProject,
    addProject,
    updateProject,
    deleteProject,
    toggleFavorite,
    toggleArchive,
    handleRefresh,
  };
};