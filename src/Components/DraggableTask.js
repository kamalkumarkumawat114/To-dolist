// src/Components/DraggableTask.js
import React from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "./ItemTypes"; // Make sure this path is correct
import "../App.css";

const DraggableTask = ({ task, index, moveTask, listId }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TASK,
    item: { type: ItemTypes.TASK, task, index, listId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;

  return (
    <li ref={drag} style={{ opacity }} className="task-item">
      {task.title} - {task.priority}
    </li>
  );
};

export default DraggableTask;
