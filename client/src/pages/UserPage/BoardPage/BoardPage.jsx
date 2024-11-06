import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useCookies } from "react-cookie";
import * as TaskService from "../../../services/TaskService";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  SearchOutlined,
  PlusOutlined,
  EllipsisOutlined,
  SettingOutlined,
  BarChartOutlined,
  FullscreenOutlined,
} from "@ant-design/icons";
import * as Message from "../../../components/MessageComponent/MessageComponent";
import { Input, Button, Typography, Avatar, Space } from "antd";
import Column from "../../../components/Board/Column";
import { jwtTranslate } from "../../../ultilis";
const { Title, Text } = Typography;
const BoardPage = () => {
  const projectId = localStorage.getItem("projectId");
  const [columns, setColumns] = useState({
    todo: { name: "TO DO", count: 1, items: [] },
    progress: { name: "IN PROGRESS", count: 1, items: [] },
    done: { name: "DONE", count: 3, items: [] },
  });
  const [cookiesAccessToken] = useCookies("");
  const infoUser = jwtTranslate(cookiesAccessToken.access_token);
  const fetchTasks = async () => {
    try {
      const res = await TaskService.getAllTask(projectId);
      if (res.status === "OK") {
        const taskData = res.data;
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
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
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

    // setColumns({
    //   ...columns,
    //   [source.droppableId]: {
    //     ...sourceColumn,
    //     items: sourceItems,
    //     count: sourceItems.length,
    //   },
    //   [destination.droppableId]: {
    //     ...destColumn,
    //     items: destItems,
    //     count: destItems.length,
    //   },
    // });
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
            <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
            <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=2" />
            <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=3" />
          </Avatar.Group>
          <Avatar icon={<PlusOutlined />} />
        </div>
        <div className="toolbar-right">
          <Button icon={<SettingOutlined />}>View settings</Button>
        </div>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="board-columns">
          {Object.entries(columns).map(([columnId, column]) => (
            <Column key={columnId} columnId={columnId} column={column} fetchTasks={fetchTasks}/>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default BoardPage;
