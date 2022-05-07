import * as React from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import Utensil from "./Utensil";
import Profile from "./Profile";
import EditProfile from "./EditProfile";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/utensil" />} />
        <Route path="utensil" element={<Utensil />} />
        <Route path="profile" element={<Profile />} />
        <Route path="profile/edit" element={<EditProfile />} />
      </Routes>
    </div>
  );
}

export default App;