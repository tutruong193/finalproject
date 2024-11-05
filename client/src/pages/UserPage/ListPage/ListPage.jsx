import React, { useEffect, useState } from "react";
import {
  SearchOutlined,
  PlusOutlined,
  FilterOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import {
  Input,
  Button,
  Radio,
  Modal,
  Form,
  DatePicker,
  Select,
  Avatar,
  Typography,
} from "antd";
import { useLocation } from "react-router-dom";
import * as TaskService from "../../../services/TaskService";
import * as ProjectService from "../../../services/ProjectService";
import { useQuery } from "@tanstack/react-query";
import * as Message from "../../../components/MessageComponent/MessageComponent";
import TableListView from "../../../components/TableListView/TableListView";
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
  //fetch task data
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
  const projectId = localStorage.getItem("projectId");
  useEffect(() => {
    const fetchTaskDataAndMemberList = async () => {
      try {
        const projectRes = await ProjectService.getDetailProjectProject(
          projectId
        );
        if (projectRes.status === "OK") {
          setStateProject(projectRes.data);
        } else {
          console.error("Error fetching project details");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
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
  const [value, setValue] = useState(['Ava Swift']);
  const showModalAddPeople = () => {
    setIsModalAddPeopleOpen(true);
  };
  const handleOkAddPeople = () => {
    setIsModalAddPeopleOpen(false);
  };
  const handleCancelAddPeople = () => {
    setIsModalAddPeopleOpen(false);
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
          <Modal
            title="Basic Modal"
            open={isModalAddPeopleOpen}
            onOk={handleOkAddPeople}
            onCancel={handleCancelAddPeople}
          >
            <div></div>
            <div>
              <Select
                mode="multiple"
                style={{
                  width: "100%",
                }}
                onChange={setValue}
                placeholder="Please select role"
                options={[
                  {
                    value: "Ava Swift",
                    label: "Ava Swift",
                  },
                  {
                    value: "Cole Reed",
                    label: "Cole Reed",
                  }
                ]}
              />
            </div>
          </Modal>
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
          <Button icon={<EllipsisOutlined />} className="action_button">
            More
          </Button>
        </div>
      </div>
      <div className="task-card-container">
        <TableListView data={tasks?.data || []} />
      </div>
      <Modal
        title="Add New Task"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null} // Custom footer with form buttons
      >
        <Form
          form={form}
          onFinish={handleAddTask}
          layout="vertical"
          initialValues={{ priority: "high" }}
        >
          <Form.Item
            label="Task Name"
            name="name"
            rules={[{ required: true, message: "Please input the task name!" }]}
          >
            <Input placeholder="Enter task name" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input placeholder="Enter task name" />
          </Form.Item>
          <Form.Item
            label="Priority"
            name="priority"
            rules={[{ required: true, message: "Please select the due date!" }]}
          >
            <Radio.Group onChange={handleChangePriority} value={piorityValue}>
              {itemPriority.map((item) => (
                <Radio value={item.value}>{item.label}</Radio>
              ))}
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="Members"
            name="assignees"
            rules={[
              { required: true, message: "Please select at least one member!" },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Please select"
              // onChange={handleChange}
              style={{
                width: "100%",
              }}
              options={options}
            />
          </Form.Item>
          <Form.Item
            label="Due Date"
            name="dueDate"
            rules={[{ required: true, message: "Please select the due date!" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
              Add Task
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ListPage;
