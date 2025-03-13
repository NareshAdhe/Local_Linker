import React from "react";
import Hero from "../components/Hero";
import Features from "./Features";
import Thirdpage from "./DetailedFeatures";
import ContactMe from "./contactme";

const Home = () => {
  return (
    <div>
      <Hero />
      <Features />
      <Thirdpage />
      <ContactMe />
    </div>
  );
};

export default Home;
