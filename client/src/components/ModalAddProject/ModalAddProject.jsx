import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Radio,
  Typography,
  Space,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  CloseOutlined,
  InfoCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  TagOutlined,
} from "@ant-design/icons";

const { Text } = Typography;
const { TextArea } = Input;

const priorityColors = {
  low: "#52c41a",
  medium: "#faad14",
  high: "#ff4d4f",
};

const AddProjectModal = ({
  isModalVisible,
  handleCancel,
  handleAddTask,
  form,
  options,
}) => {
  return (
    <Modal
      title={
        <Space>
          <PlusOutlined />
          <span>Create New Task</span>
        </Space>
      }
      open={isModalVisible}
      onCancel={handleCancel}
      footer={null}
      width={520}
      centered
    >
      <Form
        form={form}
        onFinish={handleAddTask}
        layout="vertical"
        initialValues={{
          priority: "high",
          description: "",
        }}
      >
        <Form.Item
          label="Task Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input the task name!",
            },
          ]}
        >
          <Input
            placeholder="Enter task name"
            prefix={<TagOutlined />}
            allowClear
          />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          extra={
            <Text type="secondary" className="text-xs">
              Optional: Add more details about the task
            </Text>
          }
        >
          <TextArea placeholder="Provide task details" rows={3} allowClear />
        </Form.Item>
        <Form.Item
          label="Members"
          name="assignees"
          rules={[
            {
              required: true,
              message: "Please select at least one member!",
            },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Select team members"
            style={{ width: "100%" }}
            options={options}
            prefix={<UserOutlined />}
            allowClear
          />
        </Form.Item>

        <Form.Item
          label="Due Date"
          name="dueDate"
          rules={[
            {
              required: true,
              message: "Please select the due date!",
            },
          ]}
        >
          <DatePicker
            style={{ width: "100%" }}
            placeholder="Select due date"
            prefix={<CalendarOutlined />}
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
              Create Task
            </Button>
            <Button onClick={handleCancel} icon={<CloseOutlined />}>
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddProjectModal;
