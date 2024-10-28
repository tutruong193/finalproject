import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const Item = ({ text, index }) => {
  return (
    <Draggable draggableId={text} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            backgroundColor: "#eee",
            borderRadius: "4px",
            padding: "4px 8px",
            transition: "background-color 0.8s ease-out",
            marginTop: "8px",
            cursor: "pointer",
            ":hover": {
              backgroundColor: "#fff",
              transition: "background-color 0.1s ease-in",
            },
          }}
        >
          {text}
        </div>
      )}
    </Draggable>
  );
};

export default Item;
