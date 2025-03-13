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
    const handleLogout = (message) => {
      if (localStorage.getItem("authToken")) {
        localStorage.removeItem("authToken");
      }
      setLoggedIn(false);
      toast.error(message, { autoClose: 2000 });
    };
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
