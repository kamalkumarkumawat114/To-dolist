// src/TodoList.js
import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import TodoListDetails from "./TodoListDetails";
import "../App.css";

const TodoList = () => {
  const [listName, setListName] = useState("");
  const [todoLists, setTodoLists] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "todoLists"), (snapshot) => {
      setTodoLists(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  const handleCreateList = async () => {
    if (listName) {
      await addDoc(collection(db, "todoLists"), { name: listName, tasks: [] });
      setListName("");
    }
  };

  return (
    <div className="container">
      <div className="todo-list">
        <h2>Create To-Do List</h2>
        <input
          type="text"
          placeholder="List Name"
          value={listName}
          onChange={(e) => setListName(e.target.value)}
        />
        <button onClick={handleCreateList}>Create List</button>
      </div>

      <div>
        {todoLists.map((list) => (
          <TodoListDetails key={list.id} list={list} />
        ))}
      </div>
    </div>
  );
};

export default TodoList;
