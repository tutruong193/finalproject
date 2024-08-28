import React from "react";
import "./style.css";
import PostComponent from "../../components/PostComponent/PostComponent";
import avatar from "../../assets/avatar.jpg";
const HomePage = () => {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        height: "1000vh",
        justifyContent: "center",
        backgroundColor: "rgb(236, 235, 235)",
      }}
    >
      <div className="container-content">
        <div className="content">
          <h2>Acitity Feed</h2>
          <div className="posting">
            <div className="posting-status">
              <img
                src={avatar}
                style={{ width: "40px", height: "40px", borderRadius: "50%" }}
              />
              <div
                style={{
                  width: "530px",
                  height: "40px",
                  borderRadius: "10px",
                  display: "flex",
                  backgroundColor: "rgb(236, 235, 235)",
                  alignItems: "center",
                  paddingLeft: "10px",
                }}
              >
                <span>What are you thinking ?</span>
              </div>
            </div>
          </div>
          <div className="post">
            <div className="post-mini">
              <PostComponent />
            </div>
            <div className="post-mini">
              <PostComponent />
            </div>
            <div className="post-mini">
              <PostComponent />
            </div>
            <div className="post-mini">
              <PostComponent />
            </div>
            <div className="post-mini">
              <PostComponent />
            </div>
          </div>
        </div>
        <div className="content-suggestion">a</div>
      </div>
    </div>
  );
};

export default HomePage;
