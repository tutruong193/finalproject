import React from "react";
import logoImage from "../../assets/logo.png"; // Đảm bảo đường dẫn đúng tới ảnh logo
import { MenuFoldOutlined } from "@ant-design/icons";
const LogoComponent = () => {
  return (
    <div className="container-logo">
      <div style={{display: 'flex', alignItems: 'center'}}>
        <img src={logoImage} alt="GymMate Logo" className="logo-image" />
        <div className="logo-text">TaskFlow</div>
      </div>
      <div style={{fontSize: '20px'}}>
        <MenuFoldOutlined />
      </div>
    </div>
  );
};

export default LogoComponent;
