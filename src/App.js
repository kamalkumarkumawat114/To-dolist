// src/App.js
import React from "react";

import "./App.css";
import Signup from "./Components/SignUp";
import Login from "./Components/Login";
import TodoList from "./Components/ToDoList";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Signup/>
      <Login />
      <TodoList />
      </DndProvider>
  );
}

export default App;
