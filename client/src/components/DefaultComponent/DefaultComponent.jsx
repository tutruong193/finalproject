import React from "react";
import { Layout } from "antd";

const DefaultComponent = ({ children }) => {
  return (
    <div>
      <Layout style={{ minHeight: "100vh" }}>
        <Layout style={{ marginLeft: "17%", display: 'flex', flexDirection: 'column' }}> {/* Đẩy content bên phải sang bên phải Sider */}
          header
          {children}
        </Layout>
      </Layout>
    </div>
  );
};

export default DefaultComponent;
