import React from "react";
import Item from "./Item";
import { Droppable } from "react-beautiful-dnd";

const Column = ({ col: { list, id } }) => {
  return (
    <Droppable droppableId={id}>
      {(provided) => (
        <div
          style={{
            padding: "24px 16px",
            display: "flex",
            flexDirection: "column",
            marginTop: "8px",
            height: "fit-content",
          }}
        >
          <h2 style={{ margin: 0, padding: "0 16px" }}>{id} 1</h2>
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{
              backgroundColor: "#ddd",
              borderRadius: "8px",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              marginTop: "8px",
            }}
          >
            {list.map((text, index) => (
              <Item key={text} text={text} index={index} />
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
};

export default Column;
