import React, { useState } from "react";
import Reel1 from "../assets/reel1.mp4";
import Reel2 from "../assets/reel2.mp4";
import Reel3 from "../assets/reel3.mp4";
import Reel4 from "../assets/reel4.mp4";
import Reel5 from "../assets/reel5.mp4";

const videoSlides = [Reel1, Reel2, Reel3, Reel4, Reel5];

const VideoBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const handleVideoEnd = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === videoSlides.length - 1 ? 0 : prevIndex + 1
      );
      setFade(true);
    }, 500);
  };

  const goToNextVideo = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === videoSlides.length - 1 ? 0 : prevIndex + 1
      );
      setFade(true);
    }, 300);
  };

  const goToPrevVideo = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? videoSlides.length - 1 : prevIndex - 1
      );
      setFade(true);
    }, 300);
  };

  return (
    <div className="relative w-full h-[75vh] overflow-hidden bg-black mt-10 rounded-2xl">
      <div
        className="absolute inset-0 w-full h-full transition-opacity duration-1000"
        style={{ opacity: fade ? 1 : 0 }}
      >
        <video
          key={currentIndex}
          src={videoSlides[currentIndex]}
          autoPlay
          muted
          className="w-full h-full object-cover"
          onEnded={handleVideoEnd}
        ></video>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

      <div className="absolute w-full text-center bottom-16 left-1/2 transform -translate-x-1/2 text-[#ffffff6d] px-6">
        <h1 className="text-6xl font-extrabold drop-shadow-2xl animate-fade-in">
          Explore the Experience
        </h1>
        <p className="text-xl mt-2 opacity-90 animate-slide-up text-center">
          Immerse yourself in stunning visuals with our exclusive reel showcase.
        </p>
      </div>

      <button
        onClick={goToPrevVideo}
        className="absolute backdrop-blur-2xl left-5 top-1/2 transform -translate-y-1/2 bg-[#ffffff36] text-white w-16 h-16 flex items-center justify-center rounded-full transition hover:cursor-pointer"
      >
        ❮
      </button>
      <button
        onClick={goToNextVideo}
        className="absolute right-5 top-1/2 transform -translate-y-1/2 bg-[#ffffff36] text-white w-16 h-16 flex items-center justify-center rounded-full transition hover:cursor-pointer"
      >
        ❯
      </button>

      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-3 flex gap-4">
        {videoSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-4 h-4 flex items-center justify-center rounded-full text-lg font-bold transition-all duration-300 shadow-lg ${
              currentIndex === index
                ? "bg-white text-black scale-110"
                : "bg-gray-600 text-white hover:bg-gray-400"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default VideoBanner;
