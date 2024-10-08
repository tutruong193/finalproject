import React from "react";
import { Layout } from "antd";
import HeaderComponent from "../HeaderComponent/HeaderComponent";
import SiderComponent from "../SiderComponent/SiderComponent";
const DefaultComponent = ({ children, style }) => {
 
  return (
    <div style={{ overflow: "hidden" }}>
      <SiderComponent />
      <Layout style={style}>
        <HeaderComponent />
        {children}
      </Layout>
    </div>
  );
};

export default DefaultComponent;
