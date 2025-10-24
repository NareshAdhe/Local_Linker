import { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { AppContext } from "../context/Context";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function ChatApp() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { backendURI, user, loggedIn, socket } = useContext(AppContext);
  const sender = user?._id;
  const { receiver } = useParams();
  const [Receiver, setReceiver] = useState({});
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!receiver) return;

      try {
        const { data } = await axios.get(
          `${backendURI}/api/user/otherUser/${receiver}`,
          { withCredentials: true }
        );

        if (data.success) {
          setReceiver({
            ...data.user,
            lastSeen: new Intl.DateTimeFormat("en-IN", {
              timeZone: "Asia/Kolkata",
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }).format(new Date(data.user.lastSeen)),
          });
        } else {
          toast.error(data.message, { autoClose: 2000 });
        }
      } catch (error) {
        toast.error(error.message, { autoClose: 2000 });
      }
    };

    if (loggedIn) fetchUser();
  }, [loggedIn, receiver, backendURI]);

  useEffect(() => {
    if (!socket || !sender || !receiver) return;

    socket.emit("chatJoined", { sender, receiver });

    const handleNewMessage = (newMsg) => {
      if((newMsg.receiver === sender) || newMsg.sender === sender){
        setMessages((prev) => [...prev, newMsg]);
      }
    };

    const handleGetMessages = ({updatedMessages,newSender}) => {
      if(newSender === receiver){
        setMessages(updatedMessages);
      }
    };

    const handleOnline = (userId) => {
      if (receiver === userId) {
        setReceiver((prev) => ({ ...prev, isOnline: true }));
      }
    };

    const handleOffline = ({ userId, lastSeen }) => {
      if (receiver === userId) {
        const date = new Date();
        setReceiver((prev) => ({
          ...prev,
          isOnline: false,
          lastSeen: new Intl.DateTimeFormat("en-IN", {
            timeZone: "Asia/Kolkata",
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }).format(date),
        }));
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("getMessages", handleGetMessages);
    socket.on("online", handleOnline);
    socket.on("offline", handleOffline);

    return () => {
      socket.emit("leaveChat", { sender, receiver });
      socket.off("newMessage", handleNewMessage);
      socket.off("getMessages", handleGetMessages);
      socket.off("online", handleOnline);
      socket.off("offline", handleOffline);
    };
  }, [sender, receiver, socket]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!sender || !receiver) return;

      try {
        const { data } = await axios.get(
          `${backendURI}/api/chat/${sender}/${receiver}`,
          { withCredentials: true }
        );

        if (data.success) setMessages(data.messages);
      } catch (error) {
        toast.error("Error loading messages");
      }
    };

    fetchMessages();
  }, [sender, receiver, backendURI]);

  const sendMessage = (e) => {
    e.preventDefault();

    if (!socket || !sender || !receiver || !message.trim()) {
      toast.error("Please enter a message", { autoClose: 2000 });
      return;
    }

    const messageObj = {
      sender,
      receiver,
      message,
    };

    socket.emit("sendMessage", messageObj);
    setMessage("");
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-fit w-full">
      <div className="flex items-center p-4 rounded-t-lg bg-gray-100 border border-b-0 border-gray-300">
        {Receiver?.image && (
          <img
            src={Receiver.image}
            alt="Profile"
            className="w-10 h-10 rounded-full mr-3"
          />
        )}

        <div className="flex flex-col">
          <span className="text-black text-lg font-semibold">
            {Receiver?.name || "Unknown"}
          </span>
          <div className="flex items-center text-sm text-gray-600">
            <span
              className={`w-2.5 h-2.5 rounded-full mr-1 ${
                Receiver?.isOnline ? "bg-green-500" : "bg-gray-400"
              }`}
            ></span>
            {Receiver?.isOnline ? (
              "Online"
            ) : (
              <div className="flex items-center text-sm text-gray-600">
                {Receiver?.lastSeen
                  ? `Last seen: ${Receiver.lastSeen}`
                  : "Offline"}
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        ref={chatContainerRef}
        className="chat flex-1 max-h-[70vh] overflow-y-auto p-4 bg-white rounded-md border border-t-0 rounded-t-[0px] border-gray-300"
      >
        {messages.length > 0 ? (
          messages.map((msg, index) => {
            const formattedTime = new Intl.DateTimeFormat("en-IN", {
              timeZone: "Asia/Kolkata",
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }).format(new Date(msg.createdAt));

            return (
              <div
                key={index}
                className={`flex flex-col my-2 ${
                  msg.sender === sender ? "items-end" : "items-start"
                }`}
              >
                <span className="text-sm font-bold text-gray-600 mb-1">
                  {msg.sender === sender ? user.name : Receiver.name}
                </span>

                <div
                  className={`px-2 py-1 max-w-xs rounded-lg text-lg shadow-md text-white ${
                    msg.sender === sender
                      ? msg.isRead
                        ? "bg-green-500"
                        : "bg-yellow-500"
                      : "bg-blue-500"
                  }`}
                >
                  {msg.message}{" "}
                  {msg.sender === sender && (
                    <span className="text-[10px] ml-1">
                      {msg.isRead ? "read" : "unread"}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  {formattedTime}
                </span>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500">No messages yet</p>
        )}
      </div>

      <div className="mt-4 w-full flex items-center">
        <input
          type="text"
          className="flex-1 border p-3 rounded-lg focus:outline-none"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="ml-3 bg-blue-500 text-white px-5 py-3 rounded-lg shadow-md hover:bg-blue-700 cursor-pointer transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
