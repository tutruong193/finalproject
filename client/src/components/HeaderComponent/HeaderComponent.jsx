import React, { useEffect, useState } from "react";
import {
  MenuUnfoldOutlined,
  UserOutlined,
  SearchOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Input } from "antd";
import { useCookies } from "react-cookie";
import { jwtTranslate } from "../../ultilis";
import * as UserService from "../../services/UserService";
import { Popover } from "antd";
import { useNavigate } from "react-router-dom";
import LogoComponent from "../LogoComponent/LogoComponent";
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
      <LogoComponent />
      <div className="container-header-right">
        <Input placeholder="default size" prefix={<SearchOutlined />} />
        <div className="header-icon">
          <BellOutlined style={{ fontSize: "20px" }} />
        </div>
        <Popover
          placement="bottomRight"
          trigger={"hover"}
          title={`Welcome, ${stateUser?.name}!`}
          content={content}
        >
          <div className="header-icon">
            <Avatar icon={<UserOutlined />} size={30} />
          </div>
        </Popover>
      </div>
    </div>
  );
};

export default HeaderComponent;
