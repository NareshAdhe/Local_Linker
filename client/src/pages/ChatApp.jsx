import { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { AppContext } from "../context/Context";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function ChatApp() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { backendURI, user, loggedIn } = useContext(AppContext);
  const sender = user?._id;
  const { receiver } = useParams();
  const [Receiver, setReceiver] = useState({});
  const socketRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${backendURI}/api/user/otherUser/${receiver}`,
          { withCredentials: true }
        );
        if (response.data.success) {
          setReceiver(response.data.user);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.message || "Error fetching profile");
      }
    };

    if (loggedIn && receiver) fetchUser();
  }, [loggedIn, receiver]);

  useEffect(() => {
    socketRef.current = io(backendURI);
    let socket = socketRef.current;
    socket.emit("join", sender);

    socket.on("newMessage", (newMsg) => {
      setMessages((prev) => [...prev, newMsg]);
    });

    return () => {
      socket.disconnect();
    };
  }, [backendURI, sender, receiver]);

  const fetchMessages = async () => {
    if (!sender || !receiver) return;
    try {
      const response = await axios.get(
        `${backendURI}/api/chat/messages/${sender}/${receiver}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        setMessages(response.data.messages);
      } else {
        toast.error(response.data.message, { autoClose: 2000 });
      }
    } catch (error) {
      toast.error("Error fetching messages", { autoClose: 2000 });
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !sender || !receiver) return;
    try {
      const response = await axios.post(
        `${backendURI}/api/chat/send`,
        { sender, receiver, message },
        { withCredentials: true }
      );
      if (response.data.success) {
        setMessage("");
      } else {
        toast.error(response.data.message, { autoClose: 2000 });
      }
    } catch (error) {
      toast.error("Error sending message", { autoClose: 2000 });
    }
  };

  useEffect(() => {
    if (sender && receiver) fetchMessages();
  }, [sender, receiver]);

  return (
    <div className="flex flex-col h-fit w-full">
      {/* Header */}
      <div className="text-black text-xl font-bold p-4 text-center">
        Chat with {Receiver?.name || "Unknown"}
      </div>

      {/* Chat Box (Smaller Height) */}
      <div className="chat flex-1 max-h-[60vh] overflow-y-auto p-4 bg-white rounded-md border-2 border-gray-300">
        {messages.length > 0 ? (
          messages.map((msg, index) => {
            // Convert ISO timestamp to readable time
            const formattedTime = new Date(msg.createdAt).toLocaleTimeString(
              "en-US",
              {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              }
            );

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
                  className={`px-3 py-2 max-w-xs rounded-lg shadow-md text-white ${
                    msg.sender === sender ? "bg-green-500" : "bg-blue-500"
                  }`}
                >
                  {msg.message}
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

      {/* Input Box (Always Visible) */}
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
