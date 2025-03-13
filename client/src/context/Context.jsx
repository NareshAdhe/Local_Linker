import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

const Context = ({ children }) => {
  const backendURI = import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL;
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [user, setUser] = useState({});
  const [reset, setReset] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isResetEmailVerified, setIsResetEmailVerified] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setIsRefreshing(true);
      try {
        const url = `${backendURI}/api/auth/user`;
        const response = await axios.get(url, {
          withCredentials: true,
        });
        if (response.data.success) {
          setUser(response.data.user);
          setLoggedIn(true);
        } else {
          handleLogout(response.data.message);
        }
      } catch (error) {
        handleLogout(error.message);
      } finally {
        setIsRefreshing(false);
      }
    };

    const handleLogout = (message) => {
      if (localStorage.getItem("authToken")) {
        localStorage.removeItem("authToken");
      }
      setLoggedIn(false);
      toast.error(message, { autoClose: 2000 });
    };
    fetchUser();
  }, []);

  return (
    <AppContext.Provider
      value={{
        loggedIn,
        setLoggedIn,
        backendURI,
        reset,
        setReset,
        isResetEmailVerified,
        setIsResetEmailVerified,
        isLogging,
        setIsLogging,
        otpSent,
        setOtpSent,
        isRefreshing,
        setIsRefreshing,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default Context;
