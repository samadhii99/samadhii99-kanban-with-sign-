import React from "react";
import { Modal, Input, Form } from "antd";

interface AddColumnModalProps {
  isVisible: boolean;
  columnTitle: string;
  onTitleChange: (title: string) => void;
  onOk: () => void;
  onCancel: () => void;
}

const AddColumnModal: React.FC<AddColumnModalProps> = ({
  isVisible,
  columnTitle,
  onTitleChange,
  onOk,
  onCancel,
}) => {
  return (
    <Modal
      title="Add New Column"
      open={isVisible}
      onOk={onOk}
      onCancel={onCancel}
    >
      <Form layout="vertical">
        <Form.Item label="Column Title">
          <Input
            value={columnTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Enter column title"
            autoFocus
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddColumnModal;