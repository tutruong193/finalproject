import React, { useState } from "react";
import SiderComponent from "../../components/SiderComponent/SiderComponent";
import { BellOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import UserManagerProjectPage from "./UserManageProjectPage/UserManagerProjectPage";
import UserNotificationPage from "./UserNotificationPage/UserNotificationPage";
import UserProjectPage from "./UserProjectPage/UserProjectPage";
const UserPage = () => {
  const [selectedKey, setSelectedKey] = useState("user_manage_project");
  const items = [
    {
      key: "user_manage_project",
      icon: <SearchOutlined />,
      label: "Manage Project",
    },
    {
      key: "user_project",
      icon: <SearchOutlined />,
      label: "Project",
    },
    {
      key: "user_notification",
      icon: <BellOutlined />,
      label: "Notification",
    },
  ];
  const renderPage = (key) => {
    switch (key) {
      case "user_manage_project":
        return <UserManagerProjectPage />;
      case "user_notification":
        return <UserNotificationPage />;
      case "user_project":
        return <UserProjectPage />;
      default:
        return <></>;
    }
  };
  return (
    <div style={{ width: "100%" }}>
      <SiderComponent
        items={items}
        defaultSelectedKeys="user_manage_project"
        setSelectedKey={setSelectedKey}
      />
      <div style={{ flex: 1, minHeight: "100vh" }}>
        {renderPage(selectedKey)}
      </div>
    </div>
  );
};

export default UserPage;
