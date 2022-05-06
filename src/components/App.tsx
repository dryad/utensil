import * as React from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
// import "./App.css";
import Utensil   from "./Utensil";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/utensil" />} />
        <Route path="utensil" element={<Utensil />} />
      </Routes>
    </div>
  );
}

export default App;