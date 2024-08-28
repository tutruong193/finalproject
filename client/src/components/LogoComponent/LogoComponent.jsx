import React from "react";
import logoImage from "../../assets/biceps.png"; // Đảm bảo đường dẫn đúng tới ảnh logo
import "./style.css"; // Import file CSS

const LogoComponent = () => {
  return (
    <div className="logo-container">
      <div className="logo-text">GymMate</div>
      <img src={logoImage} alt="GymMate Logo" className="logo-image" />
    </div>
  );
};

export default LogoComponent;
