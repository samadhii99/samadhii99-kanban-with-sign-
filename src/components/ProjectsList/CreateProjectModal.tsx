import React from "react";
import { Modal, Form, Input, Select, Radio, Button, DatePicker } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Project } from "../../types/Project";
import { createNewProject } from "../../utils/projectUtils"; 

const { Option } = Select;

interface CreateProjectModalProps {
  isVisible: boolean;
  onCancel: () => void;
  onCreateProject: (project: Project) => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isVisible,
  onCancel,
  onCreateProject,
}) => {
  const [form] = Form.useForm();

  const handleCreateProject = () => {
    form.validateFields().then((values) => {
      const newProject = createNewProject(values);
      onCreateProject(newProject);
      form.resetFields();
    });
  };

  return (
    <Modal
      title="Create Project"
      open={isVisible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="create" type="primary" onClick={handleCreateProject}>
          Create
        </Button>,
      ]}
      width={800}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="projectName"
          rules={[{ required: true, message: "Please enter project name!" }]}
        >
          <Input placeholder="Project Name" />
        </Form.Item>

        <div className="form-section">
          <h4>Default View</h4>
          <Form.Item name="defaultView" initialValue="kanbanBoard">
            <Radio.Group>
              <Radio value="kanbanBoard">Kanban Board</Radio>
              <Radio value="taskList">Task List</Radio>
            </Radio.Group>
          </Form.Item>
        </div>

        <div className="form-tabs">
          <Button type="text" className="form-tab active">
            From scratch
          </Button>
          <Button type="text" className="form-tab">
            From default template
          </Button>
          <Button type="text" className="form-tab">
            From my template
          </Button>
        </div>

        <div className="form-grid">
          <div className="form-column">
            <Form.Item name="key" label={<span>Key</span>}>
              <Input placeholder="Example" />
            </Form.Item>

            <Form.Item name="status" label="Status (Optional)">
              <Select defaultValue="Proposed">
                <Option value="Proposed">Proposed</Option>
                <Option value="In Progress">In Progress</Option>
                <Option value="Completed">Completed</Option>
              </Select>
            </Form.Item>

            <Form.Item name="health" label="Health (Optional)">
              <Select defaultValue="Not Set">
                <Option value="Not Set">Not Set</Option>
                <Option value="On Track">On Track</Option>
                <Option value="At Risk">At Risk</Option>
                <Option value="Off Track">Off Track</Option>
              </Select>
            </Form.Item>

            <Form.Item name="category" label="Category (Optional)">
              <Select placeholder="Add a category to the project">
                <Option value="Test">Test</Option>
                <Option value="Development">Development</Option>
                <Option value="Design">Design</Option>
              </Select>
            </Form.Item>

            <Form.Item name="client" label="Client (Optional)">
              <Select placeholder="Select client">
                <Option value="client1">Client 1</Option>
                <Option value="client2">Client 2</Option>
              </Select>
            </Form.Item>

            <Form.Item name="notes" label="Notes (Optional)">
              <Input.TextArea placeholder="Notes" rows={4} />
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
              <DatePicker
                placeholder="Select date"
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item label="End Date" name="endDate">
              <DatePicker
                placeholder="Select date"
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              name="estimatedWorkingDays"
              label="Estimated working days"
            >
              <Input placeholder="0" />
            </Form.Item>

            <Form.Item name="estimatedManDays" label="Estimated man days">
              <Input placeholder="0" />
            </Form.Item>

            <Form.Item name="hoursPerDay" label="Hours per day">
              <Input placeholder="8" />
            </Form.Item>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateProjectModal;