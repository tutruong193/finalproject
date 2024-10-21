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
import * as UserService from "../../services/UserService";
import { useNavigate } from "react-router-dom";
import * as ProjectService from "../../services/ProjectService";
import * as Message from "../../components/MessageComponent/MessageComponent";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import avatar from "../../assets/avatar.jpg";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(utc);
dayjs.extend(customParseFormat);
const ProjectCardComponent = ({ projectId, projectQuerry }) => {
  const navigate = useNavigate();
  const [stateProject, setStateProject] = useState({
    name: "",
    description: "",
    startDate: null,
    endDate: null,
    status: "",
    members: [],
  });
  const [userData, setUserData] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState();
  useEffect(() => {
    const fetchProjectAndUsers = async () => {
      try {
        // Gọi đồng thời cả hai hàm API
        const [projectRes, userRes] = await Promise.all([
          ProjectService.getDetailProjectProject(projectId),
          UserService.getAllUser(),
        ]);
        // Xử lý kết quả của project
        if (projectRes.status === "OK") {
          setStateProject({
            ...projectRes.data,
            members: projectRes.data?.members?.map((user) => ({
              label: user.name,
              value: user.userId,
            })),
          });
          setSelectedMembers(projectRes.data.members);
        } else {
          console.error("Error fetching project details");
        }
        // Xử lý kết quả của user
        if (userRes?.data) {
          const formattedUsers = userRes.data
            .filter((user) => user.role.includes("member"))
            .map((user) => ({
              label: user.name,
              value: user._id, // Value hiển thị trong AutoComplete
            }));
          setUserData(formattedUsers || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchProjectAndUsers();
  }, [projectId]);
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
  //editProject
  const [formEdit] = Form.useForm();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const handleChangeSelectMember = (value) => {
    const selectedMembers = value.map((userId) => {
      const selectedUser = userData.find((user) => user.value === userId);
      return { userId, name: selectedUser.label }; // Lưu cả userId và name
    });
    setSelectedMembers(selectedMembers);
  };
  const handleEdit = () => {
    setIsEditModalVisible(true);
    formEdit.setFieldsValue({
      name: stateProject.name,
      description: stateProject.description,
      startDate: dayjs(stateProject.startDate).local(), // Chuyển đổi về múi giờ địa phương
      endDate: dayjs(stateProject.endDate).local(),
      status: stateProject.status,
    });
  };
  const handleSaveEdit = async () => {
    try {
      const updateProject = {
        ...formEdit.getFieldsValue(), // Lấy các giá trị khác từ form
        members: selectedMembers, // Ghi đè members bằng selectedMembers từ state
      };
      const res = await ProjectService.updateProject(projectId, updateProject); // Gọi hàm cập nhật
      if (res.status === "OK") {
        formEdit.resetFields();
        setIsEditModalVisible(false);
        Message.success(res.message);
        projectQuerry.refetch();
        setTimeout(window.location.reload(), 3000);
      } else {
        Message.error(res.message);
      }
    } catch (error) {
      console.error("Failed to update project:", error);
      Message.error("Failed to update project");
    }
  };
  const handleCancelEdit = () => {
    setIsEditModalVisible(false);
  };
  return (
    <div>
      <Card
        title={<div onClick={handleCardClick}>{stateProject?.name}</div>}
        extra={
          <Popover
            trigger="click"
            content={
              <div style={{ display: "flex", flexDirection: "column" }}>
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={handleEdit} // Gọi hàm xử lý khi click
                  style={{
                    textAlign: "left",
                    padding: 0,
                    justifyContent: "flex-start",
                  }}
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
            }
          >
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
            {stateProject?.members?.map((member) => (
              <Avatar
                key={member.userId}
                src={member.avatar || avatar}
                alt={member.name}
                title={member.name}
              />
            ))}
          </Avatar.Group>,
          <div
            style={{
              width: "fit-content",
              padding: "0px 20px",
              backgroundColor:
                tags.find((tag) => tag.status === stateProject?.status)
                  ?.backgroundColor || "gray",
              color:
                tags.find((tag) => tag.status === stateProject?.status)
                  ?.color || "white",
              marginRight: "5px",
            }}
          >
            {stateProject?.status || "none"}
          </div>,
        ]}
      >
        <div>
          <div>{stateProject?.description || " "}</div>
          <div>
            {dayjs(stateProject?.startDate).local().format("HH:mm DD-MM-YYYY")}
          </div>
          <div>
            {dayjs(stateProject?.endDate).local().format("HH:mm DD-MM-YYYY")}
          </div>
        </div>
      </Card>
      <Modal
        title="Edit Project"
        open={isEditModalVisible}
        onOk={handleSaveEdit}
        onCancel={handleCancelEdit}
      >
        <Form layout="vertical" form={formEdit} autoComplete="off">
          <Form.Item label="Name" name="name">
            <Input name="name" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea name="description" />
          </Form.Item>
          <Form.Item label="Start Date" name="startDate">
            <DatePicker name="startDate" />
          </Form.Item>
          <Form.Item label="End Date" name="endDate">
            <DatePicker name="endDate" />
          </Form.Item>
          <Form.Item label="Members">
            <Select
              defaultValue={stateProject.members}
              mode="multiple"
              onChange={handleChangeSelectMember}
              options={
                stateProject.members.length > 0
                  ? stateProject.members
                  : userData
              }
              placeholder="Select members"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item label="Status" name="status">
            <Select name="status">
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
