import React from "react";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <div className="w-full sm:max-w-7xl min-h-screen bg-white mx-auto border-2 border-gray-200">
      <Navbar />
      <div>App</div>
    </div>
  );
};

export default App;
