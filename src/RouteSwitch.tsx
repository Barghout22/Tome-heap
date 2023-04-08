import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Header from "./components/Header";

const RouteSwitch = () => {
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path="/" element={<App />} />
        {/* <Route path="/profile" element={<Profile />} /> */}
      </Routes>
    </BrowserRouter>
  );
};
export default RouteSwitch;
