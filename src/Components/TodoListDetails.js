// src/Components/TodoListDetails.js
import React, { useState } from "react";
import { db } from "../firebaseConfig";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore"; // Ensure arrayRemove is imported
import { useDrop } from "react-dnd";
import DraggableTask from "./DraggableTask";
import { ItemTypes } from "./ItemTypes"; // Ensure the path is correct
import "../App.css";

const TodoListDetails = ({ list }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskPriority, setTaskPriority] = useState("Low");

  const handleAddTask = async () => {
    const task = {
      title: taskTitle,
      description: taskDescription,
      dueDate: taskDueDate,
      priority: taskPriority,
    };

    await updateDoc(doc(db, "todoLists", list.id), {
      tasks: arrayUnion(task),
    });

    setTaskTitle("");
    setTaskDescription("");
    setTaskDueDate("");
    setTaskPriority("Low");
  };

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.TASK,
    drop: (item) => {
      if (item.listId !== list.id) {
        moveTaskToDifferentList(item.task, item.listId, list.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const moveTaskToDifferentList = async (task, fromListId, toListId) => {
    const fromListRef = doc(db, "todoLists", fromListId);
    const toListRef = doc(db, "todoLists", toListId);

    await updateDoc(fromListRef, {
      tasks: arrayRemove(task),
    });

    await updateDoc(toListRef, {
      tasks: arrayUnion(task),
    });
  };

  return (
    <div ref={drop} className="task-list">
      <h3>{list.name}</h3>
      <input
        type="text"
        placeholder="Task Title"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Task Description"
        value={taskDescription}
        onChange={(e) => setTaskDescription(e.target.value)}
      />
      <input
        type="date"
        value={taskDueDate}
        onChange={(e) => setTaskDueDate(e.target.value)}
      />
      <select
        value={taskPriority}
        onChange={(e) => setTaskPriority(e.target.value)}
      >
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>
      <button onClick={handleAddTask}>Add Task</button>

      <ul>
        {list.tasks?.map((task, index) => (
          <DraggableTask
            key={index}
            index={index}
            task={task}
            listId={list.id}
            moveTask={moveTaskToDifferentList}
          />
        ))}
      </ul>
    </div>
  );
};

export default TodoListDetails;
