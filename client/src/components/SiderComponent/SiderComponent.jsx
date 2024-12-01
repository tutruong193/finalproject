import React, { useState } from "react";
import { Layout, Menu, Modal, Switch, message } from "antd";
import {
  ReadOutlined,
  SearchOutlined,
  UserOutlined,
  TableOutlined,
  UnorderedListOutlined,
  ProjectOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { useCookies } from "react-cookie";
import { jwtTranslate } from "../../ultilis";
import { useNavigate } from "react-router-dom";

const { Sider } = Layout;

const SiderComponent = () => {
  const navigate = useNavigate();
  const [cookiesAccessToken] = useCookies("");
  const infoUser = jwtTranslate(cookiesAccessToken.access_token);
  const isManager = infoUser?.role?.includes("manager");
  const isAdmin = infoUser?.role?.includes("admin");
  const defaultSelectedKey = isAdmin ? "admin_dashboard" : "user_project_board";
  const items = isAdmin
    ? [
        {
          key: "admin_dashboard",
          icon: <DashboardOutlined />,
          label: "Dashboard",
        },
        {
          key: "admin_account",
          icon: <UserOutlined />,
          label: "Account",
        },
        {
          key: "admin_project",
          icon: <ProjectOutlined />,
          label: "Project",
        },
        {
          key: "admin_notification",
          icon: <ReadOutlined />,
          label: "Activity",
        },
      ]
    : [
        {
          icon: <ProjectOutlined />,
          label: isManager ? "Manage Project" : "Project",
          type: "group",
          children: [
            {
              key: "user_project_board",
              label: "Board",
              icon: <TableOutlined />,
            },
            {
              key: "user_project_list",
              label: "List",
              icon: <UnorderedListOutlined />,
            },
          ], // Loại bỏ các mục không hiển thị
        },
      ];

  // Xử lý khi người dùng click vào menu
  const handleMenuClick = (e) => {
    switch (e.key) {
      case "admin_account":
        navigate("/system/admin/account");
        break;
      case "admin_project":
        navigate("/system/admin/project");
        break;
      case "admin_notification":
        navigate("/system/admin/activity");
        break;
      case "admin_dashboard":
        navigate("/system/admin/dashboard");
        break;
      case "user_project_board":
        navigate("/system/user/project/board");
        break;
      case "user_project_list":
        navigate("/system/user/project/list");
        break;
      default:
        break;
    }
  };

  return (
    <Sider width="17%" className="container-sider" collapsed={false}>
      <div style={{ height: "70px" }}></div>
      <Menu
        defaultSelectedKeys={defaultSelectedKey}
        mode="inline"
        items={items}
        className="custom-menu"
        onClick={handleMenuClick}
      />
    </Sider>
  );
};

export default SiderComponent;
