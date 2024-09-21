import React from "react";
import logoImage from "../../assets/logo.png"; // Đảm bảo đường dẫn đúng tới ảnh logo
import "./style.css"; // Import file CSS

const LogoComponent = () => {
  return (
    <div className="logo-container">
      <img src={logoImage} alt="GymMate Logo" className="logo-image" />
      <div className="logo-text">TaskFlow</div>
    </div>
  );
};

export default LogoComponent;
