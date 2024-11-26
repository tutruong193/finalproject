import React from "react";
import { Modal, Form, Input, DatePicker, Select, Button, Radio } from "antd";

const AddProjectModal = ({
  isModalVisible,
  handleCancel,
  handleAddTask,
  form,
  options,
  itemPriority,
  piorityValue,
  handleChangePriority,
}) => {
  return (
    <Modal
      title="Add New Task"
      open={isModalVisible}
      onCancel={handleCancel}
      footer={null}
    >
      <Form
        form={form}
        onFinish={handleAddTask}
        layout="vertical"
        initialValues={{ priority: "high" }}
      >
        <Form.Item
          label="Task Name"
          name="name"
          rules={[{ required: true, message: "Please input the task name!" }]}
        >
          <Input placeholder="Enter task name" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input placeholder="Enter description" />
        </Form.Item>
        <Form.Item
          label="Priority"
          name="priority"
          rules={[{ required: true, message: "Please select the priority!" }]}
        >
          <Radio.Group
            onChange={handleChangePriority}
            value={piorityValue}
          >
            {itemPriority.map((item) => (
              <Radio key={item.value} value={item.value}>
                {item.label}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="Members"
          name="assignees"
          rules={[{ required: true, message: "Please select at least one member!" }]}
        >
          <Select
            mode="multiple"
            placeholder="Please select"
            style={{ width: "100%" }}
            options={options}
          />
        </Form.Item>
        <Form.Item
          label="Due Date"
          name="dueDate"
          rules={[{ required: true, message: "Please select the due date!" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
            Add Task
          </Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddProjectModal;
