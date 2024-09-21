import React, { useState } from "react";
import {
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Input, Button, Row, Col, Radio } from "antd";
import TaskCardComponent from "../../../components/TaskCardComponent/TaskCardComponent";
import "./TaskPage.css"; // Import file CSS

const TaskPage = () => {
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

  return (
    <div className="task-page">
      <h2 className="task-title">Tasks List</h2>
      <Row>
        <Col span={6}>
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
        <Col span={18}>
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
              <TaskCardComponent
                task_name="create something"
                task_date="14/03/2024"
                status="completed"
              />
              <TaskCardComponent
                task_name="create something"
                task_date="14/03/2024"
                status="pending"
              />
              <TaskCardComponent
                task_name="create something"
                task_date="14/03/2024"
                status="progress"
              />
              <TaskCardComponent
                task_name="create something"
                task_date="14/03/2024"
                status="completed"
              />
              <TaskCardComponent
                task_name="create something"
                task_date="14/03/2024"
                status="completed"
              />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default TaskPage;
