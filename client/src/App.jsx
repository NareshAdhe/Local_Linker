import React from "react";
import Navbar from "./components/Navbar";
import SecPage from "./pages/SecPage";
import Hero from "./components/Hero";

const App = () => {
  return (
    <div className="w-full sm:max-w-7xl min-h-screen bg-white mx-auto border-2 border-gray-200">
      <Navbar />
      <Hero />
      <SecPage />
    </div>
  );
};

export default App;
