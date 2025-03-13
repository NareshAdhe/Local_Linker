import React, { useContext, useEffect, useState, useRef } from "react";
import { AppContext } from "../context/Context";
import axios from "axios";
import { toast } from "react-toastify";
// import { TailSpin } from "react-loader-spinner";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const VerifyOTP = () => {
  const [otp, setOtp] = useState(Array(4).fill(""));
  const navigate = useNavigate();
  const {
    backendURI,
    setLoggedIn,
    reset,
    setIsResetEmailVerified,
    otpSent,
    setOtpSent,
  } = useContext(AppContext);
  const [timer, setTimer] = useState(60);
  const [expired, setExpired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isResending, setIsResendingOtp] = useState(false);
  const first = useRef(null);
  const second = useRef(null);
  const third = useRef(null);
  const fourth = useRef(null);

  useEffect(() => {
    if (timer > 0 && otpSent && !expired) {
      const timeout = setTimeout(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timeout);
    }
    if (timer == 0) {
      setOtpSent(false);
      setExpired(true);
      setTimer(60);
    }
  }, [timer, otpSent]);

  const handleChange = (index, e) => {
    if (e.target.value.length == 1 && index !== 3) {
      const nextInput = [second, third, fourth][index];
      nextInput.current.focus();
    }
    setOtp((prev) => {
      const newOtp = [...prev];
      newOtp[index] = e.target.value;
      return newOtp;
    });
  };

  const handleResend = async () => {
    if (otpSent) {
      return toast.error("Cannot Resend OTP Before It Expires", {
        autoClose: 2000,
      });
    }
    if (loading) {
      return toast.error("Wait for previous request to finish", {
        autoClose: 2000,
      });
    }
    setIsResendingOtp(true);
    try {
      let url = backendURI + "/api/auth/resend";
      if (reset) url = backendURI + "/api/auth/resend-reset";
      const response = await axios.post(
        url,
        {},
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setExpired(false);
        setOtpSent(true);
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
    } finally {
      setIsResendingOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (reset) {
        setLoading(true);
        let url = backendURI + "/api/auth/verify-reset";
        let otp2 = otp.join("");
        const response = await axios.post(
          url,
          { otp2 },
          {
            withCredentials: true,
          }
        );
        setLoading(false);
        if (response.data.success) {
          setIsResetEmailVerified(true);
          toast.success(response.data.message, {
            autoClose: 2000,
          });
          navigate("/reset");
        } else {
          toast.error(response.data.message, {
            autoClose: 2000,
          });
          setOtp(Array(4).fill(""));
        }
      } else {
        setLoading(true);
        let url = backendURI + "/api/auth/verify";
        let otp2 = otp.join("");
        const response = await axios.post(
          url,
          { otp2 },
          {
            withCredentials: true,
          }
        );
        setLoading(false);
        if (response.data.success) {
          setLoggedIn(true);
          localStorage.setItem("authToken", response.data.token);
          navigate("/");
          toast.success(response.data.message, {
            autoClose: 2000,
          });
        } else {
          toast.error(response.data.message, {
            autoClose: 2000,
          });
          setOtp(Array(4).fill(""));
        }
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.message, {
        autoClose: 2000,
      });
    }
  };

  useEffect(() => {
    first.current.focus();
  }, []);

  const handleKeyPress = (e, index) => {
    const key = e.key;
    if (key === "Backspace" && index !== 0) {
      const temp = [first, second, third, fourth][index];
      if (temp.current.value.length === 0) {
        const prevInput = [fourth, first, second, third][index];
        prevInput.current.focus();
      }
    } else if (key === "ArrowRight") {
      if (index !== 3) {
        const nextInput = [second, third, fourth][index];
        nextInput.current.focus();
        nextInput.current.setSelectionRange(
          nextInput.current.value.length,
          nextInput.current.value.length
        );
      } else return;
    } else if (key === "ArrowLeft") {
      if (index !== 0) {
        const prevInput = [fourth, first, second, third][index];
        prevInput.current.focus();

        setTimeout(() => {
          prevInput.current.setSelectionRange(
            prevInput.current.value.length,
            prevInput.current.value.length
          );
        }, 0);
      } else return;
    }
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

  return (
    <motion.div
      variants={containerVarients}
      className="flex justify-center items-center h-fit py-24 bg-gray-50 w-full"
    >
      <motion.div
        variants={childVarients}
        className="w-full sm:w-96 shadow-xl rounded-lg p-6 border-2 border-gray-300 scale-110"
      >
        <h2 className=" relative text-2xl font-semibold text-center text-black mb-12">
          Verify OTP
          <p className="absolute top-10 left-1/2 -translate-x-1/2 text-black text-base">
            {expired ? "OTP EXPIRED" : `${timer} seconds`}
          </p>
        </h2>
        <form
          className="space-y-4"
          method="post"
          onSubmit={(e) => handleSubmit(e)}
        >
          <div className="flex items-center justify-center gap-7 mb-8 p-[2vw]">
            {Array(4)
              .fill(" ")
              .map((value, index) => (
                <input
                  required
                  ref={
                    index == 0
                      ? first
                      : index == 1
                      ? second
                      : index == 2
                      ? third
                      : fourth
                  }
                  onKeyDown={(e) => handleKeyPress(e, index)}
                  onChange={(e) => handleChange(index, e)}
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  className="otpInput w-[12vw] h-[12vw] sm:w-12 sm:h-12 text-center text-2xl border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition-all"
                />
              ))}
          </div>

          <div className="flex justify-center mt-8">
            <Button
              type="submit"
              className="flex cursor-pointer items-center justify-center bg-gray-900 text-white text-lg mx-auto capitalize rounded-md w-32 py-1 mb-3"
              disabled={loading || timer == 0}
            >
              {loading
                ? // <TailSpin
                  //   visible={true}
                  //   height="28"
                  //   width="28"
                  //   color="#fff"
                  //   ariaLabel="tail-spin-loading"
                  //   radius="1"
                  // />
                  "Loading..."
                : "Verify OTP"}
            </Button>
          </div>

          <div className="mt-4">
            <p
              className="text-black flex items-center justify-center hover:text-gray-700 cursor-pointer"
              onClick={handleResend}
            >
              {isResending
                ? // <TailSpin
                  //   visible={true}
                  //   height="25"
                  //   width="25"
                  //   color="#000"
                  //   ariaLabel="tail-spin-loading"
                  //   radius="1"
                  // />
                  "Loading..."
                : "Resend OTP"}
            </p>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
export default VerifyOTP;
