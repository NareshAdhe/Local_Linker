import React, { useContext, useState } from "react";
import Button from "../components/Button";
import { GoEye, GoEyeClosed } from "react-icons/go";
import { AppContext } from "../context/Context";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Reset = () => {
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const {
    backendURI,
    setReset,
    isResetEmailVerified,
    setIsResetEmailVerified,
  } = useContext(AppContext);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!isResetEmailVerified) {
        const url = backendURI + "/api/auth/checkMail";
        console.log(formData);
        const response = await axios.post(
          url,
          { email: formData["email"] },
          {
            withCredentials: true,
          }
        );
        setLoading(false);
        if (response.data.success) {
          setReset(true);
          navigate("/verify");
          toast.success(response.data.message, {
            autoClose: 2000,
          });
        } else {
          toast.error(response.data.message, {
            autoClose: 2000,
          });
        }
      } else {
        const url = backendURI + "/api/auth/reset";
        const response = await axios.post(url, formData, {
          withCredentials: true,
        });
        setLoading(false);
        if (response.data.success) {
          setIsResetEmailVerified(false);
          setReset(false);
          toast.success(response.data.message, {
            autoClose: 2000,
          });
          navigate("/login");
        } else {
          toast.error(response.data.message, {
            autoClose: 2000,
          });
        }
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-gray-50 p-[5vw]">
      <div className="w-full sm:w-96 bg-gradient-to-b from-black via-[#00152d] to-white shadow-2xl rounded-lg p-6">
        <h2 className=" relative text-2xl font-semibold text-center text-white mb-4">
          {isResetEmailVerified ? "Reset Password" : "Verify Email"}
        </h2>
        <form className="space-y-4" method="post" onSubmit={handleSubmit}>
          <label
            htmlFor={isResetEmailVerified ? "password" : "email"}
            className="text-xl font-semibold text-white inline-block"
          >
            {isResetEmailVerified ? "Password" : "Email"}
          </label>
          {!isResetEmailVerified ? (
            <input
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="text"
              className="bg-[#E8F0FE] rounded-md px-4 py-2 text-black text-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-lg inline-block w-full transition-all duration-300"
            />
          ) : (
            <div className="relative h-fit">
              <input
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                type={passwordVisible ? "text" : "password"}
                className="bg-[#E8F0FE] rounded-md px-4 py-2 text-black text-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-lg inline-block w-full transition-all duration-300"
              />
              <div
                className="absolute -translate-y-1/2 top-1/2 right-3 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? <GoEye /> : <GoEyeClosed />}
              </div>
            </div>
          )}
          <div className="flex justify-center mt-8">
            <Button
              type="submit"
              className="flex items-center justify-center bg-gray-900 text-white text-lg mx-auto capitalize rounded-md w-24 py-1 mt-8"
              disabled={loading}
            >
              {loading
                ? "Loading..."
                : isResetEmailVerified
                ? "Reset"
                : "Verify"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Reset;
