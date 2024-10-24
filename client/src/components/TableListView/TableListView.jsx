import React, { useState } from "react";
import { Space, Switch, Table } from "antd";

// Thay đổi mảng columns để phù hợp với dữ liệu mới
const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Project ID",
    dataIndex: "projectId",
    key: "projectId",
    render: (text) => text.toString(), // Chuyển đổi ObjectId thành chuỗi nếu cần
  },
  {
    title: "Assignees",
    dataIndex: "assignees",
    key: "assignees",
    render: (assignees) => (
      <span>{assignees.map((assignee) => assignee.name).join(", ")}</span>
    ),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Priority",
    dataIndex: "priority",
    key: "priority",
  },
  {
    title: "Due Date",
    dataIndex: "dueDate",
    key: "dueDate",
    render: (date) => new Date(date).toLocaleDateString(), // Định dạng ngày
  },
];

// Dữ liệu mẫu cho bảng
// Dữ liệu mẫu cho bảng với children
const data = [
  {
    key: 1,
    name: "Task 1",
    description: "Description for Task 1",
    projectId: "Project1",
    assignees: [
      { userId: "User1", name: "John Doe", status: "progress" },
      { userId: "User2", name: "Jane Doe", status: "completed" },
    ],
    status: "progress",
    priority: "high",
    dueDate: new Date().toISOString(),
    children: [
      {
        key: 11,
        name: "Subtask 1.1",
        description: "Description for Subtask 1.1",
        projectId: "Project1",
        assignees: [
          { userId: "User3", name: "Alice Smith", status: "progress" },
        ],
        status: "progress",
        priority: "medium",
        dueDate: new Date().toISOString(),
      },
      {
        key: 12,
        name: "Subtask 1.2",
        description: "Description for Subtask 1.2",
        projectId: "Project1",
        assignees: [
          { userId: "User4", name: "Bob Johnson", status: "completed" },
        ],
        status: "completed",
        priority: "low",
        dueDate: new Date().toISOString(),
      },
    ],
  },
  {
    key: 2,
    name: "Task 2",
    description: "Description for Task 2",
    projectId: "Project2",
    assignees: [],
    status: "progress",
    priority: "medium",
    dueDate: new Date().toISOString(),
  },
];

// rowSelection objects indicates the need for row selection
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows
    );
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows);
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows);
  },
};

const TableListView = ({ projectId }) => {
  return (
    <>
      <Table columns={columns} rowSelection={rowSelection} dataSource={data} />
    </>
  );
};

export default TableListView;
