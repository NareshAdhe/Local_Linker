import React, { useCallback, useContext, useState, useEffect } from "react";
import Button from "../components/Button";
import { AppContext } from "../context/Context.jsx";
import axios from "axios";
import { Link } from "react-router-dom";
import { GoEye, GoEyeClosed } from "react-icons/go";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { PiSignIn } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [login, setLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "businessman",
  });
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const { backendURI, setOtpSent } = useContext(AppContext);
  const [buttonHovered, setButtonHovered] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let url = backendURI + "/api/auth/register";
    if (login) {
      url = backendURI + "/api/auth/login";
    }
    setLoading(true);
    try {
      const response = await axios.post(url, formData, {
        withCredentials: true,
      });
      setLoading(false);
      if (response.data.success) {
        setOtpSent(true);
        navigate("/verify");
        toast.success(response.data.message, {
          autoClose: 2000,
        });
      } else {
        toast.error(response.data.message, {
          autoClose: 2000,
        });
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.message, {
        autoClose: 2000,
      });
    }
  };

  const handleClick = useCallback(() => {
    setLogin((prev) => !prev);
  }, [login]);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const containerVarients = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.5,
      },
    },
  };

  const childVarients = {
    hidden: {
      opacity: 0,
      y: "10%",
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        delay: 0.1,
      },
    },
  };

  useEffect(() => {
    setFormData({
      name: "",
      email: "",
      password: "",
    });
  }, []);

  return (
    <motion.div
      variants={containerVarients}
      initial="hidden"
      animate="visible"
      className="relative flex w-full h-fit py-24 items-center justify-center flex-col"
    >
      <motion.div
        variants={childVarients}
        initial="hidden"
        animate="visible"
        className="container w-96 border-2 border-gray-400 p-5 rounded-md scale-110 shadow-xl"
      >
        <h1 className="text-center text-black text-2xl font-bold font-sans mb-4">
          {login ? "Login" : "Sign Up"}
        </h1>
        <form method="post" onSubmit={handleSubmit} autoComplete="off">
          {!login && (
            <>
              <label
                htmlFor="name"
                className="text-xl text-black inline-block mb-2"
              >
                Name
              </label>
              <br />
              <input
                value={formData.name}
                onChange={handleChange}
                autoComplete="off"
                className="relative bg-[#E8F0FE] rounded px-3 py-2 text-black text-lg border-none focus:outline-gray-600 focus:outline-2 focus:shadow-sm mb-5 w-full"
                required
                type="text"
                name="name"
                id="name"
                placeholder="Name"
              />
              <br />
            </>
          )}
          <label
            htmlFor="email"
            className="text-xl text-black inline-block mb-2"
          >
            Email
          </label>
          <br />
          <input
            value={formData.email}
            onChange={handleChange}
            autoComplete="off"
            className="bg-[#E8F0FE] rounded-md px-3 py-2 text-black text-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-lg mb-5 w-full transition-all duration-300"
            required
            type="email"
            name="email"
            id="email"
            placeholder="Email"
          />
          <br />
          <label
            htmlFor="password"
            className="text-xl text-black inline-block mb-2"
          >
            Password
          </label>
          <br />
          <div className="relative h-fit">
            <input
              autoComplete="off"
              value={formData.password}
              onChange={handleChange}
              className="bg-[#E8F0FE] rounded-md px-3 py-2 text-black text-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-lg w-full transition-all duration-300"
              required
              type={passwordVisible ? "text" : "password"}
              name="password"
              id="password"
              placeholder="Password"
            />
            <div
              className="absolute top-1/3 right-3 cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {passwordVisible ? <GoEye /> : <GoEyeClosed />}
            </div>
            {login && (
              <Link
                to={"/reset"}
                className="absolute left-0 -bottom-6 text-black hover:text-gray-900 hover:underline text-sm"
              >
                forgot password?
              </Link>
            )}
          </div>
          <br />
          {!login && (
            <div className="mb-5">
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  className={`px-4 py-2 bg-[#E8F0FE] rounded-lg cursor-pointer transition-all duration-300 ${
                    formData.role !== "businessman" && "bg-gray-200"
                  }`}
                  onClick={() =>
                    setFormData({ ...formData, role: "businessman" })
                  }
                >
                  Businessman
                </button>

                <button
                  type="button"
                  className={`px-4 py-2 rounded-lg cursor-pointer transition-all duration-300 ${
                    formData.role === "influencer"
                      ? "bg-[#E8F0FE]"
                      : "bg-gray-200"
                  }`}
                  onClick={() =>
                    setFormData({ ...formData, role: "influencer" })
                  }
                >
                  Influencer
                </button>
              </div>
            </div>
          )}
          <Button
            onMouseEnter={() => setButtonHovered(true)}
            onMouseLeave={() => setButtonHovered(false)}
            type="submit"
            className="relative cursor-pointer flex items-center justify-center bg-gray-900 text-white text-lg mx-auto capitalize rounded-md w-full py-1 mt-5 mb-2"
            disabled={loading}
          >
            {loading ? "Loading..." : login ? "Sign In" : "Sign Up"}
            <motion.span
              animate={{
                right: buttonHovered ? 10 : 16,
              }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 10,
                velocity: 200,
                duration: 0.5,
              }}
              className="absolute right-16 top-1/2 -translate-y-1/2"
            >
              {" "}
              <PiSignIn />
            </motion.span>
          </Button>
          <span
            className="w-full inline-block text-center text-lg hover:text-gray-800 hover:underline cursor-pointer"
            onClick={handleClick}
          >
            {!login ? "Already have an account ?" : "Don't have an account ?"}
          </span>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Login;
