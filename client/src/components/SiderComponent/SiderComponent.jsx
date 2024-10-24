import React, { useState } from "react";
import { Layout, Menu } from "antd";

import {
  BellOutlined,
  SearchOutlined,
  UserOutlined,
  TableOutlined,
  UnorderedListOutlined,
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
  const defaultSelectedKey = isAdmin ? "admin_account" : "user_project_board";

  // Xác định menu items dựa trên vai trò của người dùng
  const items = isAdmin
    ? [
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
          key: "admin_notification",
          icon: <BellOutlined />,
          label: "Notification",
        },
      ]
    : [
        {
          icon: <SearchOutlined />,
          label: isManager ? "Manage Project" : "Project",
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
          ],
        },

        {
          key: "user_notification",
          icon: <BellOutlined />,
          label: "Notification",
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
        navigate("/system/admin/notification");
        break;
      case "user_notification":
        navigate("/system/user/notification");
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
