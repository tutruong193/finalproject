import React from "react";
import { Layout } from "antd";
import SiderComponent from "../SiderComponent/SiderComponent"; // Import SiderComponent

const DefaultComponent = ({ children }) => {
  return (
    <div>
      <Layout>
        <SiderComponent /> {/* Sử dụng SiderComponent */}
        <Layout>{children}</Layout>
      </Layout>
    </div>
  );
};

export default DefaultComponent;
