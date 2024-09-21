import React from "react";
import { EllipsisOutlined } from "@ant-design/icons";
import { Card, Avatar } from "antd";
const ProjectCardComponent = ({
  add_dated,
  project_name,
  project_decription,
  status,
}) => {
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
      <Card
        title={<div>{add_dated}</div>}
        extra={<EllipsisOutlined />}
        actions={[
          <Avatar.Group
            max={{
              count: 2,
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
          </Avatar.Group>,
          <div
            style={{
              width: "fit-content",
              padding: "0px 20px",
              backgroundColor:
                tags.find((tag) => tag.status === status)?.backgroundColor ||
                "gray",
              color:
                tags.find((tag) => tag.status === status)?.color || "white",
              marginRight: "5px",
            }}
          >
            {status || "none"}
          </div>,
        ]}
      >
        <div>
          <div>{project_name}</div>
          <div>{project_decription}</div>
        </div>
      </Card>
    </div>
  );
};

export default ProjectCardComponent;
