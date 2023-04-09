import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Header from "./components/Header";
import LogInPopUp from "./components/loginPopUp";

const RouteSwitch = () => {
  const [logInStatus, setLogInStatus] = useState("none");
  return (
    <BrowserRouter>
      <Header setLogInStatus={setLogInStatus} />
      {logInStatus !== "none" && (
        <LogInPopUp status={logInStatus} setLogInStatus={setLogInStatus} />
      )}
      <Routes>
        <Route path="/" element={<App />} />
        {/* <Route path="/profile" element={<Profile />} /> */}
      </Routes>
    </BrowserRouter>
  );
};
export default RouteSwitch;
