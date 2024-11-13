import React, { useState } from "react";
import { db } from "../firebaseConfig";
import { updateDoc, doc, arrayUnion } from "firebase/firestore";
import { Draggable } from "react-beautiful-dnd";

function Task({ list }) {
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Low",
  });

  const addTask = async () => {
    if (!newTask.title || !newTask.description || !newTask.dueDate || !newTask.priority) {
      alert("Please fill all task fields.");
      return;
    }

    try {
      const listRef = doc(db, "lists", list.id);
      await updateDoc(listRef, {
        tasks: arrayUnion(newTask), 
      });
      
      setNewTask({ title: "", description: "", dueDate: "", priority: "Low" });
    } catch (error) {
      console.error("Error adding task: ", error);
    }
  };

  return (
    <div>
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

      <div className="tasks-list">
        {list.tasks && list.tasks.map((task, index) => (
          <Draggable draggableId={task.id || `${task.title}-${index}`} index={index} key={task.id || index}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className="task"
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
