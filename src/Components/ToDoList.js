import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { addDoc, collection, onSnapshot, query, where, updateDoc, doc } from "firebase/firestore";
import Task from "./Task";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

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
  
    // If the task is dropped outside any list
    if (!destination) return;
  
    // If the task was moved within the same list
    if (source.droppableId === destination.droppableId) {
      const sourceList = lists.find((list) => list.id === source.droppableId);
      const reorderedTasks = Array.from(sourceList.tasks);
      const [movedTask] = reorderedTasks.splice(source.index, 1);
      reorderedTasks.splice(destination.index, 0, movedTask);
  
      // Update the priority of tasks after reordering
      reorderedTasks.forEach((task, index) => {
        if (index === 0) task.priority = "High";
        else if (index === reorderedTasks.length - 1) task.priority = "Low";
        else task.priority = "Medium";
      });
  
      const updatedList = { ...sourceList, tasks: reorderedTasks };
      setLists(lists.map((list) => (list.id === sourceList.id ? updatedList : list)));
  
      // Update Firebase with reordered tasks and updated priorities
      const listRef = doc(db, "lists", sourceList.id);
      await updateDoc(listRef, { tasks: reorderedTasks });
    } else {
      // Moving task between different lists
      const sourceList = lists.find((list) => list.id === source.droppableId);
      const destList = lists.find((list) => list.id === destination.droppableId);
  
      const sourceTasks = Array.from(sourceList.tasks);
      const [movedTask] = sourceTasks.splice(source.index, 1);
  
      const destTasks = Array.from(destList.tasks);
      destTasks.splice(destination.index, 0, movedTask);
  
      //  the priority of tasks in both lists
      sourceTasks.forEach((task, index) => {
        if (index === 0) task.priority = "High";
        else if (index === sourceTasks.length - 1) task.priority = "Low";
        else task.priority = "Medium";
      });
  
      destTasks.forEach((task, index) => {
        if (index === 0) task.priority = "High";
        else if (index === destTasks.length - 1) task.priority = "Low";
        else task.priority = "Medium";
      });
  
      const updatedSourceList = { ...sourceList, tasks: sourceTasks };
      const updatedDestList = { ...destList, tasks: destTasks };
  
      setLists(
        lists.map((list) =>
          list.id === sourceList.id
            ? updatedSourceList
            : list.id === destList.id
            ? updatedDestList
            : list
        )
      );
  
      // Update Firebase for both source and destination lists
      const sourceListRef = doc(db, "lists", sourceList.id);
      const destListRef = doc(db, "lists", destList.id);
      await updateDoc(sourceListRef, { tasks: sourceTasks });
      await updateDoc(destListRef, { tasks: destTasks });
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
        {lists.map((list) => (
          <Droppable droppableId={list.id} key={list.id}>
            {(provided) => {
              return (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="todo-list"
                >
                  <h3>{list.name}</h3>
                  <Task list={list} />
                  {provided.placeholder}
                </div>
              );
            }}
          </Droppable>
        ))}
      </DragDropContext>
    </div>
  );
}

export default ToDoList;
