import React from "react";
import { Layout, Menu, Button } from "antd";
import {
  HomeOutlined,
  WechatWorkOutlined,
  BellOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import LogoComponent from "../LogoComponent/LogoComponent";
import "./style.css"; // Import file CSS

const { Sider } = Layout;

const SiderComponent = () => {
  const items = [
    {
      key: "1",
      icon: <HomeOutlined />,
      label: "Home",
    },
    {
      key: "2",
      icon: <SearchOutlined />,
      label: "Search",
    },
    {
      key: "3",
      icon: <UserOutlined />,
      label: "Profile",
    },
    {
      key: "4",
      icon: <WechatWorkOutlined />,
      label: "Message",
    },
    {
      key: "5",
      icon: <BellOutlined />,
      label: "Notification",
    },
  ];

  return (
    <Sider width="15%" className="custom-sider">
      <div className="logo-menu-container">
        <LogoComponent />
        <Menu
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
          className="custom-menu"
        />
      </div>
      <div className="button-container">
        <Button type="primary">Other</Button>
      </div>
    </Sider>
  );
};

export default SiderComponent;
