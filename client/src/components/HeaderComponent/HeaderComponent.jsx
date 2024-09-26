import React, { useEffect, useState } from "react";
import { MenuUnfoldOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button } from "antd";
import { useCookies } from "react-cookie";
import { jwtTranslate } from "../../ultilis";
import * as UserService from "../../services/UserService";
import { Popover } from "antd";
import { useNavigate } from "react-router-dom";
const HeaderComponent = () => {
  const [cookiesAccessToken, setCookieAccessToken] = useCookies("");
  const accessToken = cookiesAccessToken.access_token;
  const navigate = useNavigate();
  const [stateUser, setStateUser] = useState({
    name: "",
    email: "",
    password: "",
    role: [],
  });
  useEffect(() => {
    const fetchDataUser = async () => {
      try {
        const res = await UserService.getDetailsUser(
          jwtTranslate(accessToken)?.id
        );
        setStateUser(res?.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchDataUser();
  }, [accessToken]);
  const handleProfileClick = () => {
    // Điều hướng đến trang profile
    console.log("Navigate to profile page");
  };
  const handleLogoutClick = async () => {
    await UserService.logoutUser();
    navigate("/login");
    window.location.reload();
  };
  const content = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "10px",
        textAlign: "center",
      }}
    >
      <Avatar
        icon={<UserOutlined />}
        size={60}
        style={{ marginBottom: "10px" }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "5px",
        }}
      >
        <Button
          type="link"
          onClick={handleProfileClick}
          style={{ color: "#1890ff" }}
        >
          Profile
        </Button>
        <Button
          type="link"
          onClick={handleLogoutClick}
          style={{ color: "#1890ff" }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
  return (
    <div className="container-header">
      <div style={{ fontSize: "20px" }}>
        <MenuUnfoldOutlined />
      </div>
      <Popover
        placement="bottomRight"
        trigger={"hover"}
        title={`Welcome, ${stateUser?.name}!`}
        content={content}
      >
        <div className="container-avatar">
          <div>
            <Avatar icon={<UserOutlined />} size={35} />
          </div>
          <div>
            <div style={{ fontWeight: 500 }}>Welcome, {stateUser?.name}</div>
            {stateUser?.role.length > 0 && (
              <div style={{ fontSize: "11px" }}>
                {stateUser.role.join(", ")}
              </div>
            )}
          </div>
        </div>
      </Popover>
    </div>
  );
};

export default HeaderComponent;
