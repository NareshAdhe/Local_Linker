import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { io } from "socket.io-client";

export const AppContext = createContext();

const Context = ({ children }) => {
  const backendURI = import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL;
  const [loggedIn, setLoggedIn] = useState(false);
  const [users, setUsers] = useState([]);
  const [reset, setReset] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isResetEmailVerified, setIsResetEmailVerified] = useState(false);
  const [user, setUser] = useState({});
  const [socket, setSocket] = useState(null);
  const [unreadUsers, setUnreadUsers] = useState([]);
  const [chatUsers, setChatUsers] = useState([]);

  useEffect(() => {
    const fetchChatUsers = async () => {
      try {
        const { data } = await axios.get(
          `${backendURI}/api/user/chat-users/${user._id}`,
          {
            withCredentials: true,
          }
        );
        if (data.success) {
          setChatUsers(data.users);
        } else {
          toast.error(data.message, { autoClose: 2000 });
        }
      } catch (error) {
        toast.error(error.message, { autoClose: 2000 });
      }
    };

    if (loggedIn && user) fetchChatUsers();
  }, [loggedIn, user]);

  useEffect(() => {
    if (!socket || !users.length) return;
    socket.on("updateUsers",(users) => {
      setUsers(users);
    })
    socket.on("updateChatUsers", (user) => {
      setChatUsers((prevChatUsers) => {
        if (!prevChatUsers.includes(user)) {
          return [...prevChatUsers, user];
        }
        return prevChatUsers;
      });
    })

    socket.on("unReadMessages", (groupedMessages) => {
      const unreadUserData = Object.entries(groupedMessages)
        .map(([userId, count]) => {
          const userObj = users.find((u) => u._id === userId);
          return userObj ? [userObj, count] : null;
        })
        .filter(Boolean);

      setUnreadUsers(unreadUserData);
    });

    socket.on("updateUnreadCount", ({ sender, count }) => {
      setUnreadUsers((prev) => {
        let updatedUsers = prev.map(([user, unreadCount]) =>
          user._id === sender ? [user, count] : [user, unreadCount]
        );

        if (!updatedUsers.some(([user]) => user._id === sender) && count > 0) {
          const senderUser = users.find((u) => u._id === sender);
          if (senderUser) updatedUsers.push([senderUser, count]);
        }

        return updatedUsers.filter(([_, unreadCount]) => unreadCount > 0);
      });
    });

    return () => {
      socket.off("unReadMessages");
      socket.off("updateUnreadCount");
      socket.off("updateChatUsers");
    };
  }, [socket, users]);

  useEffect(() => {
    const newSocket = io(
      backendURI || "http://localhost:4000",
      {
        withCredentials: true,
        transports: ["websocket", "polling"],
      }
    );

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
      toast.warning("Please Login", { autoClose: 2000 });
    }
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
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
        toast.error(error.message || "Error fetching users", {
          autoClose: 2000,
        });
      } finally {
        setIsRefreshing(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${backendURI}/api/user/profile`, {
          withCredentials: true,
        });
        if (response.data.success) {
          setUser(response.data.user);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.message || "Error fetching profile");
      }
    };

    if (loggedIn) fetchUser();
  }, [loggedIn]);

  useEffect(() => {
    if (socket && user?._id) {
      socket.emit("join", user._id);
    }
  }, [socket, user]);

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
        user,
        setUser,
        socket,
        unreadUsers,
        setUnreadUsers,
        chatUsers,
        setChatUsers,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default Context;
