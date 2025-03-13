import React, { useCallback, useContext, useState, useEffect } from "react";
import Button from "../components/Button";
import { AppContext } from "../context/Context.jsx";
import axios from "axios";
import { Link } from "react-router-dom";
import { GoEye, GoEyeClosed } from "react-icons/go";
import { toast } from "react-toastify";
// import { TailSpin } from "react-loader-spinner";
import { IoIosArrowRoundBack } from "react-icons/io";
import { motion } from "framer-motion";
import { PiSignIn } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [login, setLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const { backendURI, setOtpSent, setIsLogging } = useContext(AppContext);
  const [isHovered, setIsHovered] = useState(false);
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
      y: "50%",
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
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
      className="relative p-[5vw] w-screen h-screen bg-white flex items-center justify-center"
    >
      <motion.button
        onClick={() => {
          setIsLogging(false);
          navigate("/");
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileTap={{ scale: 0.95, transition: { duration: 0.2 } }}
        initial={{ opacity: 0, x: "100%" }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="absolute inline-flex items-center gap-1 text-xl text-white p-2 rounded-md top-10 left-5 bg-black"
      >
        <motion.span
          animate={{ x: isHovered ? -5 : 0 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 10,
            velocity: 200,
            duration: 0.5,
          }}
        >
          <IoIosArrowRoundBack size={30} />
        </motion.span>{" "}
        <span>Home</span>
      </motion.button>
      <motion.div
        variants={childVarients}
        initial="hidden"
        animate="visible"
        className="container w-96 bg-gradient-to-b from-black via-[#00152d] to-white p-5 rounded-md shadow-lg"
      >
        <h1 className="text-center text-white text-2xl font-bold font-sans mb-4">
          {login ? "Login" : "Sign Up"}
        </h1>
        <form method="post" onSubmit={handleSubmit} autoComplete="off">
          {!login && (
            <>
              <label
                htmlFor="name"
                className="text-xl text-white inline-block mb-2"
              >
                Name
              </label>
              <br />
              <input
                value={formData.name}
                onChange={handleChange}
                autoComplete="off"
                className="relative bg-[#E8F0FE] rounded px-2 py-1 text-black text-lg border-none focus:outline focus:outline-gray-600 focus:outline-2 focus:shadow-sm mb-5 w-full"
                required
                type="text"
                name="name"
                id="name"
              />
              <br />
            </>
          )}
          <label
            htmlFor="email"
            className="text-xl text-white inline-block mb-2"
          >
            Email
          </label>
          <br />
          <input
            value={formData.email}
            onChange={handleChange}
            autoComplete="off"
            className="bg-[#E8F0FE] rounded-md px-4 py-2 text-black text-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-lg mb-5 w-full transition-all duration-300"
            required
            type="email"
            name="email"
            id="email"
          />
          <br />
          <label
            htmlFor="password"
            className="text-xl text-white inline-block mb-2"
          >
            Password
          </label>
          <br />
          <div className="relative h-fit">
            <input
              autoComplete="off"
              value={formData.password}
              onChange={handleChange}
              className="bg-[#E8F0FE] rounded-md px-4 py-2 text-black text-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-lg mb-5 w-full transition-all duration-300"
              required
              type={passwordVisible ? "text" : "password"}
              name="password"
              id="password"
            />
            <div
              className="absolute -translate-y-1/3 top-1/3 right-3 cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {passwordVisible ? <GoEye /> : <GoEyeClosed />}
            </div>
            {login && (
              <Link
                to={"/reset"}
                className="absolute left-0 -bottom-1 text-white hover:text-gray-200 hover:underline text-sm"
              >
                forgot password?
              </Link>
            )}
          </div>
          <br />
          <Button
            onMouseEnter={() => setButtonHovered(true)}
            onMouseLeave={() => setButtonHovered(false)}
            type="submit"
            className="relative flex items-center justify-center bg-gray-900 text-white text-lg mx-auto capitalize rounded-md w-full py-1 mb-3"
            disabled={loading}
          >
            {loading
              ? //   <TailSpin
                //     visible={true}
                //     height="28"
                //     width="28"
                //     color="#fff"
                //     ariaLabel="tail-spin-loading"
                //     radius="1"
                //   />
                "Loading..."
              : login
              ? "Sign In"
              : "Sign Up"}
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
