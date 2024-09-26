import React from "react";
import { Layout } from "antd";
import HeaderComponent from "../HeaderComponent/HeaderComponent";

const DefaultComponent = ({ children, style }) => {
  return (
    <div style={{ overflow: "hidden" }}>
      <Layout style={style}>
        <HeaderComponent />
        {children}
      </Layout>
    </div>
  );
};

export default DefaultComponent;
