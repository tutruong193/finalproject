import React from "react";
import {
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Input, Button, Row, Col } from "antd";
import "./UserManagerProjectPage.css";
import ProjectCardComponent from "../../../components/ProjectCardComponent/ProjectCardComponent";
import { useNavigate } from "react-router-dom";
const UserManagerProjectPage = () => {
  const navigate = useNavigate();
  const goTaskPage = () => navigate("/task-page");
  return (
    <div style={{ minHeight: "100vh", margin: "20px" }}>
      <h2 style={{ fontSize: "18px", paddingBottom: "20px" }}>Projects</h2>
      <div>
        <div className="container_action">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{
              color: "#038edc",
              backgroundColor: "rgba(3, 142, 220, .1)",
            }}
          >
            Add project
          </Button>
          <div className="container_action_right">
            <Input placeholder="default size" prefix={<SearchOutlined />} />
            <Button
              type="primary"
              icon={<FilterOutlined />}
              style={{
                color: "#038edc",
                backgroundColor: "rgba(3, 142, 220, .1)",
                padding: "0.5rem",
              }}
            />
          </div>
        </div>
        <Row className="container_all_projects">
          <Col span={6}>
            <ProjectCardComponent
              add_dated="21 Jan, 2021"
              project_name="Project"
              project_decription="Every Marketing Plan Needs"
              status="pending"
              onClick={goTaskPage}
            />
          </Col>
          <Col span={6}>
            <ProjectCardComponent
              add_dated="21 Jan, 2021"
              project_name="Project"
              project_decription="Every Marketing Plan Needs"
              status="completed"
            />
          </Col>
          <Col span={6}>
            <ProjectCardComponent
              add_dated="21 Jan, 2021"
              project_name="Project"
              project_decription="Every Marketing Plan Needs"
              status="progress"
            />
          </Col>
          <Col span={6}>
            <ProjectCardComponent
              add_dated="21 Jan, 2021"
              project_name="Project"
              project_decription="Every Marketing Plan Needs"
              status="pending"
            />
          </Col>
          <Col span={6}>
            <ProjectCardComponent
              add_dated="21 Jan, 2021"
              project_name="Project"
              project_decription="Every Marketing Plan Needs"
              status="pending"
            />
          </Col>
          <Col span={6}>
            <ProjectCardComponent
              add_dated="21 Jan, 2021"
              project_name="Project"
              project_decription="Every Marketing Plan Needs"
              status="pending"
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default UserManagerProjectPage;
