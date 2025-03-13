import React from "react";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import VerifyOTP from "./pages/VerifyOtp";
const App = () => {
  return (
    <>
      <div className="w-full sm:max-w-[80%] min-h-screen bg-white mx-auto">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify" element={<VerifyOTP />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
