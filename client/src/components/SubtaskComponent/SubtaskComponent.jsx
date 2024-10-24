import React, { useEffect, useState } from "react";
import { Card, Checkbox, Avatar, Popover, Button, Input } from "antd";
import { DeleteOutlined, CheckOutlined } from "@ant-design/icons";
import * as TaskService from "../../services/TaskService";
import avatar from "../../assets/avatar.jpg";
import * as Message from "../../components/MessageComponent/MessageComponent";
import { jwtTranslate } from "../../ultilis";
import { useCookies } from "react-cookie";
const SubtaskComponent = ({ subtaskslist, task_id, onSubtaskDeleted }) => {
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
  
  //deleteSubtask
  const handleDeleteSubTask = async (subtaskId) => {
    const newStatus = !subtaskCheckboxes[subtaskId];
    const res = await TaskService.deleteSubTask(task_id, subtaskId);
    if (res.status === "OK") {
      Message.success();
      setSubtaskCheckboxes((prev) => ({
        ...prev,
        [subtaskId]: newStatus, // Update checkbox status
      }));
      onSubtaskDeleted();
    } else if (res.status === "ERR") {
      Message.error(res.message);
      setSubtaskCheckboxes((prev) => ({
        ...prev,
        [subtaskId]: !newStatus, // Reset to previous status
      }));
    }
  };
  //set check box với những cái nào đã completed
  const [subtaskCheckboxes, setSubtaskCheckboxes] = useState(
    subtaskslist.reduce((acc, subtask) => {
      acc[subtask._id] = subtask.status === "completed"; // Initialize checkbox based on subtask status
      return acc;
    }, {})
  );
  //change status subtask
  const HandleChangeStatus = async (subtaskId) => {
    const res = await TaskService.updateStatusSubtask(task_id, subtaskId, user.id);
    if (res.status === "OK") {
      Message.success();
      onSubtaskDeleted();
    } else if (res.status === "ERR") {
      Message.error(res.message);
    }
  };
  return (
    <div>
      {subtaskslist?.length > 0 ? (
        subtaskslist.map((subtask) => (
          <Card
            key={subtask._id}
            style={{
              width: "100%",
              borderRadius: "10px",
              borderLeft: `solid 5px ${
                tags.find((tag) => tag.status === subtask.status)?.color
              }`,
              height: "fit-content",
            }}
            bodyStyle={{
              padding: "10px", // Thay đổi giá trị padding ở đây
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignContent: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Checkbox
                  onChange={() => HandleChangeStatus(subtask._id)}
                  checked={subtaskCheckboxes[subtask._id]}
                ></Checkbox>
                <div>{subtask.name}</div>
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
                  {subtask?.assignees?.map((member) => (
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
                      tags.find((tag) => tag.status === subtask.status)
                        ?.backgroundColor || "gray",
                    color:
                      tags.find((tag) => tag.status === subtask.status)
                        ?.color || "white",
                    marginRight: "5px",
                  }}
                >
                  {subtask.status || "none"}
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
                      subtask?.assignees?.filter(
                        (assignee) => assignee.status === "completed"
                      )?.length
                    }
                    /{subtask?.assignees?.length}
                  </div>
                  <div style={{ fontSize: "20px" }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {subtask.status !== "completed" && (
                        <Button
                          type="text"
                          icon={<DeleteOutlined />}
                          style={{
                            textAlign: "left",
                            padding: 0,
                            justifyContent: "flex-start",
                          }}
                          onClick={() => handleDeleteSubTask(subtask._id)}
                        ></Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))
      ) : (
        <div>No subtask</div>
      )}
    </div>
  );
};

export default SubtaskComponent;
