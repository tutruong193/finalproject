import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import dayjs from "dayjs";
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
  Checkbox,
} from "antd";
import * as TaskService from "../../services/TaskService";
import {
  DownOutlined,
  PaperClipOutlined,
  PlusOutlined,
  LinkOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import relativeTime from "dayjs/plugin/relativeTime";
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
const { Title, Text } = Typography;
const Item = ({ item, index }) => {
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
    setIsModalTaskInformation(true);
  };
  const handleCancelTaskInformation = () => {
    setSelectedTask(null);
    setIsModalTaskInformation(false);
  };
  return (
    <div>
      <Draggable draggableId={item._id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`task-card ${snapshot.isDragging ? "dragging" : ""}`}
          >
            <div className="task-name" onClick={() => showModal(item._id)}>
              {item.name}
            </div>
            <div className="task-header">
              <Checkbox />
              <Text className="task-id">TASK</Text>
            </div>
            <div
              style={{
                width: "100%",
                justifyContent: "flex-end",
                display: "flex",
              }}
            >
              {item.dueDate && (
                <div className="task-date">
                  {dayjs(item.dueDate).format("DD MMM")}
                </div>
              )}
            </div>
          </div>
        )}
      </Draggable>
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
              className={`status-select ${selectedTask?.status}`}
              options={[
                {
                  value: "progress",
                  label: "Progress",
                },
                {
                  value: "completed",
                  label: "Completed",
                },
                {
                  value: "pending",
                  label: "Pending",
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
                          className={`status-select ${subtask?.status}`}
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
    </div>
  );
};

export default Item;
