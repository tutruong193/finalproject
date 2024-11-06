import React, { useState } from "react";
import { Layout, Menu, Modal, Switch, message } from "antd";
import {
  BellOutlined,
  SearchOutlined,
  UserOutlined,
  TableOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
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
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);

  // Trạng thái cho view settings
  const [viewSettings, setViewSettings] = useState({
    board: true,
    list: true,
  });

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
            viewSettings.board && {
              key: "user_project_board",
              label: "Board",
              icon: <TableOutlined />,
            },
            viewSettings.list && {
              key: "user_project_list",
              label: "List",
              icon: <UnorderedListOutlined />,
            },
          ].filter(Boolean), // Loại bỏ các mục không hiển thị
        },
        {
          key: "setting_view",
          icon: <BellOutlined />,
          label: "Setting View",
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
      case "user_project_board":
        navigate("/system/user/project/board");
        break;
      case "user_project_list":
        navigate("/system/user/project/list");
        break;
      case "setting_view":
        setIsSettingsVisible(true); // Hiển thị giao diện settings
        break;
      default:
        break;
    }
  };

  // Xử lý khi người dùng thay đổi trạng thái switch
  const handleSwitchChange = (key) => {
    const otherKey = key === "board" ? "list" : "board";

    // Kiểm tra xem có ít nhất một view đang bật không
    if (viewSettings[otherKey] || !viewSettings[key]) {
      // Thay đổi trạng thái view
      setViewSettings((prev) => ({ ...prev, [key]: !prev[key] }));

      // Nếu tắt view hiện tại
      if (!viewSettings[key]) {
        // Nếu không còn view nào bật, hiển thị thông báo và giữ view hiện tại
        if (!viewSettings[otherKey]) {
          message.warning("Phải có ít nhất một view được bật.");
          return; // Không thực hiện chuyển hướng
        }
        
        // Chuyển hướng sang view còn lại
        const newPath = `/system/user/project/${otherKey}`;
        navigate(newPath);
      }
    } else {
      // Hiển thị thông báo nếu không còn view nào
      message.warning("Phải có ít nhất một view được bật.");
    }
  };

  const handleCloseSettings = () => {
    setIsSettingsVisible(false);
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
      <Modal
        title="Settings"
        visible={isSettingsVisible}
        onCancel={handleCloseSettings}
        footer={null}
        width={400}
      >
        <div className="settings-container" style={{ padding: "0 16px" }}>
          {Object.keys(viewSettings).map((key) => (
            <div
              key={key}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 0",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <span className="anticon" style={{ fontSize: "20px", opacity: 0.65 }}>
                  {key === "board" ? <AppstoreOutlined /> : <UnorderedListOutlined />}
                </span>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 500 }}>{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                  <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
                    {key === "board" ? "View, track, and manage work" : "Manage work quickly like in a spreadsheet"}
                  </div>
                </div>
              </div>
              <Switch
                checked={viewSettings[key]}
                onChange={() => handleSwitchChange(key)}
              />
            </div>
          ))}
        </div>
      </Modal>
    </Sider>
  );
};

export default SiderComponent;
