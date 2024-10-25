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
} from "antd";
import * as TaskService from "../../services/TaskService";
import {
  DownOutlined,
  PaperClipOutlined,
  PlusOutlined,
  LinkOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
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
const tags = [
  {
    status: "pending",
    color: "#f34e4e",
    backgroundColor: "rgba(243, 78, 78, .1)",
  },
  {
    status: "progress",
    color: "#f7cc53",
    backgroundColor: "rgba(247, 204, 83, .1)",
  },
  {
    status: "completed",
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
const TableListView = ({ data }) => {
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 350,
      render: (text, record) => (
        <span
          style={{ cursor: "pointer", color: "#1890ff", lineHeight: "20px" }}
          onClick={() => showModal(record)}
        >
          {text}
        </span>
      ),
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
      render: (assignees) => (
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
      ),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      width: 120,
      render: (priority) => {
        const tag = priorityTags.find((tag) => tag.priority === priority);
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
            {priority
              ? priority.charAt(0).toUpperCase() + priority.slice(1)
              : "N/A"}
          </span>
        );
      },
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      width: 200,
      render: renderDate,
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 200,
      render: renderDate,
    },
    {
      title: "Updated",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 200,
      render: renderDate,
    },
  ];
  const formatTaskData = (data) => {
    return data.map((task) => {
      if (!task.children && task.subtasks && task.subtasks.length > 0) {
        return {
          ...task,
          type: "task",
          key: task._id,
          children: task.subtasks.map((subtask) => ({
            ...subtask,
            type: "subtask",
            key: subtask._id, // Ensure each subtask has a unique key
          })),
        };
      }
      return { ...task, key: task._id };
    });
  };
  const formattedTasks = data ? formatTaskData(data) : [];
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    onSelect: (record, selected, selectedRows) => {
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows);
    },
  };
  // Modal for task information
  const [isModalTaskInformation, setIsModalTaskInformation] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const showModal = (record) => {
    setSelectedTask(record);
    setIsModalTaskInformation(true);
  };
  console.log(selectedTask?.status);
  const handleCancelTaskInformation = () => {
    setIsModalTaskInformation(false);
    setSelectedTask(null);
    setSelectedTask(null);
  };
  //fetch task data
  // const [stateTask, setStateTask] = useState({ subtasks: [] });
  // const fetchTaskData = async () => {
  //   try {
  //     const taskRes = await TaskService.getDetailTask(task_id);
  //     if (taskRes.status === "OK") {
  //       setStateTask(taskRes.data);
  //     } else {
  //       console.error("Error fetching task details");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };
  // useEffect(() => {
  //   fetchTaskData();
  // }, [task_id]);
  return (
    <>
      <Table
        bordered
        columns={columns}
        rowSelection={rowSelection}
        dataSource={formattedTasks}
        virtual
        scroll
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
              value={selectedTask?.status}
              style={{
                width: 120,
              }}
              className={`status-select ${selectedTask?.status}`}
              options={[
                {
                  value: "progress",
                  label: "progress",
                },
                {
                  value: "completed",
                  label: "completed",
                },
                {
                  value: "pending",
                  label: "pending",
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
            {/* Action Buttons */}
            <div className="action-buttons">
              <button className="action-button">
                <PaperClipOutlined /> Attach
              </button>
              <button className="action-button">
                <PlusOutlined /> Add a child issue
              </button>
              <button className="action-button">
                <LinkOutlined /> Link issue
              </button>
              <Tooltip title="More">
                <button className="action-button">
                  <EllipsisOutlined />
                </button>
              </Tooltip>
            </div>

            {/* Description */}
            <div>
              <Typography.Title level={5}>Description</Typography.Title>
              <Typography.Paragraph type="secondary">
                {selectedTask?.description || "Add a description..."}
              </Typography.Paragraph>
            </div>

            {/* Child Issues Section */}
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
                        marginBottom: "5px", // Thêm khoảng cách giữa các subtasks
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span>{subtask.name}</span> {/* Hiển thị tên subtask */}
                        <span>{subtask.description}</span>{" "}
                        {/* Hiển thị mô tả nếu có */}
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
                          value={selectedTask?.status}
                          style={{
                            width: 120,
                          }}
                          options={[
                            {
                              value: "progress",
                              label: "progress",
                            },
                            {
                              value: "completed",
                              label: "completed",
                            },
                            {
                              value: "pending",
                              label: "pending",
                            },
                          ]}
                        />
                        {/* Hiển thị trạng thái */}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Activity Section */}
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
                        <div style={{ display: "flex", gap: "12px" }}>
                          <Avatar style={{ backgroundColor: "#1890ff" }}>
                            U
                          </Avatar>
                          <div style={{ flex: 1 }}>
                            <Input.TextArea
                              placeholder="Add a comment..."
                              rows={2}
                            />
                            <div className="quick-actions">
                              <button className="quick-action-btn">
                                👍 Looks good!
                              </button>
                              <button className="quick-action-btn">
                                ⚡ Need help?
                              </button>
                              <button className="quick-action-btn">
                                🛑 This is blocked...
                              </button>
                              <button className="quick-action-btn">
                                ❓ Can you clarify...?
                              </button>
                            </div>
                          </div>
                        </div>
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

          {/* Sidebar */}
          <div className="sidebar">
            <div className="field-group">
              <div className="field-label">Assignee</div>
              <div className="field-value">
                <Avatar size="small">U</Avatar>
                <span>Unassigned</span>
              </div>
            </div>

            <div className="field-group">
              <div className="field-label">Labels</div>
              <div className="field-value">None</div>
            </div>

            <div className="field-group">
              <div className="field-label">Parent</div>
              <div className="field-value">None</div>
            </div>

            <div className="field-group">
              <div className="field-label">Team</div>
              <div className="field-value">None</div>
            </div>

            <div className="field-group">
              <div className="field-label">Reporter</div>
              <div className="field-value">
                <Avatar size="small" style={{ backgroundColor: "#1890ff" }}>
                  T
                </Avatar>
                <span>Truong Anh Tu (FGW HN)</span>
              </div>
            </div>

            <div
              style={{ fontSize: "12px", color: "#6B778C", marginTop: "24px" }}
            >
              <div>Created 2 days ago</div>
              <div>Updated 2 days ago</div>
              <div>Resolved 2 days ago</div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TableListView;
