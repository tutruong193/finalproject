import React from "react";
import avatar from "../../assets/avatar.jpg";
import {
  EllipsisOutlined,
  LikeOutlined,
  DislikeOutlined,
  CommentOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import "./style.css"; // Import file CSS

const PostComponent = () => {
  const images = [avatar]; // Add more image paths as needed

  return (
    <div
      style={{ width: "100%", backgroundColor: "white", borderRadius: "15px" }}
    >
      <div style={{ padding: "10px 10px 0 10px" }}>
        <div className="header">
          <div className="header-info">
            <img
              src={avatar}
              style={{ width: "40px", height: "40px", borderRadius: "50%" }}
            />
            <span style={{ fontWeight: 550, fontSize: "14px" }}>
              Truong Anh Tu
            </span>
            <span style={{ fontWeight: 100, fontSize: "11px", opacity: 0.5 }}>
              10 minutes ago
            </span>
          </div>
          <div className="header-action">
            <EllipsisOutlined />
          </div>
        </div>
        <div className="title">
          <p style={{ fontSize: "14px" }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem
            ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
        <div className="images">
          {images.length === 1 && (
            <img src={images[0]} className="single-image" />
          )}
          {images.length > 1 && (
            <div className="multiple-images">
              <img src={images[0]} className="first-image" />
              <img src={images[1]} className="second-image" />
            </div>
          )}
        </div>
        <div className="action">
          <Button
            size="small"
            shape="round"
            icon={<LikeOutlined />}
          >
            Like
          </Button>
          <Button size="small" shape="round" icon={<DislikeOutlined />}>
            Dislike
          </Button>
          <Button size="small" shape="round" icon={<CommentOutlined />}>
            Comment
          </Button>
          <Button size="small" shape="round" icon={<ShareAltOutlined />}>
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostComponent;
