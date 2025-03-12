import React from "react";
import { FaArrowRight } from "react-icons/fa";

const Hero = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 px-6 md:px-12">
      <div className="flex flex-col md:flex-row items-center max-w-6xl w-full">
        <div className="md:w-1/2 text-left space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-gray-900">
            The most powerful <br />
            <span className="text-[#80B538] capitalize text-5xl md:text-7xl">
              social intelligence
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-700">
            Choose the social suite founded in deep analytics, pioneering AI, and
            the strongest customer support on the market.
          </p>
          <div className="flex gap-4 mt-6">
            <button className="px-6 py-3 bg-[#80B538] text-white font-semibold rounded-full flex items-center gap-2 shadow-md transition-transform transform hover:scale-105">
              Get Started <FaArrowRight />
            </button>
            <button className="px-6 py-3 border border-gray-700 text-gray-700 font-semibold rounded-full shadow-md transition-transform transform hover:scale-105 hover:bg-gray-100">
              Explore Plans
            </button>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center mt-10 md:mt-0">
          <img
            className="w-full max-w-lg"
            src="https://s14415.pcdn.co/wp-content/themes/brandwatch/src/site--brandwatch.com/assets/img/homepage/hero/slide_one.png"
            alt="Social Intelligence"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
