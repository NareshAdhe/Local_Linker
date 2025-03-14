import Logo from "../assets/Local_Linker_Logo.png";
import { Link, NavLink } from "react-router-dom";
import React, { useContext, useState } from "react";
import { AppContext } from "../context/Context";
import { useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { FaUser } from "react-icons/fa";
import { TbLogout } from "react-icons/tb";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import axios from "axios";
import { CiSearch } from "react-icons/ci";

const Navbar = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const { backendURI, setLoggedIn, loggedIn } = useContext(AppContext);

  const handleLogout = async () => {
    try {
      const url = backendURI + "/api/auth/logout";
      const response = await axios.post(
        url,
        {},
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setLoggedIn(false);
        navigate("/");
        localStorage.removeItem("authToken");
        toast.success(response.data.message, {
          autoClose: 2000,
        });
      } else {
        toast.error(response.data.message, {
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.error(error.message, {
        autoClose: 2000,
      });
    }
  };

  const routes = {
    Home: "/",
    About: "/about",
    Features: "/features",
    Reels: "/reels",
    Contact: "/contact",
  };

  return (
    <nav className="flex justify-between items-center py-4 text-white">
      <Link to={"/"} className="flex items-center gap-2">
        <img
          src={Logo}
          alt="Logo"
          className="w-16 aspect-square p-1 rounded-full"
        />
        <h1 className="text-2xl font-extrabold text-black tracking-wider">
          LocalLinker
        </h1>
      </Link>

      <ul className="flex gap-10 text-lg font-semibold">
        {[
          "Home",
          "About",
          "Features",
          "Reels",
          ...(loggedIn ? ["Contact"] : []),
        ].map((item, index) => (
          <NavLink
            key={index}
            to={routes[item]}
            className={({ isActive }) =>
              isActive
                ? "text-[#80B538] font-bold tracking-wide transition duration-300 cursor-pointer"
                : "text-[#333] hover:text-[#929194] font-bold tracking-wide transition duration-300 cursor-pointer"
            }
          >
            {item}
          </NavLink>
        ))}
      </ul>

      <div className="flex items-center gap-8">
        {loggedIn && (
          <Link to={"/search"} className="text-black text-4xl">
            <CiSearch />
          </Link>
        )}
        {!loggedIn ? (
          <Link
            to={"/login"}
            className="text-center bg-[#80B538] text-white w-32 py-2 rounded-md text-sm font-bold hover:bg-[#80B500] transition duration-100 cursor-pointer"
          >
            Sign Up
          </Link>
        ) : (
          <div className="profile-wrapper relative z-10">
            <motion.div whileTap={{ scale: 0.9 }}>
              <CgProfile
                className="text-4xl cursor-pointer bg-gray-400 rounded-full"
                onClick={() => setShowDropdown((prev) => !prev)}
              />
            </motion.div>
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  onMouseLeave={() => setShowDropdown(false)}
                  className="absolute w-fit bg-white right-[0%] top-[180%] px-2 py-4 border-2 rounded-md shadow-lg"
                  initial={{ opacity: 0, y: "50%", scale: 0 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: "50%", scale: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    onClick={handleLogout}
                    className="group text-gray-600 hover:text-gray-500 px-4 py-2 cursor-pointer flex gap-20 justify-between items-center"
                  >
                    <span>Logout</span>
                    <TbLogout className="text-md font-bold group-hover:translate-x-1 transition-all" />
                  </Link>
                  <Link
                    to="/profile"
                    className="group text-gray-600 hover:text-gray-500 px-4 py-2 cursor-pointer flex justify-between items-center"
                  >
                    <span>Profile</span>
                    <FaUser className="text-md font-bold group-hover:translate-x-1 transition-all" />
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
