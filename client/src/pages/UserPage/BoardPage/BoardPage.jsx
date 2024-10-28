import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Typography } from "antd";
import * as TaskService from "../../../services/TaskService";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const BoardPage = () => {
  const projectId = localStorage.getItem("projectId");
  const [columns, setColumns] = useState({
    pending: { name: "To Do", items: [] },
    progress: { name: "In Progress", items: [] },
    completed: { name: "Done", items: [] },
  });

  const fetchTasks = async () => {
    try {
      const res = await TaskService.getAllTask(projectId);
      if (res.status === "OK") {
        const taskData = res.data;
        const newColumns = {
          pending: {
            name: "To Do",
            items: taskData.filter((task) => task.status === "pending"),
          },
          progress: {
            name: "In Progress",
            items: taskData.filter((task) => task.status === "progress"),
          },
          completed: {
            name: "Done",
            items: taskData.filter((task) => task.status === "completed"),
          },
        };
        setColumns(newColumns);
      } else {
        console.error("Failed to fetch tasks:", res.message);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = Array.from(sourceColumn.items);
    const destItems = Array.from(destColumn.items);
    const [movedItem] = sourceItems.splice(source.index, 1);

    // Cập nhật trạng thái cho mục di chuyển
    movedItem.status = destination.droppableId;

    if (source.droppableId !== destination.droppableId) {
      // Kéo từ cột này sang cột khác
      destItems.splice(destination.index, 0, movedItem);
    } else {
      // Kéo trong cùng một cột
      sourceItems.splice(destination.index, 0, movedItem);
    }

    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });
  };

  return (
    <div>
      <Typography.Title style={{ textAlign: "center" }}>Jira Board</Typography.Title>
      <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
        <DragDropContext onDragEnd={onDragEnd}>
          {Object.entries(columns).map(([columnId, column]) => (
            <div
              key={columnId}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                margin: "0 8px",
              }}
            >
              <Typography.Title level={5}>{column.name}</Typography.Title>
              <Droppable droppableId={columnId}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{
                      background: snapshot.isDraggingOver ? "lightblue" : "lightgrey",
                      padding: 4,
                      width: 250,
                      minHeight: 500,
                    }}
                  >
                    {column.items.map((item, index) => (
                      <Draggable key={item._id} draggableId={item._id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              userSelect: "none",
                              padding: 16,
                              margin: "0 0 8px 0",
                              minHeight: "50px",
                              backgroundColor: snapshot.isDragging ? "#263B4A" : "#456C86",
                              color: "white",
                              ...provided.draggableProps.style,
                            }}
                          >
                            {item.name}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </DragDropContext>
      </div>
    </div>
  );
};

export default BoardPage;
