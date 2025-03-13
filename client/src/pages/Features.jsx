import { FaArrowRight } from "react-icons/fa";
import React from "react";

const Features = () => {
  return (
    <div className="flex flex-col items-center justify-center px-10 py-16 space-y-16">
      <div className="flex flex-col md:flex-row items-center justify-between w-full mt-20">
        <div className="md:w-1/3 flex justify-center">
          <img
            src="https://s14415.pcdn.co/wp-content/themes/brandwatch/src/core/endpoints/resize.php?image=themes/brandwatch/src/site--brandwatch.com/assets/img/homepage/react/globe-thur-midday.jpg&width=0"
            alt="Trends showcase"
            className="rounded-xl max-w-full"
          />
        </div>

        <div className="md:w-1/2 text-left mt-10 md:mt-0">
          <h1 className="text-5xl md:text-6xl font-bold text-black leading-tight">
          City-Specific <span className="text-green-500">Influencer</span> Discovery
            
          </h1>
          <p className="text-gray-600 text-2xl mt-4">
          Businesses can search for influencers in their city based{" "}
            <span className="font-semibold">
            on niche categories like travel, food, fashion, etc., ensuring hyper-local collaborations.
            </span>
          </p>

          <button className="mt-6 px-6 py-3 flex items-center text-white bg-green-500 rounded-lg hover:bg-gray-900 transition hover:cursor-pointer">
            Search <FaArrowRight className="ml-2" />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between w-full mt-20">
        <div className="md:w-1/2 text-left">
          <h1 className="text-5xl md:text-6xl font-bold text-black leading-tight">
          <span className="text-green-500">AI-Based </span> Influencer Reports
            
          </h1>
          <p className="text-gray-600 text-2xl mt-4">
          Enables direct communication between shop owners and influencers {" "}
            <span className="font-semibold">
            within the platform for seamless negotiation and collaboration.            </span>
          </p>
        </div>

        <div className="md:w-1/3 flex justify-center mt-10 md:mt-0">
          <img
            src="https://www.brandwatch.com/wp-content/themes/brandwatch/src/core/endpoints/resize.php?image=themes/brandwatch/src/site--brandwatch.com/assets/img/homepage/collaborate/collaborate_on_data-driven_content-2.jpg&width=0"
            alt="Trends showcase"
            className="rounded-xl  max-w-full"
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between w-full mt-20">
        <div className="md:w-1/3 flex justify-center">
          <img
            src="https://s14415.pcdn.co/wp-content/themes/brandwatch/src/core/endpoints/resize.php?image=themes/brandwatch/src/site--brandwatch.com/assets/img/homepage/shield/bg--thu-midday.jpg&width=0"
            alt="Trends showcase"
            className="rounded-xl  max-w-full"
          />
        </div>

        <div className="md:w-1/2 text-left mt-10 md:mt-0">
          <h1 className="text-5xl md:text-6xl font-bold text-black leading-tight">
          Ratings and<span className="text-green-500"> Reviews </span> Systems
            
          </h1>
          <p className="text-gray-600 text-2xl mt-4">
          Businesses can rate influencers based on past {" "}
            <span className="font-semibold">
            collaborations, ensuring credibility and trust in the selection process.
            </span>
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between w-full mt-30">
        <div className="md:w-1/2 text-left">
          <h1 className="text-5xl md:text-6xl font-bold text-black leading-tight">
          AI <span className="text-green-500">Chatbot</span> for Instant Support 
            
          </h1>
          <p className="text-gray-600 text-2xl mt-4">
          An AI-powered chatbot assists users with queries, helping them find{" "}
            <span className="font-semibold">
            influencers, troubleshoot issues, and navigate the platform easily.
            </span>
          </p>
        </div>
        <div className="md:w-1/3 flex justify-center mt-10 md:mt-0">
          <img
            src="https://s14415.pcdn.co/wp-content/themes/brandwatch/src/core/endpoints/resize.php?image=themes/brandwatch/src/site--brandwatch.com/assets/img/homepage/manage/manage-all-channels-with-ease.jpg&width=2200"
            alt="Trends showcase"
            className="rounded-xl  max-w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Features;
