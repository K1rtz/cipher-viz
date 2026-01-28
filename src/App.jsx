import './App.css'
import React from "react";
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Simulation from './pages/Simulation'
import UnauthLayout from "./layouts/UnauthLayout.jsx";
function App() {

  return (
    <Routes>
      <Route element={<UnauthLayout/>}>
        <Route path="/" element={<Home />} />
        <Route path="/simulation" element={<Simulation />} />
      </Route>
    </Routes>
  )
}

export default App
