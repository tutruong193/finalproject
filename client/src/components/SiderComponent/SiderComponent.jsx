import React from "react";
import { Layout, Menu, Button } from "antd";
import LogoComponent from "../LogoComponent/LogoComponent";
const { Sider } = Layout;

const SiderComponent = ({ items, defaultSelectedKeys, setSelectedKey }) => {
  const handleMenuClick = (e) => {
    setSelectedKey(e.key);
  };
  return (
    <Sider width="17%" className="container-sider" collapsed={false}>
      <LogoComponent />
      <Menu
        defaultSelectedKeys={defaultSelectedKeys}
        mode="inline"
        items={items}
        className="custom-menu"
        onClick={handleMenuClick}
      />
    </Sider>
  );
};

export default SiderComponent;
