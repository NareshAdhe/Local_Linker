import React from "react";
import { FaArrowRight } from "react-icons/fa";

const Hero = () => {
  return (
    <div className="relative w-full h-fit items-center justify-center my-20 mx-auto max-w-screen-2xl">
      <div className="flex flex-col md:flex-row w-full gap-8">
        {/* Left Content */}
        <div className="md:w-1/2 text-left space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold leading-snug text-gray-900">
            Unlock the Power of <br />
            <span className="text-[#80B538] capitalize text-6xl md:text-7xl drop-shadow-md">
              Social Intelligence
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 opacity-80 leading-relaxed">
            Gain insights like never before and transform the way you interact
            with the digital world.
          </p>
          <div className="flex gap-6 mt-8">
            <button className="px-8 py-4 bg-[#80B538] text-white font-semibold rounded-md flex items-center gap-3 shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl">
              Get Started <FaArrowRight />
            </button>
            <button className="px-8 py-4 border border-gray-700 text-gray-800 font-semibold rounded-md bg-white shadow-lg transition-transform transform hover:scale-105 hover:bg-gray-100">
              Explore Plans
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="md:w-1/2 flex justify-center mt-12 md:mt-0">
          <img
            className="w-full max-w-lg drop-shadow-lg transition-transform transform hover:scale-105"
            src="https://s14415.pcdn.co/wp-content/themes/brandwatch/src/site--brandwatch.com/assets/img/homepage/hero/slide_one.png"
            alt="Social Intelligence"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
