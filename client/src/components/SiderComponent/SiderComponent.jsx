import React from "react";
import { Layout, Menu, Button } from "antd";
import LogoComponent from "../LogoComponent/LogoComponent";
import "./style.css"; // Import file CSS

const { Sider } = Layout;

const SiderComponent = ({items, defaultSelectedKeys, setSelectedKey}) => {
  const handleMenuClick = (e) => {
    setSelectedKey(e.key); 
  };
  return (
    <Sider width="17%" className="custom-sider" collapsed={false}>
      <div className="logo-menu-container">
        <LogoComponent />
        <Menu
          defaultSelectedKeys={defaultSelectedKeys}
          mode="inline"
          items={items}
          className="custom-menu"
          onClick={handleMenuClick}
        />
      </div>
      <div className="button-container">
        <Button type="primary">Other</Button>
      </div>
    </Sider>
  );
};

export default SiderComponent;
