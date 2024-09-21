import React from "react";
import { Card, Checkbox, Avatar } from "antd";
import { DeleteOutlined, CheckOutlined, FormOutlined } from "@ant-design/icons";
const TaskCardComponent = ({ task_name, task_date, status }) => {
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
    <Card
      style={{
        width: "100%",
        borderRadius: "10px",
        borderLeft: `solid 5px ${
          tags.find((tag) => tag.status === status)?.color
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
            <div>{task_name}</div>
            <div>{task_date}</div>
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
            <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=2" />
            <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=2" />
            <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=2" />
            <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=2" />
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
                tags.find((tag) => tag.status === status)?.backgroundColor ||
                "gray",
              color:
                tags.find((tag) => tag.status === status)?.color || "white",
              marginRight: "5px",
            }}
          >
            {status || "none"}
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
              8/12
            </div>
            <div style={{ fontSize: "18px" }}>
              <FormOutlined />
            </div>
            <div style={{ fontSize: "18px" }}>
              <DeleteOutlined />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TaskCardComponent;
