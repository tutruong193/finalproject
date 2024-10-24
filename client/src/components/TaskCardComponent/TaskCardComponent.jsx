import React, { useEffect, useState } from "react";
import {
  Card,
  Checkbox,
  Avatar,
  Popover,
  Button,
  Modal,
  Input,
  Form,
  Select,
  DatePicker,
} from "antd";
import {
  DeleteOutlined,
  CheckOutlined,
  FormOutlined,
  InfoCircleOutlined,
  CloseOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import * as TaskService from "../../services/TaskService";
import avatar from "../../assets/avatar.jpg";
import * as Message from "../../components/MessageComponent/MessageComponent";
import SubtaskComponent from "../SubtaskComponent/SubtaskComponent";
import { jwtTranslate } from "../../ultilis";
import { useCookies } from "react-cookie";
import dayjs from "dayjs";
import { useQueryClient } from "@tanstack/react-query";

// Bên trong component

const { TextArea } = Input;
const TaskCardComponent = ({ task_id, taskQuery }) => {
  const queryClient = useQueryClient();
  const [cookies, setCookie, removeCookie] = useCookies();
  const user = jwtTranslate(cookies.access_token);
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
  //fetch task data
  const [stateTask, setStateTask] = useState({ subtasks: [] });
  const fetchTaskData = async () => {
    try {
      const taskRes = await TaskService.getDetailTask(task_id);
      if (taskRes.status === "OK") {
        setStateTask(taskRes.data);
      } else {
        console.error("Error fetching task details");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchTaskData();
  }, [task_id]);
  // Modal for task information
  const [isModalTaskInformation, setIsModalTaskInformation] = useState(false);
  const showModal = () => {
    setIsModalTaskInformation(true);
  };
  const handleCancelTaskInformation = () => {
    setIsModalTaskInformation(false);
  };
  // Modal for adding subtask
  const [isSubtaskModalVisible, setIsSubtaskModalVisible] = useState(false);
  const [formSubtask] = Form.useForm();
  const options = [];
  if (stateTask?.assignees) {
    // Sử dụng members thay vì membersID
    for (let i = 0; i < stateTask?.assignees.length; i++) {
      options.push({
        value: stateTask?.assignees[i].userId, // ID thành viên
        label: stateTask?.assignees[i].name, // Tên thành viên
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
        const assignee = stateTask.assignees.find((a) => a.userId === userId);
        return { userId: assignee.userId, name: assignee.name };
      });
      // Thêm subtask mới với thông tin đầy đủ của assignees
      const newSubtask = {
        ...values,
        assignees: selectedAssignees, // Lưu cả ID và tên
      };
      const res = await TaskService.addSubTask(task_id, newSubtask);
      if (res.status === "OK") {
        Message.success(res.message);
        formSubtask.resetFields();
        setIsSubtaskModalVisible(false);
        fetchTaskData();
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
  ///delelte task
  const handleDeleteTask = async () => {
    const res = await TaskService.deleteTask(task_id);
    if (res.status === "OK") {
      Message.success();
      taskQuery.refetch();
    } else if (res.status === "ERR") {
      Message.error(res.message);
    }
  };
  //change status subtask
  const HandleChangeStatus = async () => {
    try {
      const res = await TaskService.updateStatusTask(task_id, user.id);
      if (res.status === "OK") {
        Message.success("Task status updated successfully!");
        taskQuery.refetch(); // Refetch lại dữ liệu sau khi cập nhật
        queryClient.invalidateQueries(["tasks"])
      } else {
        Message.error(res.message);
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      Message.error("An error occurred while updating the task status.");
    }
  };
  return (
    <div>
      <Card
        style={{
          width: "100%",
          borderRadius: "10px",
          borderLeft: `solid 5px ${
            tags.find((tag) => tag.status === stateTask.status)?.color
          }`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignContent: "center",
          }}
        >
          <div style={{ display: "flex", gap: "20px" }}>
            <Checkbox
              checked={stateTask.status === "completed"}
              onChange={() => HandleChangeStatus(task_id)}
            ></Checkbox>
            <div>
              <div onClick={showModal}>{stateTask.name}</div>
              <div>
                {dayjs(stateTask.dueDate).local().format("HH:mm DD-MM-YYYY")}
              </div>
            </div>
          </div>
          <div>
            <Avatar.Group
              max={{
                count: 3,
                style: {
                  color: "#f56a00",
                  backgroundColor: "#fde3cf",
                },
              }}
            >
              {stateTask?.assignees?.map((member) => (
                <Avatar
                  key={member.userId}
                  src={member.avatar || avatar}
                  alt={member.name}
                  title={member.name}
                />
              ))}
            </Avatar.Group>
          </div>
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignContent: "center",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                height: "fit-content",
                width: "fit-content",
                padding: "5px 20px",
                backgroundColor:
                  tags.find((tag) => tag.status === stateTask.status)
                    ?.backgroundColor || "gray",
                color:
                  tags.find((tag) => tag.status === stateTask.status)?.color ||
                  "white",
                marginRight: "5px",
              }}
            >
              {stateTask.status || "none"}
            </div>
            <div
              style={{
                display: "flex",
                gap: "15px",
                alignContent: "center",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <CheckOutlined />
                {
                  stateTask?.assignees?.filter(
                    (assignee) => assignee.status === "completed"
                  )?.length
                }
                /{stateTask?.assignees?.length}
              </div>
              <div style={{ fontSize: "20px" }}>
                <Popover
                  content={
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <Button
                        type="text"
                        icon={<FormOutlined />}
                        style={{
                          textAlign: "left",
                          padding: 0,
                          justifyContent: "flex-start",
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        style={{
                          textAlign: "left",
                          padding: 0,
                          justifyContent: "flex-start",
                        }}
                        onClick={handleDeleteTask}
                      >
                        Delete
                      </Button>
                    </div>
                  }
                  trigger="click"
                >
                  <InfoCircleOutlined />
                </Popover>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <Modal
        title="Task Information"
        open={isModalTaskInformation}
        onCancel={handleCancelTaskInformation}
        footer=""
        // onOk={handleSaveTaskInformation}
      >
        <div className="task-details">
          <div className="task-item">
            <span className="task-label">Tên công việc:</span> {stateTask.name}
          </div>
          <div className="task-item">
            <span className="task-label">Trạng thái:</span> {stateTask.status}
          </div>
          <div className="task-item">
            <span className="task-label">Ưu tiên:</span> {stateTask.priority}
          </div>
          <div className="task-item">
            <span className="task-label">Hạn chót:</span> {stateTask.dueDate}
          </div>
          <div className="task-item">
            <span className="task-label">Người thực hiện:</span>
            <ul className="task-assignees">
              {stateTask?.assignees?.map((assignee) => (
                <li key={assignee.userId} className="assignee-item">
                  <Avatar
                    src={assignee.avatar || avatar}
                    alt={assignee.name}
                    title={assignee.name}
                    style={{ marginRight: "10px" }}
                  />
                  <span className="assignee-name">{assignee.name}</span>
                  <span
                    className={`status-icon ${
                      assignee.status === "completed" ? "completed" : "progress"
                    }`}
                  >
                    {assignee.status === "completed" ? (
                      <CheckOutlined />
                    ) : (
                      <CloseOutlined />
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div
            className="task-item"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <div style={{ display: "flex", flexDirection: "row" }}>
              <span className="task-label">
                Subtasks:{" "}
                {stateTask.status !== "completed" && (
                  <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={showSubtaskModal}
                    style={{ marginTop: "10px" }}
                  >
                    Add Subtask
                  </Button>
                )}
              </span>
            </div>
            <div className="task-subtasks">
              {stateTask.subtasks.length > 0 ? (
                <SubtaskComponent
                  subtaskslist={stateTask.subtasks}
                  task_id={task_id}
                  onSubtaskDeleted={fetchTaskData}
                />
              ) : (
                <li>No subtasks</li>
              )}
            </div>
          </div>
        </div>
        <div className="comment-section">
          <h4>Comments</h4>
          <div className="comment-list">
            <p>
              <strong>User 1:</strong> This is a sample comment.
            </p>
            <p>
              <strong>User 2:</strong> Another comment here.
            </p>
          </div>
          <div className="comment-input">
            <TextArea rows={4} />
            <Button type="primary" style={{ marginTop: "10px" }}>
              Submit
            </Button>
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

export default TaskCardComponent;
