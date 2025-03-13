import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

const Context = ({ children }) => {
  const backendURI = import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL;
  const [loggedIn, setLoggedIn] = useState(false);
  const [users, setUsers] = useState([]);
  const [reset, setReset] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isResetEmailVerified, setIsResetEmailVerified] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
      toast.warning("Please Login", { autoClose: 2000 });
    }
  }, []);

  useEffect(async () => {
    setIsRefreshing(true);
    try {
      const response = await axios.get(backendURI + "/api/user/get", {
        withCredentials: true,
      });

      if (response.data.success) {
        setUsers(response.data.users);
      } else {
        toast.error(response.data.message || "Failed to fetch users", {
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.error(error.message || "Error fetching users", { autoClose: 2000 });
    }
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
        otpSent,
        setOtpSent,
        isRefreshing,
        setIsRefreshing,
        users,
        setUsers,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default Context;
