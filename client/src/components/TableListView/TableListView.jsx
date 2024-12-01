import React, { useState, useEffect } from "react";
import {
  Select,
  Table,
  Avatar,
  Modal,
  Button,
  Typography,
  Tabs,
  Input,
  Tooltip,
  Form,
  DatePicker,
  Radio,
} from "antd";
import * as TaskService from "../../services/TaskService";
import * as CommentService from "../../services/CommentService";
import {
  DownOutlined,
  PaperClipOutlined,
  PlusOutlined,
  LinkOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import * as Message from "../../components/MessageComponent/MessageComponent";
import { jwtTranslate } from "../../ultilis";
import { useCookies } from "react-cookie";
import relativeTime from "dayjs/plugin/relativeTime";
import ModelDetailTask from "../ModelDetailTask/ModelDetailTask";
dayjs.extend(relativeTime);
// Thay đổi mảng columns để phù hợp với dữ liệu mới
const dateFormatOptions = {
  day: "2-digit",
  month: "long", // Tháng dưới dạng chữ
  year: "numeric",
};
const renderDate = (date) => {
  if (!date) return "N/A"; // Nếu không có giá trị, trả về "N/A"
  const parsedDate = new Date(date);
  if (isNaN(parsedDate)) return "Invalid Date"; // Kiểm tra xem có phải là ngày hợp lệ không
  return new Intl.DateTimeFormat("en-US", dateFormatOptions).format(parsedDate);
};
const itemPriority = [
  {
    label: "High",
    value: "high",
  },
  {
    label: "Medium",
    value: "medium",
  },
  {
    label: "Low",
    value: "low",
  },
];

const tags = [
  {
    status: "todo",
    color: "#f34e4e",
    backgroundColor: "rgba(243, 78, 78, .1)",
  },
  {
    status: "progress",
    color: "#f7cc53",
    backgroundColor: "rgba(247, 204, 83, .1)",
  },
  {
    status: "done",
    color: "#51d28c",
    backgroundColor: "rgba(81, 210, 140, .1)",
  },
];
const priorityTags = [
  {
    priority: "low",
    color: "#52c41a", // Xanh lá cho mức độ ưu tiên thấp
    backgroundColor: "rgba(82, 196, 26, 0.1)",
  },
  {
    priority: "medium",
    color: "#faad14", // Vàng cho mức độ ưu tiên trung bình
    backgroundColor: "rgba(250, 173, 20, 0.1)",
  },
  {
    priority: "high",
    color: "#f5222d", // Đỏ cho mức độ ưu tiên cao
    backgroundColor: "rgba(245, 34, 45, 0.1)",
  },
];

const TableListView = ({ data, onRowSelectionChange }) => {
  const [cookiesAccessToken] = useCookies("");
  const infoUser = jwtTranslate(cookiesAccessToken.access_token);
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 350,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 100,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 350,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => {
        const tag = tags.find((tag) => tag.status === status);
        return (
          <span
            style={{
              color: tag?.color || "black",
              backgroundColor: tag?.backgroundColor || "transparent",
              padding: "4px 8px",
              borderRadius: "4px",
              display: "inline-block",
            }}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      },
    },
    {
      title: "Assignees",
      dataIndex: "assignees",
      key: "assignees",
      width: 120,
      render: (assignees) =>
        assignees?.length > 0 ? (
          <Avatar.Group count={2}>
            {assignees.map((assignee) => (
              <Avatar
                style={{ backgroundColor: "#87d068", cursor: "pointer" }}
                key={assignee.userId}
                alt={assignee.name}
                title={assignee.name}
              >
                {assignee.name.charAt(0).toUpperCase()}
              </Avatar>
            ))}
          </Avatar.Group>
        ) : (
          "None"
        ),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      width: 200,
      render: (dueDate) => {
        return <div className="task-date">{renderDate(dueDate)}</div>;
      },
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 200,
      render: (createdAt) => {
        return <div className="task-date">{renderDate(createdAt)}</div>;
      },
    },
    {
      title: "Updated",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 200,
      render: (updatedAt) => {
        return <div className="task-date">{renderDate(updatedAt)}</div>;
      },
    },
  ];
  const formatTaskData = (data) => {
    return data.map((task) => {
      const formattedTask = {
        ...task,
        type: "task",
        key: task._id,
      };

      // Chỉ thêm thuộc tính `children` nếu có `subtasks`
      if (task.subtasks && task?.subtasks?.length > 0) {
        formattedTask.children = task.subtasks.map((subtask) => ({
          ...subtask,
          type: "subtask",
          key: subtask._id, // Ensure each subtask has a unique key
        }));
      }

      return formattedTask;
    });
  };

  const formattedTasks = data ? formatTaskData(data) : [];
  // Modal for task information
  const [isModalTaskInformation, setIsModalTaskInformation] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const fetchTaskData = async (id) => {
    const res = await TaskService.getDetailTask(id);
    if (res.status === "OK") {
      setSelectedTask(res.data);
    } else {
      setSelectedTask(null);
    }
  };
  const showModal = async (key) => {
    await fetchTaskData(key);
    await fetchComments(key);
    setIsModalTaskInformation(true);
  };
  const handleCancelTaskInformation = () => {
    setSelectedTask(null);
    setIsModalTaskInformation(false);
  };

  //change status task
  const onChangeStatusTask = async (value) => {
    const res = await TaskService.updateStatusTask(
      selectedTask._id,
      infoUser.id,
      value
    );
    console.log(res);
    if (res.status === "OK") {
      Message.success();
      fetchTaskData(selectedTask._id);
    } else {
      Message.error(res.message);
    }
  };
  // Modal for adding subtask
  const [isSubtaskModalVisible, setIsSubtaskModalVisible] = useState(false);
  const [formSubtask] = Form.useForm();
  const [piorityValue, setPiorityValue] = useState("high");
  const handleChangePriority = (e) => {
    setPiorityValue(e.target.value);
  };
  const options = [];
  if (selectedTask?.assignees) {
    // Sử dụng members thay vì membersID
    for (let i = 0; i < selectedTask?.assignees?.length; i++) {
      options.push({
        value: selectedTask?.assignees[i].userId, // ID thành viên
        label: selectedTask?.assignees[i].name, // Tên thành viên
      });
    }
  }
  const showSubtaskModal = () => {
    setIsSubtaskModalVisible(true);
  };
  const handleAddSubtask = async () => {
    try {
      const values = await formSubtask.validateFields();
      // Lấy thông tin assignees từ stateTask để lưu cả ID và tên
      const selectedAssignees = values.assignees.map((userId) => {
        const assignee = selectedTask.assignees.find(
          (a) => a.userId === userId
        );
        return { userId: assignee.userId, name: assignee.name };
      });
      // Thêm subtask mới với thông tin đầy đủ của assignees
      const newSubtask = {
        ...values,
        assignees: selectedAssignees, // Lưu cả ID và tên
      };
      const res = await TaskService.addSubTask(selectedTask._id, newSubtask);
      if (res.status === "OK") {
        Message.success(res.message);
        formSubtask.resetFields();
        setIsSubtaskModalVisible(false);
        fetchTaskData(selectedTask._id);
      } else {
        Message.error(res.message);
      }
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };
  const handleCancelSubtaskModal = () => {
    setIsSubtaskModalVisible(false);
  };
  //change status subtask
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
        fetchTaskData(selectedTask._id); // Cập nhật lại thông tin của task để hiển thị trạng thái mới của subtask
      } else {
        Message.error(res.message);
      }
    } catch (error) {
      console.error("Error updating subtask status:", error);
      Message.error("Failed to update subtask status");
    }
  };
  //delete
  const rowSelection = {
    onChange: (selectedRowKeys) => {
      // Khi chọn các dòng, gọi hàm onRowSelectionChange từ props
      onRowSelectionChange(selectedRowKeys);
    },
    // Optionally, you can set selectedRowKeys here if you want to keep track of selected rows
  };
  //comment
  const [comments, SetComments] = useState();
  const [newComment, setNewComment] = useState("");
  const fetchComments = async (id) => {
    const res = await CommentService.getCommentbyTaskId(id);
    if (res.status === "OK") {
      SetComments(res.data);
    }
  };
  const handleSaveComment = async () => {
    const newCommentObject = {
      author: infoUser.id, // Thay bằng tên người dùng hiện tại
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
  return (
    <>
      <Table
        bordered
        columns={columns}
        rowSelection={rowSelection}
        onRow={(record) => ({
          onClick: () => showModal(record.key), // Mở modal khi click vào hàng
        })}
        dataSource={formattedTasks}
        virtual
        scroll
        size={"small"}
        pagination={false}
      />
      <Modal
        title={null}
        open={isModalTaskInformation}
        onCancel={handleCancelTaskInformation}
        footer={null}
        width={1000}
        className="task-modal"
      >
        <div className="modal-header">
          <div className="modal-title">
            <span style={{ fontSize: "20px" }}>Task Name</span>
            <span style={{ color: "#6B778C" }}>{selectedTask?.name}</span>
          </div>
          <div className="modal-actions">
            <Select
              defaultValue={selectedTask?.status}
              style={{
                width: 120,
              }}
              onChange={onChangeStatusTask}
              className={`status-select ${selectedTask?.status}`}
              options={[
                {
                  value: "todo",
                  label: "Todo",
                },
                {
                  value: "done",
                  label: "Done",
                },
                {
                  value: "progress",
                  label: "Progress",
                },
              ]}
            />
            <Button>
              Actions <DownOutlined />
            </Button>
          </div>
        </div>

        <div className="modal-content">
          <div className="main-content">
            <div className="action-buttons">
              <button className="action-button">
                <PaperClipOutlined /> Attach
              </button>
              <button className="action-button" onClick={showSubtaskModal}>
                <PlusOutlined /> Add a child issue
              </button>
            </div>

            <div>
              <Typography.Title level={5}>Description</Typography.Title>
              <Typography.Paragraph type="secondary">
                {selectedTask?.description || "Add a description..."}
              </Typography.Paragraph>
            </div>

            <div style={{ marginBottom: "24px" }}>
              {selectedTask?.subtasks && selectedTask.subtasks.length > 0 && (
                <div>
                  <Typography.Title level={5}>Child issues</Typography.Title>
                  {selectedTask.subtasks.map((subtask) => (
                    <div
                      key={subtask._id} // Giả sử mỗi subtask có thuộc tính _id
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "12px",
                        border: "1px solid #f0f0f0",
                        borderRadius: "4px",
                        alignItems: "center",
                        marginBottom: "5px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span>{subtask.name}</span>
                        <span>{subtask.description}</span>{" "}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <Avatar.Group count={2}>
                          {subtask.assignees.map((assignee) => (
                            <Avatar
                              style={{
                                backgroundColor: "#87d068",
                                cursor: "pointer",
                              }}
                              key={assignee.userId}
                              alt={assignee.name}
                              title={assignee.name}
                            >
                              {assignee.name.charAt(0).toUpperCase()}
                            </Avatar>
                          ))}
                        </Avatar.Group>
                        <Select
                          defaultValue={subtask?.status}
                          style={{
                            width: 120,
                          }}
                          onChange={(value) =>
                            onChangeStatusSubtask(subtask._id, value)
                          }
                          className={`status-select ${subtask?.status}`}
                          options={[
                            {
                              value: "todo",
                              label: "Todo",
                            },
                            {
                              value: "done",
                              label: "Done",
                            },
                            {
                              value: "progress",
                              label: "Progress",
                            },
                          ]}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="comment-section">
              <Typography.Title level={5}>Activity</Typography.Title>
              <Tabs
                className="comment-tabs"
                defaultActiveKey="comments"
                items={[
                  {
                    label: "Comments",
                    key: "comments",
                    children: (
                      <div
                        style={{
                          backgroundColor: "#fff",
                          padding: "16px",
                          border: "1px solid #f0f0f0",
                          borderRadius: "4px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: "12px",
                            alignItems: "flex-start",
                          }}
                        >
                          <Avatar style={{ backgroundColor: "#1890ff" }}>
                            U
                          </Avatar>
                          <div style={{ flex: 1 }}>
                            <Input.TextArea
                              placeholder="Add a comment..."
                              rows={2}
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                            />
                          </div>
                          <Button
                            type="primary"
                            onClick={handleSaveComment}
                            disabled={!newComment.trim()} // Disable when input is empty
                          >
                            Save
                          </Button>
                        </div>
                        {comments?.length > 0 && (
                          <div className="comment-container">
                            {comments.map((comment) => (
                              <div key={comment._id} className="comment">
                                <div className="comment-header">
                                  <div className="user-avatar">
                                    <Avatar
                                      style={{ backgroundColor: "#1890ff" }}
                                    >
                                      {comment?.author?.userName
                                        .charAt(0)
                                        .toUpperCase()}
                                    </Avatar>
                                  </div>
                                  <div className="comment-info">
                                    <h3 className="user-name">
                                      {comment?.author?.userName}
                                    </h3>
                                    <p className="comment-date">
                                      {renderDate(comment?.createdAt)}
                                    </p>
                                  </div>
                                </div>
                                <div className="comment-content">
                                  {comment.content}
                                </div>
                                <div className="comment-actions">
                                  <button
                                    className="delete-btn"
                                    onClick={() => deleteComment(comment._id)}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ),
                  },
                  {
                    label: "History",
                    key: "history",
                    children: "Content of Tab Pane 2",
                  },
                ]}
              />
            </div>
          </div>
          <div className="sidebar">
            <div className="field-group">
              <div className="field-label">Assignee</div>
              <div className="field-value">
                {selectedTask?.assignees ? (
                  <Avatar.Group count={2}>
                    {selectedTask.assignees.map((assignee) => (
                      <Avatar
                        style={{
                          backgroundColor: "#87d068",
                          cursor: "pointer",
                        }}
                        key={assignee.userId}
                        alt={assignee.name}
                        title={assignee.name}
                      >
                        {assignee.name.charAt(0).toUpperCase()}
                      </Avatar>
                    ))}
                  </Avatar.Group>
                ) : (
                  <>
                    <Avatar size="small">U</Avatar>
                    <span>Unassigned</span>
                  </>
                )}
              </div>
            </div>

            <div className="field-group">
              <div className="field-label">Priority</div>
              <div className="field-value">{selectedTask?.priority}</div>
            </div>

            <div className="field-group">
              <div className="field-label">Due Date</div>
              <div className="field-value">
                {renderDate(selectedTask?.dueDate)}
              </div>
            </div>

            <div className="field-group">
              <div className="field-label">Reporter</div>
              <div className="field-value">
                <Avatar size="small" style={{ backgroundColor: "#1890ff" }}>
                  {JSON.parse(localStorage.getItem("manage_project_info"))
                    ?.name.charAt(0)
                    .toUpperCase()}
                </Avatar>
                <span>
                  {
                    JSON.parse(localStorage.getItem("manage_project_info"))
                      ?.name
                  }
                </span>
              </div>
            </div>

            <div
              style={{ fontSize: "12px", color: "#6B778C", marginTop: "24px" }}
            >
              <div>Created {dayjs(selectedTask?.createdAt).fromNow()}</div>
              <div>Updated {dayjs(selectedTask?.updatedAt).fromNow()}</div>
              <div>Resolved {dayjs().fromNow()}</div>{" "}
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        title="Add Subtask"
        open={isSubtaskModalVisible}
        onCancel={handleCancelSubtaskModal}
        onOk={handleAddSubtask}
        onChangeStatusTask={onChangeStatusTask}
        infoUser={infoUser}
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
            rules={[
              { required: true, message: "Please input the subtask name!" },
            ]}
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

export default TableListView;
