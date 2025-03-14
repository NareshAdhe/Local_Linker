import React from "react";

const ContactMe = () => {
  return (
    <div className="mt-12 flex gap-10 flex-col md:flex-row items-center justify-center bg-gray-900 rounded-lg mb-10">
      <div className="text-white p-8 md:p-16">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Ready to build <br />
            <span className="block">unstoppable influencer</span>
            <span className="block">marketing campaigns?</span>
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            Whether you’re brand or agency side, Influence creates a smooth
            experience for you and your influencers from start to finish.
          </p>
          <p className="mt-4 text-lg text-gray-300">
            Complete the form to find out more.
          </p>
        </div>
      </div>
      <div className="md:w-1/2 py-8 px-16 rounded-lg mt-6 md:mt-0">
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Contact Me
        </h2>
        <form>
          <div className="mb-4 text-gray-200">
            <label className="block">Name</label>
            <input
              type="text"
              className="p-2 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:shadow-lg mb-2 mt-1 w-full transition-all duration-300"
              placeholder="Enter your name"
            />
          </div>
          <div className="mb-4 text-gray-200">
            <label className="block">Email</label>
            <input
              type="email"
              className="p-2 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:shadow-lg mb-2 mt-1 w-full transition-all duration-300"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4 text-gray-200">
            <label className="block">Message</label>
            <textarea
              className="resize-none p-2 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:shadow-lg mb-4 mt-1 w-full transition-all duration-300"
              placeholder="Enter your message"
              rows="4"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full cursor-pointer bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactMe;
