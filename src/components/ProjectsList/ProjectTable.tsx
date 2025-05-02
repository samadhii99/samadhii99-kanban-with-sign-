import React from "react";
import { Table, Button, Space, Tooltip, Avatar } from "antd";
import { StarOutlined, StarFilled, SettingOutlined } from "@ant-design/icons";
import { Project } from "../../types/Project";

interface ProjectTableProps {
  projects: Project[];
  onProjectClick: (projectId: string) => void;
  onToggleFavorite: (e: React.MouseEvent, projectId: string) => void;
  onOpenSettings: (e: React.MouseEvent, project: Project) => void;
}

const ProjectTable: React.FC<ProjectTableProps> = ({
  projects,
  onProjectClick,
  onToggleFavorite,
  onOpenSettings,
}) => {
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Project) => (
        <div
          className="project-name"
          onClick={() => onProjectClick(record.id)}
        >
          <span
            className="dot-indicator"
            style={{ backgroundColor: record.color || "#1890ff" }}
          ></span>
          {text}
        </div>
      ),
    },
    {
      title: "Client",
      dataIndex: "client",
      key: "client",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category: string) => (
        <div className="category-tag">{category}</div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Tasks Progress",
      dataIndex: "progress",
      key: "progress",
      render: (progress: number) => (
        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span>{progress}%</span>
        </div>
      ),
    },
    {
      title: "Last Updated",
      dataIndex: "lastUpdated",
      key: "lastUpdated",
    },
    {
      title: "Members",
      dataIndex: "members",
      key: "members",
      render: (members: string[]) => (
        <div className="member-avatars">
          {members.map((member, index) => (
            <Avatar key={index} size="small" className={`avatar-${index % 4}`}>
              {member}
            </Avatar>
          ))}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Project) => (
        <Space size="middle">
          <Tooltip
            title={
              record.isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            <Button
              type="text"
              icon={
                record.isFavorite ? (
                  <StarFilled style={{ color: "#faad14" }} />
                ) : (
                  <StarOutlined />
                )
              }
              onClick={(e) => onToggleFavorite(e, record.id)}
            />
          </Tooltip>
          <Tooltip title="Project settings">
            <Button
              type="text"
              icon={<SettingOutlined />}
              onClick={(e) => onOpenSettings(e, record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table
      dataSource={projects}
      columns={columns}
      rowKey="id"
      pagination={{
        pageSize: 20,
        showSizeChanger: true,
        pageSizeOptions: ["20", "50", "100"],
      }}
      onRow={(record) => ({
        onClick: () => onProjectClick(record.id),
        className: "project-row",
      })}
    />
  );
};

export default ProjectTable;