import React, { useEffect, useState } from "react";
import {
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Input, Button, Row, Col, Radio } from "antd";
import TaskCardComponent from "../../../components/TaskCardComponent/TaskCardComponent";
import { useLocation } from "react-router-dom";
import * as TaskService from "../../../services/TaskService";
const TaskPage = () => {
  //setup
  const [statusValue, setStatusValue] = useState("all"); // giá trị trạng thái đã chọn
  const [orderValue, setOrderValue] = useState("ascending"); // giá trị thứ tự đã chọn

  const handleStatusChange = (e) => {
    setStatusValue(e.target.value); // cập nhật trạng thái chọn
  };

  const handleOrderChange = (e) => {
    setOrderValue(e.target.value); // cập nhật thứ tự chọn
  };

  const handleApply = () => {
    console.log("Status:", statusValue);
    console.log("Order:", orderValue);
  };

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
  const [stateTask, setStateTask] = useState([]);
  const location = useLocation();
  const projectId = new URLSearchParams(location.search).get("projectId");
  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const res = await TaskService.getAllTask(projectId);
        if (res.status === "ERR") {
        } else {
          setStateTask(res.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchTaskData();
  }, [projectId]);
  console.log("stateTask", stateTask);
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
              {stateTask?.map((task) => (
                <TaskCardComponent
                  key={task._id}
                  task_name={task?.taskName}
                  task_date={task?.dueDate}
                  status={task?.status}
                />
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default TaskPage;
