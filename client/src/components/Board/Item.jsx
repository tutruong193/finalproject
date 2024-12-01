import React, { useEffect, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import dayjs from "dayjs";
import {
  Select,
  Radio,
  Avatar,
  Modal,
  Button,
  Typography,
  Tabs,
  Input,
  Tooltip,
  Checkbox,
  Form,
  DatePicker,
} from "antd";
import * as TaskService from "../../services/TaskService";
import {
  DownOutlined,
  PaperClipOutlined,
  PlusOutlined,
  LinkOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import ModelDetailTask from "../ModelDetailTask/ModelDetailTask";
import * as UserService from "../../services/UserService";
import relativeTime from "dayjs/plugin/relativeTime";
import { jwtTranslate } from "../../ultilis";
import { useCookies } from "react-cookie";
import * as Message from "../../components/MessageComponent/MessageComponent";
dayjs.extend(relativeTime);
// Thay đổi mảng columns để phù hợp với dữ liệu mới
const dateFormatOptions = {
  day: "2-digit",
  month: "long", // Tháng dưới dạng chữ
  year: "numeric",
};
const renderDate = (date) => {
  if (!date) return "N/A"; // Nếu không có giá trị, trả về "N/A"
  const parsedDate = new Date(date);
  if (isNaN(parsedDate)) return "Invalid Date"; // Kiểm tra xem có phải là ngày hợp lệ không
  return new Intl.DateTimeFormat("en-US", dateFormatOptions).format(parsedDate);
};
const { Text } = Typography;
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
const Item = ({ item, index, fetchAllData }) => {
  ///lấy dữ liệu để set name và avatar
  const [userList, setUserList] = useState([]);
  const takeAvatar = (id) => {
    const user = userList.find((user) => user._id === id);
    return user ? user.avatar : null;
  };
  const takeName = (id) => {
    const user = userList.find((user) => user._id === id);
    return user ? user.name : null;
  };
  const takeEmail = (id) => {
    const user = userList.find((user) => user._id === id);
    return user ? user.email : null;
  };
  const fetchMemberList = async () => {
    try {
      const userRes = await UserService.getAllUser();

      if (userRes.status === "OK") {
        setUserList(
          userRes?.data?.filter((user) => !user.role.includes("admin"))
        );
      } else {
        console.error("Error fetching project details");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchMemberList();
  }, [index, item]);
  const [cookiesAccessToken] = useCookies("");
  const infoUser = jwtTranslate(cookiesAccessToken.access_token);
  // Modal for task information
  const [isModalTaskInformation, setIsModalTaskInformation] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const showModal = async (key) => {
    setIsModalTaskInformation(true);
    setSelectedTask(key);
  };
  return (
    <div>
      <Draggable draggableId={item._id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`task-card ${snapshot.isDragging ? "dragging" : ""}`}
          >
            <div className="task-name" onClick={() => showModal(item._id)}>
              {item.name}
            </div>
            <div className="task-header">
              <Checkbox />
              <Text className="task-id">TASK</Text>
            </div>
            <div
              style={{
                width: "100%",
                justifyContent: "flex-end",
                display: "flex",
              }}
            >
              {item.dueDate && (
                <div className="task-date">
                  {dayjs(item.dueDate).format("DD MMM")}
                </div>
              )}
            </div>
          </div>
        )}
      </Draggable>
      <ModelDetailTask
        taskID={selectedTask}
        isModalTaskInformation={isModalTaskInformation}
        handleCancelTaskInformation={() => {
          setSelectedTask(null);
          setIsModalTaskInformation(false);
        }}
        infoUser={infoUser}
        takeAvatar={takeAvatar}
        takeName={takeName}
        takeEmail={takeEmail}
      />
    </div>
  );
};

export default Item;
