import React from "react";
import { Input, Button, Tabs } from "antd";
import { SearchOutlined, SyncOutlined, PlusOutlined } from "@ant-design/icons";
import { ProjectTab } from "../../types/Project";
import type { TabsProps } from "antd";

interface ProjectsHeaderProps {
  totalProjects: number;
  activeTab: ProjectTab;
  searchText: string;
  onSearch: (text: string) => void;
  onTabChange: (key: string) => void;
  onRefresh: () => void;
  onCreateClick: () => void;
}

const ProjectsHeader: React.FC<ProjectsHeaderProps> = ({
  totalProjects,
  activeTab,
  searchText,
  onSearch,
  onTabChange,
  onRefresh,
  onCreateClick
}) => {
  // Tab items for All, Favorites, Archived
  const tabItems: TabsProps["items"] = [
    {
      key: "all",
      label: "All",
    },
    {
      key: "favorites",
      label: "Favourites",
    },
    {
      key: "archived",
      label: "Archived",
    },
  ];

  return (
    <div className="projects-header">
      <h2>
        {totalProjects} Projects
        <SyncOutlined className="refresh-icon" onClick={onRefresh} />
      </h2>
      <div className="header-actions">
        <div className="tabs-container">
          <Tabs
            activeKey={activeTab}
            items={tabItems}
            onChange={onTabChange}
          />
        </div>
        <div className="search-container">
          <Input
            placeholder="Search by name"
            prefix={<SearchOutlined />}
            className="search-input"
            value={searchText}
            onChange={(e) => onSearch(e.target.value)}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onCreateClick}
            className="create-button"
          >
            Create Project
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectsHeader;