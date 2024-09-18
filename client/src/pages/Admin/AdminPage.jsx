import React, { useState } from "react";
import SiderComponent from "../../components/SiderComponent/SiderComponent";
import { BellOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import AccountPage from "./AccountPage/AccountPage";
import ProjectPage from "./ProjectPage/ProjectPage";
const AdminPage = () => {
  const [selectedKey, setSelectedKey] = useState("admin_account");
  const items = [
    {
      key: "admin_account",
      icon: <UserOutlined />,
      label: "Account",
    },
    {
      key: "admin_project",
      icon: <SearchOutlined />,
      label: "Project",
    },
    {
      key: "5",
      icon: <BellOutlined />,
      label: "Notification",
    },
  ];
  const renderPage = (key) => {
    switch (key) {
      case "admin_account":
        return <AccountPage />;
      case "admin_project":
        return <ProjectPage />;
      default:
        return <></>;
    }
  };
  console.log("selectedKey", selectedKey);
  return (
    <div style={{ width: "100%" }}>
      <SiderComponent
        items={items}
        defaultSelectedKeys="account"
        setSelectedKey={setSelectedKey}
      />
      <div style={{ flex: 1, minHeight: "100vh" }}>
        {renderPage(selectedKey)}
      </div>
    </div>
  );
};

export default AdminPage;
