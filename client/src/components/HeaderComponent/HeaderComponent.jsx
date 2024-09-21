import React from "react";
import { MenuUnfoldOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
const HeaderComponent = () => {
  return (
    <div className='container-header'>
      <div style={{ fontSize: "20px" }}>
        <MenuUnfoldOutlined />
      </div>
      <div className='container-avatar' >
        <div>
          <Avatar icon={<UserOutlined />} size={35}/>
        </div>
        <div> 
          <div style={{fontWeight: 500}}>Jansh Wells</div>
          <div style={{fontSize: '11px'}}>Admintrator</div>
        </div>
      </div>
    </div>
  );
};

export default HeaderComponent;
