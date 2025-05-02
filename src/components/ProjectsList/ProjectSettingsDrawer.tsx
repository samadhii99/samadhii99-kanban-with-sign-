import React, { useEffect } from "react";
import { 
  Drawer, 
  Form, 
  Input, 
  Select, 
  Radio, 
  Button, 
  DatePicker, 
  Space, 
  Tooltip,
  Popconfirm 
} from "antd";
import { 
  PlusOutlined, 
  InboxOutlined, 
  DeleteOutlined, 
  EditOutlined 
} from "@ant-design/icons";
import { Project } from "../../types/Project";
import { mapProjectToFormValues } from "../../utils/projectUtils";

const { Option } = Select;

interface ProjectSettingsDrawerProps {
  isVisible: boolean;
  project: Project | null;
  onClose: () => void;
  onSave: (project: Project, values: any) => void;
  onDelete: (projectId: string) => void;
  onArchive: (e: React.MouseEvent, projectId: string) => void;
}

const ProjectSettingsDrawer: React.FC<ProjectSettingsDrawerProps> = ({
  isVisible,
  project,
  onClose,
  onSave,
  onDelete,
  onArchive,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (project) {
      form.setFieldsValue(mapProjectToFormValues(project));
    }
  }, [project, form]);

  const handleSaveChanges = () => {
    if (!project) return;

    form.validateFields().then((values) => {
      onSave(project, values);
    });
  };

  if (!project) return null;

  return (
    <Drawer
      title="Project Settings"
      placement="right"
      onClose={onClose}
      open={isVisible}
      width={800}
      extra={
        <Space>
          <Tooltip
            title={project.isArchived ? "Unarchive" : "Archive"}
          >
            <Button
              icon={<InboxOutlined />}
              onClick={(e) => onArchive(e, project.id)}
            >
              {project.isArchived ? "Unarchive" : "Archive"}
            </Button>
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this project?"
            onConfirm={() => onDelete(project.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger>
              Delete
            </Button>
          </Popconfirm>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={handleSaveChanges}
          >
            Save Changes
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="projectName"
          label="Project Name"
          rules={[
            { required: true, message: "Please enter project name!" },
          ]}
        >
          <Input />
        </Form.Item>

        <div className="form-section">
          <h4>Default View</h4>
          <Form.Item name="defaultView">
            <Radio.Group>
              <Radio value="kanbanBoard">Kanban Board</Radio>
              <Radio value="taskList">Task List</Radio>
            </Radio.Group>
          </Form.Item>
        </div>

        <div className="form-grid">
          <div className="form-column">
            <Form.Item name="key" label={<span>Key</span>}>
              <Input />
            </Form.Item>

            <Form.Item name="status" label="Status">
              <Select>
                <Option value="Proposed">Proposed</Option>
                <Option value="In Progress">In Progress</Option>
                <Option value="Completed">Completed</Option>
              </Select>
            </Form.Item>

            <Form.Item name="health" label="Health">
              <Select>
                <Option value="Not Set">Not Set</Option>
                <Option value="On Track">On Track</Option>
                <Option value="At Risk">At Risk</Option>
                <Option value="Off Track">Off Track</Option>
              </Select>
            </Form.Item>

            <Form.Item name="category" label="Category">
              <Select>
                <Option value="Test">Test</Option>
                <Option value="Development">Development</Option>
                <Option value="Design">Design</Option>
              </Select>
            </Form.Item>

            <Form.Item name="client" label="Client">
              <Select>
                <Option value="client1">Client 1</Option>
                <Option value="client2">Client 2</Option>
              </Select>
            </Form.Item>

            <Form.Item name="notes" label="Notes">
              <Input.TextArea rows={4} />
            </Form.Item>
          </div>

          <div className="form-column">
            <Form.Item name="projectColor" label="Project Color">
              <div className="color-picker">
                <div className="color-box blue-color"></div>
              </div>
            </Form.Item>

            <Form.Item name="projectManager" label="Project Manager">
              <Button
                icon={<PlusOutlined />}
                className="select-manager-btn"
              ></Button>
            </Form.Item>

            <Form.Item label="Start Date" name="startDate">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item label="End Date" name="endDate">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="estimatedWorkingDays"
              label="Estimated working days"
            >
              <Input />
            </Form.Item>

            <Form.Item name="estimatedManDays" label="Estimated man days">
              <Input />
            </Form.Item>

            <Form.Item name="hoursPerDay" label="Hours per day">
              <Input />
            </Form.Item>
          </div>
        </div>
      </Form>
    </Drawer>
  );
};

export default ProjectSettingsDrawer;