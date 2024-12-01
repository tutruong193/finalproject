import React, { useState, useEffect } from "react";
import {
  Modal,
  Select,
  Input,
  Form,
  DatePicker,
} from "antd";
import {
  DownOutlined,
  PaperClipOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import * as TaskService from "../../services/TaskService";
import * as CommentService from "../../services/CommentService";
import dayjs from "dayjs";
import * as Message from "../../components/MessageComponent/MessageComponent";

const dateFormatOptions = {
  day: "2-digit",
  month: "long",
  year: "numeric",
};

const renderDate = (date) => {
  if (!date) return "N/A";
  const parsedDate = new Date(date);
  if (isNaN(parsedDate)) return "Invalid Date";
  return new Intl.DateTimeFormat("en-US", dateFormatOptions).format(parsedDate);
};

const ModelDetailTask = ({
  isModalOpen,
  onCancel,
  selectedTask,
  infoUser,
  onTaskUpdate,
}) => {
  const [formSubtask] = Form.useForm();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isSubtaskModalVisible, setIsSubtaskModalVisible] = useState(false);

  useEffect(() => {
    if (selectedTask?._id) {
      fetchComments(selectedTask._id);
    }
  }, [selectedTask?._id]);

  const fetchComments = async (id) => {
    const res = await CommentService.getCommentbyTaskId(id);
    if (res.status === "OK") {
      setComments(res.data);
    }
  };

  const onChangeStatusTask = async (value) => {
    const res = await TaskService.updateStatusTask(
      selectedTask._id,
      infoUser.id,
      value
    );
    if (res.status === "OK") {
      Message.success();
      onTaskUpdate();
    } else {
      Message.error(res.message);
    }
  };

  const onChangeStatusSubtask = async (subtaskId, newStatus) => {
    try {
      const res = await TaskService.updateStatusSubtask(
        selectedTask._id,
        subtaskId,
        infoUser.id,
        newStatus
      );
      if (res.status === "OK") {
        Message.success();
        onTaskUpdate();
      } else {
        Message.error(res.message);
      }
    } catch (error) {
      console.error("Error updating subtask status:", error);
      Message.error("Failed to update subtask status");
    }
  };

  const showSubtaskModal = () => {
    setIsSubtaskModalVisible(true);
  };

  const handleAddSubtask = async () => {
    try {
      const values = await formSubtask.validateFields();
      const selectedAssignees = values.assignees.map((userId) => {
        const assignee = selectedTask.assignees.find(
          (a) => a.userId === userId
        );
        return { userId: assignee.userId, name: assignee.name };
      });

      const newSubtask = {
        ...values,
        assignees: selectedAssignees,
      };

      const res = await TaskService.addSubTask(selectedTask._id, newSubtask);
      if (res.status === "OK") {
        Message.success(res.message);
        formSubtask.resetFields();
        setIsSubtaskModalVisible(false);
        onTaskUpdate();
      } else {
        Message.error(res.message);
      }
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleSaveComment = async () => {
    const newCommentObject = {
      author: infoUser.id,
      taskId: selectedTask?._id,
      content: newComment,
    };
    const res = await CommentService.createComment(newCommentObject);
    if (res.status === "OK") {
      Message.success();
      fetchComments(selectedTask?._id);
      setNewComment("");
    } else {
      Message.error(res.message);
    }
  };

  const deleteComment = async (id) => {
    const res = await CommentService.deleteComment(id);
    if (res.status === "OK") {
      Message.success();
      fetchComments(selectedTask?._id);
    } else {
      Message.error(res.message);
    }
  };

  const options = selectedTask?.assignees
    ? selectedTask.assignees.map((assignee) => ({
        value: assignee.userId,
        label: assignee.name,
      }))
    : [];

  return (
    <>
      <Modal
        title={null}
        open={isModalOpen}
        onCancel={onCancel}
        footer={null}
        width={1000}
        className="task-modal"
      >
        {/* Rest of the modal content (similar to the previous implementation) */}
        {/* You can copy the entire modal content from the previous implementation */}
        {/* Make sure to replace direct references to state with props passed in */}
      </Modal>

      <Modal
        title="Add Subtask"
        open={isSubtaskModalVisible}
        onCancel={() => setIsSubtaskModalVisible(false)}
        onOk={handleAddSubtask}
      >
        <Form form={formSubtask} layout="vertical">
          <Form.Item
            name="name"
            label="Subtask Name"
            rules={[
              { required: true, message: "Please input the subtask name!" },
            ]}
          >
            <Input placeholder="Enter subtask name" />
          </Form.Item>
          <Form.Item
            name="dueDate"
            label="Due Date"
            rules={[{ required: true, message: "Please input the due date!" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Assign Member"
            name="assignees"
            rules={[{ required: true, message: "Please select assignees!" }]}
          >
            <Select
              mode="multiple"
              options={options}
              style={{ width: "100%" }}
            ></Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModelDetailTask;
