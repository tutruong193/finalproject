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
const ModelDetailTask = (selectedTask, isModalTaskInformation) => {
    
  return (
    <div>
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
    </div>
  );
};

export default ModelDetailTask;
