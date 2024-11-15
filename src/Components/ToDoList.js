import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { addDoc, collection, onSnapshot, query, where, updateDoc, doc } from "firebase/firestore";
import Task from "./Task";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import "./LoginSignup.css"

function ToDoList({ user }) {
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState("");

  useEffect(() => {
    const q = query(collection(db, "lists"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const listsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setLists(listsData);
    });
    return unsubscribe;
  }, [user]);

  const createList = async () => {
    if (!newListName) {
      alert("Please enter a list name.");
      return;
    }
    try {
      await addDoc(collection(db, "lists"), {
        userId: user.uid,
        name: newListName,
        tasks: [],
      });
      setNewListName("");
    } catch (error) {
      alert("Error creating list: " + error.message);
    }
  };


const onDragEnd = async (result) => {
  const { source, destination } = result;

  if (!destination) return; // Exit if dropped outside any area

  const sourceList = lists.find((list) => list.id === source.droppableId);
  const destinationList = lists.find((list) => list.id === destination.droppableId);

  const sourceTasks = Array.from(sourceList.tasks);
  const [movedTask] = sourceTasks.splice(source.index, 1);

  // Check if dropped on a priority area
  if (destination.droppableId === "highPriority") {
    movedTask.priority = "High";
  } else if (destination.droppableId === "mediumPriority") {
    movedTask.priority = "Medium";
  } else if (destination.droppableId === "lowPriority") {
    movedTask.priority = "Low";
  } else if (sourceList !== destinationList) {
    // Moving to a different list
    const destinationTasks = Array.from(destinationList.tasks);
    destinationTasks.splice(destination.index, 0, movedTask);

    // Update both lists locally
    const updatedLists = lists.map((list) => {
      if (list.id === sourceList.id) return { ...list, tasks: sourceTasks };
      if (list.id === destinationList.id) return { ...list, tasks: destinationTasks };
      return list;
    });
    setLists(updatedLists);

    // Update both lists in Firebase
    try {
      const sourceListRef = doc(db, "lists", sourceList.id);
      const destinationListRef = doc(db, "lists", destinationList.id);
      await updateDoc(sourceListRef, { tasks: sourceTasks });
      await updateDoc(destinationListRef, { tasks: destinationTasks });
    } catch (error) {
      console.error("Error updating lists in Firebase:", error);
    }
    return;
  }

  // Update priority within the same list
  sourceTasks.splice(destination.index, 0, movedTask);
  const updatedList = { ...sourceList, tasks: sourceTasks };
  setLists(lists.map((list) => (list.id === sourceList.id ? updatedList : list)));

  // Update Firebase for single list if moving within the same list
  try {
    const listRef = doc(db, "lists", sourceList.id);
    await updateDoc(listRef, { tasks: sourceTasks });
  } catch (error) {
    console.error("Error updating list in Firebase:", error);
  }
};




  return (
    <div className="todo-container">
      <h2>To-Do Lists</h2>
      <input
        type="text"
        placeholder="New List Name"
        value={newListName}
        onChange={(e) => setNewListName(e.target.value)}
      />
      <button onClick={createList}>Create List</button>

      <DragDropContext onDragEnd={onDragEnd}>
        {/* Priority Buttons as Droppable Areas */}
        <div className="priority-buttons">
          <Droppable droppableId="highPriority">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="priority-button-high">
                Drop Here for High Priority
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <Droppable droppableId="mediumPriority">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="priority-button-medium">
                Drop Here for Medium Priority
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <Droppable droppableId="lowPriority">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="priority-button-low">
                Drop Here for Low Priority
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>

        {/* Lists */}
        {lists.map((list) => (
          <Droppable droppableId={list.id} key={list.id}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="todo-list"
              >
                <h3>{list.name}</h3>
                <Task list={list} />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </div>
  );
}

export default ToDoList;
