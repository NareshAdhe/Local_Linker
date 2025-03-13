
import React from "react";

const ContactMe = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center  bg-gray-100 p-6 rounded-3xl">
      {/* Left Side - Image */}
      <div className="md:w-1/2 flex justify-center">
        <img
          src="https://plus.unsplash.com/premium_photo-1684966119402-e237566d4576?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // Replace with actual image URL
          alt="Contact Illustration"
          className="w-80 md:w-96 rounded-lg shadow-lg "
        />
      </div>

      {/* Right Side - Contact Form */}
      <div className="md:w-1/2 bg-white p-8 rounded-lg shadow-lg mt-6 md:mt-0">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
          Contact Me
        </h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded mt-1"
              placeholder="Enter your name"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded mt-1"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Message</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded mt-1"
              placeholder="Enter your message"
              rows="4"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactMe;
