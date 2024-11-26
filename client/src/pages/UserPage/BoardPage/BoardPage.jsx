import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useCookies } from "react-cookie";
import * as TaskService from "../../../services/TaskService";
import * as ProjectService from "../../../services/ProjectService";
import * as UserService from "../../../services/UserService";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  SearchOutlined,
  PlusOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import * as Message from "../../../components/MessageComponent/MessageComponent";
import {
  Input,
  Button,
  Typography,
  Avatar,
  Modal,
  Select,
  Form,
  Radio,
  DatePicker,
} from "antd";
import Column from "../../../components/Board/Column";
import { jwtTranslate } from "../../../ultilis";
const { Title, Text } = Typography;
const BoardPage = () => {
  const [piorityValue, setPiorityValue] = useState("high");
  const handleChangePriority = (e) => {
    console.log("radio checked", e.target.value);
    setPiorityValue(e.target.value);
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
  const projectId = localStorage.getItem("projectId");
  const [columns, setColumns] = useState({
    todo: { name: "TO DO", count: 1, items: [] },
    progress: { name: "IN PROGRESS", count: 1, items: [] },
    done: { name: "DONE", count: 3, items: [] },
  });
  const [stateProject, setStateProject] = useState([]);
  const [userList, setUserList] = useState([]);
  const [cookiesAccessToken] = useCookies("");
  const infoUser = jwtTranslate(cookiesAccessToken.access_token);
  const fetchAllData = async () => {
    try {
      const [projectRes, userRes, taskRes] = await Promise.all([
        ProjectService.getDetailProjectProject(projectId),
        UserService.getAllUser(),
        TaskService.getAllTask(projectId),
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
      if (taskRes.status === "OK") {
        const taskData = taskRes.data;
        const newColumns = {
          todo: {
            name: "TO DO",
            count: taskData.filter((task) => task.status === "todo").length,
            items: taskData.filter((task) => task.status === "todo"),
          },
          progress: {
            name: "IN PROGRESS",
            count: taskData.filter((task) => task.status === "progress").length,
            items: taskData.filter((task) => task.status === "progress"),
          },
          done: {
            name: "DONE",
            count: taskData.filter((task) => task.status === "done").length,
            items: taskData.filter((task) => task.status === "done"),
          },
        };
        setColumns(newColumns);
      } else {
        console.error("Error fetching task list");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchAllData();
  }, []);

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = Array.from(sourceColumn.items);
    const destItems = Array.from(destColumn.items);
    const [movedItem] = sourceItems.splice(source.index, 1);

    movedItem.status = destination.droppableId;

    if (source.droppableId !== destination.droppableId) {
      // destItems.splice(destination.index, 0, movedItem);
      try {
        // Gọi API để cập nhật trạng thái trong DB
        const res = await TaskService.updateStatusTask(
          movedItem._id,
          infoUser.id,
          movedItem.status
        );
        if (res.status === "OK") {
          Message.success();
          destItems.splice(destination.index, 0, movedItem);
          setColumns({
            ...columns,
            [source.droppableId]: {
              ...sourceColumn,
              items: sourceItems,
              count: sourceItems.length,
            },
            [destination.droppableId]: {
              ...destColumn,
              items: destItems,
              count: destItems.length,
            },
          });
        } else {
          Message.error(res.message);
          sourceItems.splice(source.index, 0, movedItem);
          setColumns({
            ...columns,
            [source.droppableId]: {
              ...sourceColumn,
              items: sourceItems,
              count: sourceItems.length,
            },
            [destination.droppableId]: {
              ...destColumn,
              items: destItems,
              count: destItems.length,
            },
          });
        }
        // Thêm item vào cột đích và cập nhật lại UI
      } catch (error) {
        // Khôi phục lại trạng thái cũ trong UI nếu gặp lỗi
        sourceItems.splice(source.index, 0, movedItem);
        setColumns({
          ...columns,
          [source.droppableId]: {
            ...sourceColumn,
            items: sourceItems,
            count: sourceItems.length,
          },
          [destination.droppableId]: {
            ...destColumn,
            items: destItems,
            count: destItems.length,
          },
        });
      }
    } else {
      sourceItems.splice(destination.index, 0, movedItem);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
          count: sourceItems.length,
        },
      });
    }
  };
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
      fetchAllData();
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
      fetchAllData();
    } else {
      Message.error(res.message);
    }
  };
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
        fetchAllData();
      } else {
        Message.error(res.message);
      }
    } catch (error) {
      console.error("Error adding task:", error);
      Message.error("An error occurred while adding the task.");
    }
  };
  return (
    <div className="board-container">
      <div className="board-header">
        <div className="breadcrumb">
          <span>Projects</span>
          <span>/</span>
          <span>tu</span>
        </div>
        <div>
          <Title level={4} style={{ margin: 0 }}>
            KAN board
          </Title>
        </div>
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
        </div>
        <Modal
          title="Add people"
          open={isModalAddPeopleOpen}
          onOk={handleOkAddPeople}
          onCancel={handleCancelAddPeople}
        >
          <div>
            <div>Search by name</div>
            <Select
              showSearch
              allowClear
              style={{
                width: 200,
              }}
              defaultValue={value}
              onChange={(value) => setValue(value)}
              placeholder="E.g. Peter,... "
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={userList}
            />
          </div>
          <div>
            <div>Current Members</div>
            {stateProject.members?.map((member) => (
              <div
                key={member.userId}
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <Text>{member.name}</Text>
                <Button
                  type="link"
                  onClick={() => handleRemoveMember(member.userId)}
                  danger
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </Modal>
        <div className="toolbar-right">
          <Button
            icon={<PlusOutlined />}
            className="action_button"
            onClick={showModal}
          >
            Add
          </Button>
          <Button icon={<SettingOutlined />}>View settings</Button>
        </div>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="board-columns">
          {Object.entries(columns).map(([columnId, column]) => (
            <Column
              key={columnId}
              columnId={columnId}
              column={column}
              fetchAllData={fetchAllData}
            />
          ))}
        </div>
      </DragDropContext>
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

export default BoardPage;
