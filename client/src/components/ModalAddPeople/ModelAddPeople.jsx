import React from "react";
import { Modal, Select, Button, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
const { Text } = Typography;

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
      title="Add people"
      open={isVisible}
      onCancel={onCancel}
      footer={
        <Button onClick={onCancel} type="default">
          Cancel
        </Button>
      }
    >
      <div>
        <div>Search by name</div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Select
            showSearch
            allowClear
            style={{
              flex: 1,
            }}
            value={value}
            onChange={onChange}
            placeholder="E.g. Peter,..."
            optionFilterProp="label"
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            options={userList}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => onAddPeople()}
          >
            Add
          </Button>
        </div>
      </div>
      <div style={{ marginTop: "20px" }}>
        <div>Current Members</div>
        {currentMembers?.map((member) => (
          <div
            key={member.userId}
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Text>{member.name}</Text>
            <Button
              type="link"
              onClick={() => onRemoveMember(member.userId)}
              danger
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default AddPeopleModal;
