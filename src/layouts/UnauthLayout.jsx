import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar.jsx";

export default function UnauthLayout() {
  return (
    <div className="flex flex-col bg-[#0c1425]  mx-auto max-w-[1000px]">
      <NavBar/>
      <Outlet/>
    </div>
  );
}
