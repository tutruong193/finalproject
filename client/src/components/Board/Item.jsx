import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import dayjs from "dayjs";
import {
  Select,
  Radio,
  Avatar,
  Modal,
  Button,
  Typography,
  Tabs,
  Input,
  Tooltip,
  Checkbox,
  Form,
  DatePicker,
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
import { jwtTranslate } from "../../ultilis";
import { useCookies } from "react-cookie";
import * as Message from "../../components/MessageComponent/MessageComponent";
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
const { Text } = Typography;
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
const Item = ({ item, index, fetchAllData }) => {
  const [cookiesAccessToken] = useCookies("");
  const infoUser = jwtTranslate(cookiesAccessToken.access_token);
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
  //change status task
  const onChangeStatusTask = async (value) => {
    const res = await TaskService.updateStatusTask(
      selectedTask._id,
      infoUser.id,
      value
    );
    if (res.status === "OK") {
      Message.success();
      fetchTaskData(selectedTask._id);
      fetchAllData()
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
    for (let i = 0; i < selectedTask?.assignees.length; i++) {
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
        fetchTaskData(selectedTask._id);
        fetchAllData(); // Cập nhật lại thông tin của task để hiển thị trạng thái mới của subtask
      } else {
        Message.error(res.message);
      }
    } catch (error) {
      console.error("Error updating subtask status:", error);
      Message.error("Failed to update subtask status");
    }
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
      <Modal
        title="Add Subtask"
        open={isSubtaskModalVisible}
        onCancel={handleCancelSubtaskModal}
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
            label="Priority"
            name="priority"
            rules={[{ required: true, message: "Please select the due date!" }]}
          >
            <Radio.Group onChange={handleChangePriority} value={piorityValue}>
              {itemPriority.map((item) => (
                <Radio value={item.value}>{item.label}</Radio>
              ))}
            </Radio.Group>
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
    </div>
  );
};

export default Item;
