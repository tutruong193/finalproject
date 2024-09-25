import React, { useEffect, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Table, Tag, Input, Modal, Form, Checkbox } from "antd";
import * as UserService from "../../../services/UserService";
import { useQuery } from "@tanstack/react-query";
import * as Message from "../../../components/MessageComponent/MessageComponent";
const AccountPage = () => {
  //setup roles
  const optionsRole = [
    { label: "Manager", value: "manager" },
    { label: "Member", value: "member" },
  ];
  //setup table
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
      title: "Roles",
      key: "roles",
      dataIndex: "roles",
      render: (roles) => (
        <span>
          {roles.map((role) => {
            let color = role.length > 6 ? "geekblue" : "green"; // Thay đổi màu dựa trên chiều dài của role
            return (
              <Tag color={color} key={role}>
                {role.toUpperCase()} {/* Chuyển đổi role thành chữ hoa */}
              </Tag>
            );
          })}
        </span>
      ),
    },

    {
      title: "Data Added",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Data Updated",
      dataIndex: "updatedAt",
      key: "updatedAt",
    },
    {
      title: "Action",
      dataIndex: "Action",
      render: (_, record) => {
        return dataTable.length > 0 ? (
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
  //fetch user data
  const fetchUserAll = async () => {
    const res = await UserService.getAllUser();
    return res;
  };
  const userQuerry = useQuery({
    queryKey: ["users"],
    queryFn: fetchUserAll,
    config: { retry: 3, retryDelay: 1000 },
  });
  const { data: users } = userQuerry;
  const dataTable = users?.data
    ?.filter((user) => user.role !== "Admin")
    .map((user) => ({
      key: user._id,
      name: user.name,
      email: user.email,
      roles: user.role,
      createdAt: new Date(user.createdAt).toLocaleDateString(),
      updatedAt: new Date(user.updatedAt).toLocaleDateString(),
    }));
  ///model add user
  const [isModalAddUser, setIsModalAddUser] = useState(false);
  const showModalAddUser = () => {
    setIsModalAddUser(true);
  };
  const isFormValid = () => {
    const { name, email, password, role } = stateAddUser;
    return name && email && password && role.length > 0;
  };
  //add user
  const [form] = Form.useForm();
  const [stateAddUser, setStateAddUser] = useState({
    name: "",
    email: "",
    password: "",
    role: [],
  });
  const handleOnChangeAddUser = (e) => {
    setStateAddUser({
      ...stateAddUser,
      [e.target.name]: e.target.value,
    });
  };
  const handleOnChangeRole = (checkedValues) => {
    setStateAddUser({
      ...stateAddUser,
      role: checkedValues, // Cập nhật role là mảng các giá trị được chọn
    });
  };
  const handleAddUser = async () => {
    const res = await UserService.createUser(stateAddUser);
    if (res.status === "OK") {
      Message.success();
      form.resetFields();
      setIsModalAddUser(false);
      setStateAddUser({
        name: "",
        email: "",
        password: "",
        role: [],
      });
      userQuerry.refetch();
    } else if (res.status === "ERR") {
      Message.error(res.message);
    }
  };
  const handleCancelAddUser = () => {
    form.resetFields();
    setIsModalAddUser(false);
  };
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
            <Input placeholder="Enter the name" prefix={<SearchOutlined />} />
            <div className="container_admin_account_action">
              <Button type="primary">Filter</Button>
              <Button type="primary" onClick={showModalAddUser}>
                Add
              </Button>
              <Button type="primary">Delete</Button>
            </div>
          </div>
        </div>
        <div>
          <Table
            dataSource={dataTable || []}
            columns={columns}
            rowSelection
            pagination={{ className: "table-pagination" }}
          />
        </div>
      </div>
      <Modal
        title="Create a new account"
        open={isModalAddUser}
        onOk={handleAddUser}
        onCancel={handleCancelAddUser}
        okButtonProps={{ disabled: !isFormValid() }}
      >
        <Form
          form={form}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          autoComplete="off"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input your name",
              },
            ]}
          >
            <Input onChange={handleOnChangeAddUser} name="name" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
            ]}
          >
            <Input onChange={handleOnChangeAddUser} name="email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password onChange={handleOnChangeAddUser} name="password" />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Role"
            name="role"
            rules={[
              {
                required: true,
                message: "Please input your role!",
              },
            ]}
          >
            <Checkbox.Group
              options={optionsRole}
              onChange={handleOnChangeRole}
              name="role"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default AccountPage;
