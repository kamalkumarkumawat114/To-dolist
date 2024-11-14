import React, { useState } from "react";
import { db } from "../firebaseConfig";
import { updateDoc, doc, arrayUnion } from "firebase/firestore";
import { Draggable } from "react-beautiful-dnd";
import "./LoginSignup.css"

function Task({ list }) {
  const [newTask, setNewTask] = useState({
    id: `${Date.now()}`, // unique ID based on timestamp
    title: "",
    description: "",
    dueDate: "",
    priority: "Low",
  });

  const addTask = async () => {
    if (!newTask.title || !newTask.description || !newTask.dueDate) {
      alert("Please fill all task fields.");
      return;
    }

    try {
      const listRef = doc(db, "lists", list.id);
      await updateDoc(listRef, {
        tasks: arrayUnion(newTask),
      });
      setNewTask({ id: `${Date.now()}`, title: "", description: "", dueDate: "", priority: "Low" });
    } catch (error) {
      console.error("Error adding task: ", error);
    }
  };

  return (
    <div>
      {/* Form to Add a New Task */}
      <input
        type="text"
        placeholder="Task Title"
        value={newTask.title}
        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
      />
      <input
        type="text"
        placeholder="Task Description"
        value={newTask.description}
        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
      />
      <input
        type="date"
        value={newTask.dueDate}
        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
      />
      <select
        value={newTask.priority}
        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <button onClick={addTask}>Add Task</button>

      {/* List of Tasks with Drag-and-Drop Functionality */}
      <div className="tasks-list">
        {list.tasks && list.tasks.map((task, index) => (
          <Draggable draggableId={task.id} index={index} key={task.id}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className={`task task-${task.priority.toLowerCase()}`}
              >
                <h4>{task.title}</h4>
                <p>{task.description}</p>
                <p>Due Date: {task.dueDate}</p>
                <p>Priority: {task.priority}</p>
              </div>
            )}
          </Draggable>
        ))}
      </div>
    </div>
  );
}

export default Task;
