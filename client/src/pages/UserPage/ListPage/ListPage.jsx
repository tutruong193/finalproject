import React, { useEffect, useState } from "react";
import {
  SearchOutlined,
  PlusOutlined,
  FilterOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  Input,
  Button,
  Form,
  Avatar,
  Typography,
} from "antd";
import { useLocation } from "react-router-dom";
import * as TaskService from "../../../services/TaskService";
import * as ProjectService from "../../../services/ProjectService";
import * as UserService from "../../../services/UserService";
import { useQuery } from "@tanstack/react-query";
import ModalAddProject from "../../../components/ModalAddProject/ModalAddProject";
import * as Message from "../../../components/MessageComponent/MessageComponent";
import TableListView from "../../../components/TableListView/TableListView";
import AddPeopleModal from "../../../components/ModalAddPeople/ModelAddPeople";
const { Title, Text } = Typography;
const ListPage = () => {
  //setup
  const [statusValue, setStatusValue] = useState("all"); // giá trị trạng thái đã chọn
  const [orderValue, setOrderValue] = useState("ascending"); // giá trị thứ tự đã chọn
  const [piorityValue, setPiorityValue] = useState("high");

  const handleStatusChange = (e) => {
    setStatusValue(e.target.value); // cập nhật trạng thái chọn
  };
  const handleChangePriority = (e) => {
    console.log("radio checked", e.target.value);
    setPiorityValue(e.target.value);
  };
  const handleOrderChange = (e) => {
    setOrderValue(e.target.value); // cập nhật thứ tự chọn
  };

  const handleApply = () => {
    console.log("Status:", statusValue);
    console.log("Order:", orderValue);
  };
  const itemPriority = [
    {
      label: "High",
      value: "high",
    },
    {
      label: "Medium",
      value: "medium",
    },
    {
      label: "Low",
      value: "low",
    },
  ];

  const itemThutu = [
    {
      label: "ascending",
      value: "ascending",
    },
    {
      label: "descending",
      value: "descending",
    },
  ];

  const itemStatus = [
    {
      label: "All",
      value: "all",
    },
    {
      label: "Completed",
      value: "completed",
    },
    {
      label: "Progress",
      value: "progress",
    },
    {
      label: "Pending",
      value: "pending",
    },
  ];
  //fetch task data and user data
  const fetchTaskAll = async () => {
    const res = await TaskService.getAllTask(projectId);
    return res;
  };
  const taskQuery = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTaskAll,
    staleTime: 0, // Đảm bảo dữ liệu luôn được coi là "stale" và cần refetch
    cacheTime: 1000,
  });
  const { data: tasks } = taskQuery;
  const [stateProject, setStateProject] = useState([]);
  const [userList, setUserList] = useState([]);
  const projectId = localStorage.getItem("projectId");
  const fetchTaskDataAndMemberList = async () => {
    try {
      const [projectRes, userRes] = await Promise.all([
        ProjectService.getDetailProjectProject(projectId),
        UserService.getAllUser(), // Thay thế bằng hàm thực tế để lấy dữ liệu user
      ]);
      if (projectRes.status === "OK") {
        setStateProject(projectRes.data);
      } else {
        console.error("Error fetching project details");
      }
      if (userRes.status === "OK") {
        const existingMemberIds = new Set(
          projectRes.data.members.map((member) => member.userId)
        );
        existingMemberIds.add(projectRes.data.managerID);
        existingMemberIds.add("66f4f0f9aa581e424317d838");
        // Lọc danh sách user để loại bỏ những người dùng có ID trùng với các thành viên hiện có hoặc managerID
        const filteredUserList = userRes.data
          .filter((user) => !existingMemberIds.has(user._id))
          .map((user) => ({
            label: user.name,
            value: user._id,
          }));

        setUserList(filteredUserList);
      } else {
        console.error("Error fetching project details");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  console.log(userList);
  useEffect(() => {
    fetchTaskDataAndMemberList();
  }, [projectId]);
  //assign members to task
  const options = [];
  if (stateProject?.members) {
    // Sử dụng members thay vì membersID
    for (let i = 0; i < stateProject.members.length; i++) {
      options.push({
        value: stateProject.members[i].userId, // ID thành viên
        label: stateProject.members[i].name, // Tên thành viên
      });
    }
  }
  //add task
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm(); // Form instance
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields(); // Reset the form fields
  };
  const handleAddTask = async (values) => {
    try {
      const assignees = values.assignees.map((userId) => {
        const member = stateProject.members.find((m) => m.userId === userId);
        return {
          userId,
          name: member.name,
        };
      });
      const newTask = {
        name: values.name,
        dueDate: values.dueDate.format("YYYY-MM-DD"),
        status: values.status,
        projectId: projectId,
        assignees: assignees, // Gửi danh sách thành viên đã chọn
      };
      const res = await TaskService.createTask(newTask);
      if (res.status === "OK") {
        Message.success("Task added successfully!");
        handleCancel();
        taskQuery.refetch();
      } else {
        Message.error(res.message);
      }
    } catch (error) {
      console.error("Error adding task:", error);
      Message.error("An error occurred while adding the task.");
    }
  };
  //add members to project
  const [isModalAddPeopleOpen, setIsModalAddPeopleOpen] = useState(false);
  const [value, setValue] = useState();
  const showModalAddPeople = () => {
    setIsModalAddPeopleOpen(true);
  };
  const handleOkAddPeople = async () => {
    const res = await ProjectService.AddMember(projectId, value);
    if (res.status === "OK") {
      Message.success();
      setValue(null);
      setIsModalAddPeopleOpen(false);
      fetchTaskDataAndMemberList();
    } else {
      Message.error(res.message);
    }
  };
  const handleCancelAddPeople = () => {
    setIsModalAddPeopleOpen(false);
    setValue(null);
  };

  const handleRemoveMember = async (userId) => {
    const res = await ProjectService.DeleteMember(projectId, userId);
    if (res.status === "OK") {
      Message.success();
      fetchTaskDataAndMemberList();
    } else {
      Message.error(res.message);
    }
  };
  ///delete task
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);
  const handleDeleteTasks = async () => {
    try {
      const res = await TaskService.deleteTask(selectedTaskIds);
      if (res.status === "OK") {
        Message.success("Tasks deleted successfully!");
        taskQuery.refetch();
        setSelectedTaskIds([]); 
      } else {
        Message.error(res.message);
      }
    } catch (error) {
      console.error("Error deleting tasks:", error);
      Message.error("An error occurred while deleting tasks.");
    }
  };
  return (
    <div className="task-page">
      <div className="task-title">
        <div className="breadcrumb">
          <div>Project</div>
          <div>/</div>
          <div>ProjectName</div>
        </div>
        <Title level={4} style={{ margin: 0 }}>
          LIST
        </Title>
      </div>
      <div className="toolbar">
        <div className="toolbar-left">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search"
            style={{ width: 240 }}
          />
          <Avatar.Group
            max={{
              count: 2,
              style: {
                color: "#f56a00",
                backgroundColor: "#fde3cf",
              },
            }}
          >
            {options.map((member) => (
              <Avatar
                style={{
                  backgroundColor: "#87d068",
                  cursor: "pointer",
                }}
                key={member.value}
                alt={member.label}
                title={member.label}
              >
                {member.label.charAt(0).toUpperCase()}
              </Avatar>
            ))}
          </Avatar.Group>
          <Avatar icon={<PlusOutlined />} onClick={showModalAddPeople} />
          <AddPeopleModal
            isVisible={isModalAddPeopleOpen}
            onCancel={handleCancelAddPeople}
            onAddPeople={handleOkAddPeople}
            userList={userList}
            currentMembers={stateProject.members}
            onChange={setValue}
            onRemoveMember={handleRemoveMember}
            value={value}
          />
        </div>
        <div className="toolbar-right">
          <Button
            icon={<PlusOutlined />}
            className="action_button"
            onClick={showModal}
          >
            Add
          </Button>
          <Button icon={<FilterOutlined />} className="action_button">
            Filter
          </Button>
          <Button
            icon={<DeleteOutlined />}
            className="action_button"
            disabled={selectedTaskIds.length === 0} // Vô hiệu hóa nếu không có task nào được chọn
            onClick={handleDeleteTasks}
          >
            Delete
          </Button>
        </div>
      </div>
      <div className="task-card-container">
        <TableListView
           data={Array.isArray(tasks?.data) ? tasks.data : []}
          onRowSelectionChange={(selectedKeys) =>
            setSelectedTaskIds(selectedKeys)
          }
        />
      </div>
      <ModalAddProject
        isModalVisible={isModalVisible}
        handleCancel={handleCancel}
        handleAddTask={handleAddTask}
        form={form}
        options={options}
        itemPriority={itemPriority}
        piorityValue={piorityValue}
      />
    </div>
  );
};

export default ListPage;
