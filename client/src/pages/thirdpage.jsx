import { FaArrowRight } from "react-icons/fa";
//rounded-xl shadow-lg max-w-full
export default function HeroSectionStacked() {
  return (
    <div className="flex flex-col items-center justify-center px-10 py-16 space-y-16">
      {/* First Section - Image Left, Text Right */}
      <div className="flex flex-col md:flex-row items-center justify-between w-full mt-20">
        {/* Left Side - Image */}
        <div className="md:w-1/3 flex justify-center">
          <img
            src="https://s14415.pcdn.co/wp-content/themes/brandwatch/src/core/endpoints/resize.php?image=themes/brandwatch/src/site--brandwatch.com/assets/img/homepage/react/globe-thur-midday.jpg&width=0"
            alt="Trends showcase"
            className="rounded-xl max-w-full"
          />
        </div>

        {/* Right Side - Text */}
        <div className="md:w-1/2 text-left mt-10 md:mt-0">
          <h1 className="text-5xl md:text-6xl font-bold text-black leading-tight">
            React to the <span className="text-green-500">trends</span> that matter
          </h1>
          <p className="text-gray-600 text-2xl mt-4">
            Access the world’s largest archive of consumer opinion and leverage
            advanced proprietary and generative AI to{" "}
            <span className="font-semibold">
              discover new trends before anyone else and make smarter decisions.
            </span>
          </p>

          <button className="mt-6 px-6 py-3 flex items-center text-white bg-green-500 rounded-lg hover:bg-gray-900 transition hover:cursor-pointer">
            Get started <FaArrowRight className="ml-2" />
          </button>
        </div>
      </div>

      {/* Second Section - Text Left, Image Right */}
      <div className="flex flex-col md:flex-row items-center justify-between w-full mt-20">
        {/* Left Side - Text */}
        <div className="md:w-1/2 text-left">
          <h1 className="text-5xl md:text-6xl font-bold text-black leading-tight">
            React to the <span className="text-green-500">trends</span> that matter
          </h1>
          <p className="text-gray-600 text-2xl mt-4">
            Access the world’s largest archive of consumer opinion and leverage
            advanced proprietary and generative AI to{" "}
            <span className="font-semibold">
              discover new trends before anyone else and make smarter decisions.
            </span>
          </p>

        </div>

        {/* Right Side - Image */}
        <div className="md:w-1/3 flex justify-center mt-10 md:mt-0">
          <img
            src="https://www.brandwatch.com/wp-content/themes/brandwatch/src/core/endpoints/resize.php?image=themes/brandwatch/src/site--brandwatch.com/assets/img/homepage/collaborate/collaborate_on_data-driven_content-2.jpg&width=0"
            alt="Trends showcase"
            className="rounded-xl  max-w-full"
          />
        </div>
      </div>
      {/* 3rd Section - Image Left, Text Right */}
      <div className="flex flex-col md:flex-row items-center justify-between w-full mt-20">
        {/* Left Side - Image */}
        <div className="md:w-1/3 flex justify-center">
          <img
            src="https://s14415.pcdn.co/wp-content/themes/brandwatch/src/core/endpoints/resize.php?image=themes/brandwatch/src/site--brandwatch.com/assets/img/homepage/shield/bg--thu-midday.jpg&width=0"
            alt="Trends showcase"
            className="rounded-xl  max-w-full"
          />
        </div>

        {/* Right Side - Text */}
        <div className="md:w-1/2 text-left mt-10 md:mt-0">
          <h1 className="text-5xl md:text-6xl font-bold text-black leading-tight">
            React to the <span className="text-green-500">trends</span> that matter
          </h1>
          <p className="text-gray-600 text-2xl mt-4">
            Access the world’s largest archive of consumer opinion and leverage
            advanced proprietary and generative AI to{" "}
            <span className="font-semibold">
              discover new trends before anyone else and make smarter decisions.
            </span>
          </p>
        </div>
      </div>
      {/* 4th Section - Text Left, Image Right */}
      <div className="flex flex-col md:flex-row items-center justify-between w-full mt-30">
        {/* Left Side - Text */}
        <div className="md:w-1/2 text-left">
          <h1 className="text-5xl md:text-6xl font-bold text-black leading-tight">
            React to the <span className="text-green-500">trends</span> that matter
          </h1>
          <p className="text-gray-600 text-2xl mt-4">
            Access the world’s largest archive of consumer opinion and leverage
            advanced proprietary and generative AI to{" "}
            <span className="font-semibold">
              discover new trends before anyone else and make smarter decisions.
            </span>
          </p>

        </div>

        {/* Right Side - Image */}
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
}

