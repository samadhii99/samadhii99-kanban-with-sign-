import React from "react";
import { Select, Space } from "antd";

const { Option } = Select;

interface FilterBarProps {
  onSortChange: (value: string) => void;
  onPriorityFilter: (priorities: string[]) => void;
  onLabelFilter: (labels: string[]) => void;
  onMemberFilter: (members: string[]) => void;
  onGroupByChange: (value: string) => void;
  availableLabels: string[];
  availableMembers: string[];
}

const FilterBar: React.FC<FilterBarProps> = ({
  onSortChange,
  onPriorityFilter,
  onLabelFilter,
  onMemberFilter,
  onGroupByChange,
  availableLabels,
  availableMembers,
}) => {
  // Predefined priority options
  const priorityOptions = ["High Priority", "Medium Priority", "Low Priority"];

  return (
    <div className="filter-bar" style={{ padding: "16px 0" }}>
      <Space size="large">
        <div className="filter-section">
          <label htmlFor="sort-by">Sort by: </label>
          <Select
            id="sort-by"
            placeholder="Sort by"
            style={{ width: 150 }}
            onChange={onSortChange}
            allowClear
          >
            <Option value="title">Title</Option>
            <Option value="priority">Priority</Option>
            <Option value="dueDate">Due Date</Option>
            <Option value="createdDate">Created Date</Option>
            <Option value="updatedDate">Updated Date</Option>
          </Select>
        </div>

        <div className="filter-section">
          <label htmlFor="priority-filter">Priority: </label>
          <Select
            id="priority-filter"
            mode="multiple"
            placeholder="Filter by priority"
            style={{ width: 200 }}
            onChange={onPriorityFilter}
            allowClear
          >
            {priorityOptions.map((priority) => (
              <Option key={priority} value={priority}>
                {priority}
              </Option>
            ))}
          </Select>
        </div>

        <div className="filter-section">
          <label htmlFor="label-filter">Labels: </label>
          <Select
            id="label-filter"
            mode="multiple"
            placeholder="Filter by labels"
            style={{ width: 200 }}
            onChange={onLabelFilter}
            allowClear
          >
            {availableLabels
              .filter((label) => !label.includes("Priority"))
              .map((label) => (
                <Option key={label} value={label}>
                  {label}
                </Option>
              ))}
          </Select>
        </div>

        <div className="filter-section">
          <label htmlFor="member-filter">Members: </label>
          <Select
            id="member-filter"
            mode="multiple"
            placeholder="Filter by members"
            style={{ width: 200 }}
            onChange={onMemberFilter}
            allowClear
          >
            {availableMembers.map((member) => (
              <Option key={member} value={member}>
                {member}
              </Option>
            ))}
          </Select>
        </div>

        <div className="filter-section">
          <label htmlFor="group-by">Group by: </label>
          <Select
            id="group-by"
            placeholder="Group by"
            style={{ width: 150 }}
            onChange={onGroupByChange}
            allowClear
          >
            <Option value="priority">Priority</Option>
            <Option value="label">Label</Option>
            <Option value="member">Member</Option>
          </Select>
        </div>
      </Space>
    </div>
  );
};

export default FilterBar;