import React from "react";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import VerifyOTP from "./pages/VerifyOtp";
import Reel from "./components/Reel";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Features from "./pages/Features";
import Contact from "./pages/ContactMe";
import Search from "./pages/Search";
import Reset from "./pages/Reset";
import OtherUser from "./pages/OtherUser";
import ChatApp from "./pages/ChatApp";
const App = () => {
  return (
    <>
      <div className="w-full sm:max-w-[80%] min-h-screen bg-white mx-auto">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify" element={<VerifyOTP />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/reels" element={<Reel />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/search" element={<Search />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/profile/:id" element={<OtherUser />} />
          <Route path="/chat/:receiver" element={<ChatApp />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
