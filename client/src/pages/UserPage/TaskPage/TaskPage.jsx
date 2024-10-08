import React, { useEffect, useState } from "react";
import {
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Input,
  Button,
  Row,
  Col,
  Radio,
  Modal,
  Form,
  DatePicker,
  Select,
} from "antd";
import TaskCardComponent from "../../../components/TaskCardComponent/TaskCardComponent";
import { useLocation } from "react-router-dom";
import * as TaskService from "../../../services/TaskService";
import * as ProjectService from "../../../services/ProjectService";
import { useQuery } from "@tanstack/react-query";
import * as Message from "../../../components/MessageComponent/MessageComponent";
const TaskPage = () => {
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
    config: { retry: 3, retryDelay: 1000 },
  });
  const { data: tasks } = taskQuery;
  const [stateProject, setStateProject] = useState([]);
  const location = useLocation();
  const projectId = new URLSearchParams(location.search).get("projectId");
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
  const handleChange = (value) => {
    console.log(`Selected: ${value}`);
  };
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
      const res = await TaskService.addTask(newTask);
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
  return (
    <div className="task-page">
      <h2 className="task-title">Tasks List</h2>
      <Row>
        <Col span={5}>
          <div className="filter-container">
            <div className="filter-section">
              <h4 className="filter-title">Status</h4>
              <Radio.Group onChange={handleStatusChange} value={statusValue}>
                {itemStatus.map((item) => (
                  <div key={item.value} className="radio-item">
                    <Radio value={item.value}>{item.label}</Radio>
                  </div>
                ))}
              </Radio.Group>
            </div>
            <div className="filter-section">
              <h4 className="filter-title">Thứ Tự</h4>
              <Radio.Group onChange={handleOrderChange} value={orderValue}>
                {itemThutu.map((item) => (
                  <div key={item.value} className="radio-item">
                    <Radio value={item.value}>{item.label}</Radio>
                  </div>
                ))}
              </Radio.Group>
            </div>
            <Button
              type="primary"
              className="apply-button"
              onClick={handleApply}
            >
              Áp dụng
            </Button>
          </div>
        </Col>
        <Col span={19}>
          <div>
            <div className="container_action">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                className="add-task-btn"
                onClick={showModal}
              >
                Add Task
              </Button>
              <div className="container_action_right">
                <Input placeholder="default size" prefix={<SearchOutlined />} />
                <Button
                  type="primary"
                  icon={<FilterOutlined />}
                  className="filter-btn"
                  style={{ display: "none" }}
                />
              </div>
            </div>
            <div className="task-card-container">
              {
                // Kiểm tra nếu taskQuery.data là mảng
                tasks?.data.map((task) => (
                  <TaskCardComponent key={task._id} task_id={task._id} />
                ))
              }
            </div>
          </div>
        </Col>
      </Row>
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
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please input the task name!" }]}
          >
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
              onChange={handleChange}
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

export default TaskPage;
