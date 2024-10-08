import React, { useEffect, useState } from "react";
import { Card, Checkbox, Avatar, Popover, Button, Modal, Input } from "antd";
import {
  DeleteOutlined,
  CheckOutlined,
  FormOutlined,
  InfoCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import * as TaskService from "../../services/TaskService";
import avatar from "../../assets/avatar.jpg";
const { TextArea } = Input;
const TaskCardComponent = ({ task_id }) => {
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
  const [stateTask, setStateTask] = useState([]);
  useEffect(() => {
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
    fetchTaskData();
  }, [task_id]);
  //modal infor task
  const [isModalTaskInformation, setIsModalTaskInformation] = useState(false);
  const showModal = () => {
    setIsModalTaskInformation(true);
  };
  const handleCancelTaskInformation = () => {
    setIsModalTaskInformation(false);
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
            <Checkbox></Checkbox>
            <div>
              <div onClick={showModal}>{stateTask.name}</div>
              <div>{stateTask.dueDate}</div>
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
                />
              ))}
            </Avatar.Group>
            ,
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
        footer={[
          <Button key="cancel" onClick={handleCancelTaskInformation}>
            Cancel
          </Button>,
        ]}
        onCancel={handleCancelTaskInformation}
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
    </div>
  );
};

export default TaskCardComponent;
