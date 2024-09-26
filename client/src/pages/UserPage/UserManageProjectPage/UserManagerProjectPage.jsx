import React, { useState, useRef, useEffect } from "react";
import {
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Input, Button, Row, Col, Modal, Form, DatePicker, Tag } from "antd";
import ProjectCardComponent from "../../../components/ProjectCardComponent/ProjectCardComponent";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import * as ProjectService from "../../../services/ProjectService";
import { jwtTranslate } from "../../../ultilis";

const UserManagerProjectPage = () => {
  const { RangePicker } = DatePicker;
  const [cookiesAccessToken, setCookieAccessToken, removeCookie] =
    useCookies("");
  const infoUser = jwtTranslate(cookiesAccessToken.access_token);
  const navigate = useNavigate();
  const goTaskPage = () => navigate("/task-page");
  
  // Fetch projects
  const fetchProjectAll = async () => {
    const res = await ProjectService.getAllProject();
    return res;
  };
  
  const projectQuerry = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjectAll,
    config: { retry: 3, retryDelay: 1000 },
  });
  
  const { data: projects } = projectQuerry;
  const dataProject = projects?.data?.filter(
    (project) => project.managerID == infoUser?.id
  );

  // Modal add project
  const [isModalAddProject, setIsModalAddProject] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  const showModalAddProject = () => {
    setIsModalAddProject(true);
  };

  const handleCancelAddProject = () => {
    setIsModalAddProject(false);
  };

  const handleAddProject = async () => {
    setIsModalAddProject(false);
  };

  // Show input when "+" is clicked
  const showInput = () => {
    setInputVisible(true);
    inputRef.current?.focus();
  };

  // Handle adding member tag
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && !selectedMembers.includes(inputValue)) {
      setSelectedMembers([...selectedMembers, inputValue]);
    }
    setInputVisible(false);
    setInputValue("");
  };

  const handleRemoveMember = (removedMember) => {
    setSelectedMembers(selectedMembers.filter((member) => member !== removedMember));
  };

  // Focus input when visible
  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

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
            onClick={showModalAddProject}
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
          {dataProject?.map((project) => (
            <Col key={project._id} span={6}>
              <ProjectCardComponent
                add_dated={new Date(project.startDate).toLocaleDateString()}
                project_name={project.name}
                project_decription={project.description}
                status={project.status}
                onClick={goTaskPage}
              />
            </Col>
          ))}
        </Row>
      </div>
      <Modal
        title="Add a new project"
        open={isModalAddProject}
        onOk={handleAddProject}
        onCancel={handleCancelAddProject}
      >
        <Form
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          autoComplete="off"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input the project name!" }]}
          >
            <Input name="name" />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            label="Start at:"
            name="startdate"
            rules={[{ required: true, message: "Please select the start date!" }]}
          >
            <DatePicker />
          </Form.Item>

          <Form.Item
            label="End at:"
            name="enddate"
            rules={[{ required: true, message: "Please select the end date!" }]}
          >
            <DatePicker />
          </Form.Item>

          {/* Add Members Section */}
          <Form.Item label="Members">
            {selectedMembers.map((member) => (
              <Tag
                key={member}
                closable
                onClose={() => handleRemoveMember(member)}
              >
                {member}
              </Tag>
            ))}
            {inputVisible ? (
              <Input
                ref={inputRef}
                type="text"
                size="small"
                style={{
                  width: 100,
                }}
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputConfirm}
                onPressEnter={handleInputConfirm}
              />
            ) : (
              <Tag
                onClick={showInput}
                style={{ background: "#fff", borderStyle: "dashed" }}
              >
                <PlusOutlined /> Add Member
              </Tag>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagerProjectPage;
