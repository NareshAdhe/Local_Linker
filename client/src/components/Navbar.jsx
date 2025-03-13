import React from "react";
import Logo from "../assets/Local_Linker_Logo.png";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <nav className="flex justify-between items-center py-4 text-white">
      <div className="flex items-center gap-2 ">
        <img
          src={Logo}
          alt="Logo"
          className="w-16 aspect-square p-1 rounded-full"
        />
        <h1 className="text-2xl font-extrabold text-black tracking-wider">
          LocalLinker
        </h1>
      </div>

      <ul className="flex gap-6 text-lg font-semibold">
        {["Home", "Services", "About", "Contact", "Blog"].map((item, index) => (
          <li
            key={index}
            className="hover:text-[#929194] text-[#333] tracking-wide transition duration-300 cursor-pointer text-black font-bold"
          >
            {item}
          </li>
        ))}
      </ul>
      <div className="flex gap-4">
        <Link
          to={"/login"}
          className="text-center bg-white text-black w-32 py-2 rounded-md text-sm font-bold border-gray-200 border-2 hover:bg-gray-100 transition duration-100 cursor-pointer"
        >
          Sign Up
        </Link>
        <button className="text-center bg-[#80B538] text-white w-32 py-2 rounded-md text-sm font-bold hover:bg-[#80B500] transition duration-100 cursor-pointer">
          Get Started
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
