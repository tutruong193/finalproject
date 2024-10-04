import React, { useEffect, useState } from "react";
import {
  EllipsisOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  Card,
  Avatar,
  Popover,
  Button,
  Popconfirm,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
} from "antd";
import { useNavigate } from "react-router-dom";
import * as ProjectService from "../../services/ProjectService";
import * as Message from "../../components/MessageComponent/MessageComponent";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
const ProjectCardComponent = ({ projectId, projectQuerry }) => {
  const navigate = useNavigate();
  const tags = [
    {
      status: "pending",
      color: "#f34e4e",
      backgroundColor: "rgba(243, 78, 78, .1)",
    },
    {
      status: "progress",
      color: "#f7cc53",
      backgroundColor: "rgba(247, 204, 83, .1)",
    },
    {
      status: "completed",
      color: "#51d28c",
      backgroundColor: "rgba(81, 210, 140, .1)",
    },
  ];
  const handleCardClick = () => {
    navigate(`/system/user/manager/project?projectId=${projectId}`);
  };
  // Hàm xử lý sự kiện Delete
  const handleDelete = async () => {
    try {
      const res = await ProjectService.deleteProject(projectId);
      if (res.status === "OK") {
        Message.success("Project deleted successfully");
        projectQuerry.refetch();
      } else {
        Message.error(res.message);
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
      Message.error("Failed to delete project");
    }
  };

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editedProjectData, setEditedProjectData] = useState({
    name: "",
    description: "",
    startDate: null,
    endDate: null,
    status: "",
  });
  useEffect(() => {
    const fetchDetailProject = async () => {
      const res = await ProjectService.getDetailProjectProject(projectId);
      setEditedProjectData(res.data);
    };
    fetchDetailProject();
  }, [projectId]);

  const handleEdit = () => {
    setIsEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    try {
      await ProjectService.updateProject(projectId, editedProjectData); // Gọi hàm cập nhật
      Message.success("Project updated successfully");
      projectQuerry.refetch(); // Gọi lại dữ liệu dự án
      setIsEditModalVisible(false);
    } catch (error) {
      console.error("Failed to update project:", error);
      Message.error("Failed to update project");
    }
  };

  const handleCancelEdit = () => {
    setIsEditModalVisible(false);
  };
  const content = (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Button
        type="text"
        icon={<EditOutlined />}
        onClick={handleEdit} // Gọi hàm xử lý khi click
        style={{ textAlign: "left", padding: 0, justifyContent: "flex-start" }}
      >
        Edit
      </Button>
      <Popconfirm
        title="Delete the task"
        description="Are you sure to delete this task?"
        onConfirm={handleDelete}
        okText="Yes"
        cancelText="No"
      >
        <Button
          type="text"
          icon={<DeleteOutlined />}
          style={{
            textAlign: "left",
            padding: 0,
            justifyContent: "flex-start",
          }}
        >
          Delete
        </Button>
      </Popconfirm>
    </div>
  );
  return (
    <div>
      <Card
        title={<div onClick={handleCardClick}>{editedProjectData?.name}</div>}
        extra={
          <Popover content={content} trigger="click">
            <EllipsisOutlined />
          </Popover>
        }
        actions={[
          <Avatar.Group
            max={{
              count: 2,
              style: {
                color: "#f56a00",
                backgroundColor: "#fde3cf",
              },
            }}
          >
            <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=2" />
            <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=2" />
            <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=2" />
            <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=2" />
          </Avatar.Group>,
          <div
            style={{
              width: "fit-content",
              padding: "0px 20px",
              backgroundColor:
                tags.find((tag) => tag.status === editedProjectData?.status)
                  ?.backgroundColor || "gray",
              color:
                tags.find((tag) => tag.status === editedProjectData?.status)
                  ?.color || "white",
              marginRight: "5px",
            }}
          >
            {editedProjectData?.status || "none"}
          </div>,
        ]}
      >
        <div>
          <div>{editedProjectData?.description}</div>
          <div>{editedProjectData?.startDate}</div>
          <div>{editedProjectData?.endDate}</div>
        </div>
      </Card>
      <Modal
        title="Edit Project"
        open={isEditModalVisible}
        onOk={handleSaveEdit}
        onCancel={handleCancelEdit}
      >
        <Form layout="vertical">
          <Form.Item label="Name">
            <Input
              value={editedProjectData.name}
              onChange={(e) =>
                setEditedProjectData({
                  ...editedProjectData,
                  name: e.target.value,
                })
              }
            />
          </Form.Item>
          <Form.Item label="Description">
            <Input.TextArea
              value={editedProjectData.description}
              onChange={(e) =>
                setEditedProjectData({
                  ...editedProjectData,
                  description: e.target.value,
                })
              }
            />
          </Form.Item>
          <Form.Item label="Start Date">
            <DatePicker
              value={dayjs(editedProjectData.startDate, "YYYY-MM-DD")}
              onChange={(date) =>
                setEditedProjectData({
                  ...editedProjectData,
                  startDate: date ? date.format("YYYY-MM-DD") : null, // Cập nhật trạng thái
                })
              }
            />
          </Form.Item>
          <Form.Item label="End Date">
            <DatePicker
              value={dayjs(editedProjectData.endDate, "YYYY-MM-DD")}
              onChange={(date) =>
                setEditedProjectData({
                  ...editedProjectData,
                  endDate: date ? date.format("YYYY-MM-DD") : null, // Cập nhật trạng thái
                })
              }
            />
          </Form.Item>
          <Form.Item label="Status">
            <Select
              value={editedProjectData.status}
              onChange={(value) =>
                setEditedProjectData({ ...editedProjectData, status: value })
              }
            >
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="progress">In Progress</Select.Option>
              <Select.Option value="completed">Completed</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectCardComponent;
