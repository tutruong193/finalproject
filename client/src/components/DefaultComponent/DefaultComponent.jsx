import React from "react";
import { Layout } from "antd";
import SiderComponent from "../SiderComponent/SiderComponent"; // Import SiderComponent

const DefaultComponent = ({ children }) => {
  return (
    <div>
      <Layout style={{ minHeight: "100vh" }}>
        <SiderComponent /> {/* Sử dụng SiderComponent */}
        <Layout style={{ marginLeft: "15%" }}> {/* Đẩy content bên phải sang bên phải Sider */}
          {children}
        </Layout>
      </Layout>
    </div>
  );
};

export default DefaultComponent;
