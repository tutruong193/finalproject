import React, { useEffect, useState } from "react";
import { Card, Checkbox, Avatar, Popover, Button, Input } from "antd";
import {
  DeleteOutlined,
  CheckOutlined,
  FormOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import * as TaskService from "../../services/TaskService";
import avatar from "../../assets/avatar.jpg";
import * as Message from "../../components/MessageComponent/MessageComponent";
const { TextArea } = Input;

const SubtaskComponent = ({ subtaskslist }) => {
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
  return (
    <div>
      {subtaskslist?.length > 0 ? (
        subtaskslist.map((subtask) => (
          <Card
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
                <Checkbox></Checkbox>
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
                    <Popover
                      content={
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
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
        ))
      ) : (
        <div>No subtask</div>
      )}
    </div>
  );
};

export default SubtaskComponent;
