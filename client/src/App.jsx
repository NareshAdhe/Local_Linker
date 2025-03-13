import React from "react";
import Navbar from "./components/Navbar";
import SecPage from "./pages/secpage";
import Hero from "./components/Hero";
import Thirdpage from "./pages/thirdpage";
import ContactMe from "./pages/contactme";
const App = () => {
  return (
    <>
      <div className="w-full sm:max-w-[80%] min-h-screen bg-white mx-auto">
        <Navbar />
        <Hero />
        <SecPage />
        <Thirdpage />
      </div>
    </>
  );
};

export default App;
