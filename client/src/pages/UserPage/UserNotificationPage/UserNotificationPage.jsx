import React, { useState } from "react";
import { ClockCircleOutlined } from "@ant-design/icons";
import { Timeline } from "antd";
const UserNotificationPage = () => {
  return (
    <div className="container-notification">
      <h2 style={{ fontSize: "18px", paddingBottom: "20px" }}>Notification</h2>
      <div className="container-timeline-background">
        <div className="timeline_container">
          <Timeline
            mode="left"
            items={[
              {
                label: "10-2-2012",
                children: "Create a services site 2015-09-01",
              },
              {
                children: "Solve initial network problems 2015-09-01",
              },
              {
                dot: (
                  <ClockCircleOutlined
                    style={{
                      fontSize: "16px",
                    }}
                  />
                ),
                color: "red",
                children: "Technical testing 2015-09-01",
              },
              {
                children: "Network problems being solved 2015-09-01",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default UserNotificationPage;
