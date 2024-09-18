import React from "react";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Table, Tag } from "antd";
import "./AccountPage.css";
const AccountPage = () => {
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Company",
      dataIndex: "Company",
      key: "Company",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Roles",
      key: "roles",
      dataIndex: "roles",
      render: (roles) => (
        <span>
          {roles.map((tag) => {
            let color = tag.length > 6 ? "geekblue" : "green";
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </span>
      ),
    },
    {
      title: "Data Added",
      dataIndex: "Data Added",
      key: "Data Added",
    },
    {
      title: "Action",
      dataIndex: "Action",
      render: (_, record) => {
        return dataSource.length > 0 ? (
          <div>
            <DeleteOutlined
              style={{ color: "red", fontSize: "30px", cursor: "pointer" }}
            />
            <EditOutlined
              style={{ color: "orange", fontSize: "30px", cursor: "pointer" }}
            />
          </div>
        ) : null;
      },
    },
  ];
  const dataSource = [
    {
      key: "1",
      name: "Mike",
      age: 32,
      email: "10 Downing Street",
      roles: ["Manager", "Member"],
    },
    {
      key: "2",
      name: "John",
      age: 42,
      email: "10 Downing",
      roles: ["Manager", "Member"],
    },
  ];
  return (
    <div style={{ width: "100%" }}>
      <div className="container_admin_account">
        <div className="container_admin_account_title">
          <h2 style={{ margin: 0 }}>User management</h2>
          <span>Manage the accounts here</span>
        </div>
        <div className="container_admin_account_header">
          <span>All Users</span>
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <Button
              style={{ width: "300px", margin: 0 }}
              icon={<SearchOutlined />}
              iconPosition="end"
            >
              Search
            </Button>
            <div className="container_admin_account_action">
              <Button type="primary">Filter</Button>
              <Button type="primary">Add</Button>
              <Button type="primary">Delete</Button>
            </div>
          </div>
        </div>
        <div>
          <Table
            dataSource={dataSource}
            columns={columns}
            rowSelection
            pagination={{ className: "table-pagination" }}
          />
        </div>
      </div>
    </div>
  );
};
export default AccountPage;
