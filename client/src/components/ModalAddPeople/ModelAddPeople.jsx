import React from "react";
import { Modal, Select, Button, Typography, Avatar, List, Tooltip } from "antd";
import { PlusOutlined, UserOutlined, DeleteOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

const AddPeopleModal = ({
  isVisible,
  onCancel,
  onAddPeople,
  userList,
  currentMembers,
  onChange,
  onRemoveMember,
  value,
}) => {
  return (
    <Modal
      title={
        <Title level={4} style={{ margin: 0, color: "#1890ff" }}>
          Add Team Members
        </Title>
      }
      open={isVisible}
      onCancel={onCancel}
      width={500}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button 
          key="add" 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={onAddPeople}
        >
          Add Member
        </Button>
      ]}
    >
      <div style={{ padding: "0 10px" }}>
        <div style={{ marginBottom: "20px" }}>
          <Text strong>Search and Add Members</Text>
          <div 
            style={{ 
              display: "flex", 
              gap: "10px", 
              alignItems: "center", 
              marginTop: "10px" 
            }}
          >
            <Select
              showSearch
              allowClear
              style={{
                flex: 1,
              }}
              value={value}
              onChange={onChange}
              placeholder="Search by name"
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={userList}
            />
          </div>
        </div>

        <div>
          <Text strong>Current Team Members</Text>
          {currentMembers?.length > 0 ? (
            <List
              itemLayout="horizontal"
              dataSource={currentMembers}
              renderItem={(member) => (
                <List.Item
                  actions={[
                    <Tooltip title="Remove member" key="remove">
                      <Button 
                        type="text" 
                        danger 
                        icon={<DeleteOutlined />}
                        onClick={() => onRemoveMember(member.userId)}
                      >
                        Remove
                      </Button>
                    </Tooltip>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        icon={<UserOutlined />} 
                        style={{ 
                          backgroundColor: "#87d068",
                          verticalAlign: 'middle' 
                        }} 
                      />
                    }
                    title={<Text>{member.name}</Text>}
                    description={member.email || "No email"}
                  />
                </List.Item>
              )}
            />
          ) : (
            <div 
              style={{ 
                textAlign: "center", 
                color: "#999", 
                padding: "20px 0" 
              }}
            >
              No members added yet
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AddPeopleModal;