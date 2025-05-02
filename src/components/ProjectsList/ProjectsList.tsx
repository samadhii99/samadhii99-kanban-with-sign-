import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Project } from "../../types/Project";
import { useProjects } from "./hooks/useProjects";
import { mapFormValuesToProject } from "../../utils/projectUtils";
import ProjectsHeader from "./ProjectsHeader";
import ProjectTable from "./ProjectTable";
import CreateProjectModal from "./CreateProjectModal";
import ProjectSettingsDrawer from "./ProjectSettingsDrawer";
import "./ProjectsList.css";

const ProjectsList: React.FC = () => {
  const navigate = useNavigate();
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isSettingsDrawerVisible, setIsSettingsDrawerVisible] = useState(false);
  
  const {
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
    handleRefresh
  } = useProjects();

  // Handlers
  const showCreateModal = () => {
    setIsCreateModalVisible(true);
  };

  const handleCreateProject = (newProject: Project) => {
    addProject(newProject);
    setIsCreateModalVisible(false);
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  const handleToggleFavorite = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    toggleFavorite(projectId);
  };

  const handleOpenSettings = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    setSelectedProject(project);
    setIsSettingsDrawerVisible(true);
  };

  const handleSaveChanges = (project: Project, values: any) => {
    const updatedProject = mapFormValuesToProject(project, values);
    updateProject(updatedProject);
    setIsSettingsDrawerVisible(false);
  };

  const handleDeleteProject = (projectId: string) => {
    deleteProject(projectId);
    setIsSettingsDrawerVisible(false);
  };

  const handleToggleArchive = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    toggleArchive(projectId);
    if (selectedProject && selectedProject.id === projectId) {
      setIsSettingsDrawerVisible(false);
    }
  };

  return (
    <div className="projects-list-container">
      {/* Header with tabs and search */}
      <ProjectsHeader 
        searchText={searchText}
        onSearchChange={(value: React.SetStateAction<string>) => setSearchText(value)}
        activeTab={activeTab}
        onTabChange={(key) => setActiveTab(key as any)}
        onRefresh={handleRefresh}
        onCreateClick={showCreateModal}
      />

      {/* Projects table */}
      <ProjectTable 
        projects={filteredProjects}
        onProjectClick={handleProjectClick}
        onToggleFavorite={handleToggleFavorite}
        onOpenSettings={handleOpenSettings}
      />

      {/* Create project modal */}
      <CreateProjectModal 
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onCreateProject={handleCreateProject}
      />

      {/* Project settings drawer */}
      <ProjectSettingsDrawer 
        project={selectedProject}
        isVisible={isSettingsDrawerVisible}
        onClose={() => setIsSettingsDrawerVisible(false)}
        onSave={handleSaveChanges}
        onDelete={handleDeleteProject}
        onArchive={handleToggleArchive}
      />
    </div>
  );
};

export default ProjectsList;