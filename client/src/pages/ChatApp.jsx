import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { AppContext } from "../context/Context";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function ChatApp() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { backendURI, user } = useContext(AppContext);
  const sender = user?._id;
  const { receiver } = useParams();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(backendURI);
    setSocket(newSocket);

    newSocket.on("newMessage", (newMsg) => {
      if (
        (newMsg.sender === sender && newMsg.receiver === receiver) ||
        (newMsg.sender === receiver && newMsg.receiver === sender)
      ) {
        setMessages((prev) => [...prev, newMsg]);
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [backendURI, sender, receiver]);

  const fetchMessages = async () => {
    if (!sender || !receiver) return;
    try {
      const response = await axios.get(
        `${backendURI}/api/chat/messages/${sender}/${receiver}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setMessages(response.data.messages);
      } else {
        toast.error(response.data.message, {
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.error("Error fetching messages", { autoClose: 2000 });
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !sender || !receiver) return;
    try {
      const res = await axios.post(
        `${backendURI}/api/chat/send`,
        {
          sender,
          receiver,
          message,
        },
        {
          withCredentials: true,
        }
      );

      setMessage("");
      if (socket) {
        socket.emit("newMessage", res.data);
      }
    } catch (error) {
      toast.error("Error sending message", { autoClose: 2000 });
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [sender, receiver]);

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-100">
      <h1 className="text-xl font-bold text-center mb-4">
        Influencer & Business Chat
      </h1>

      <div className="flex-1 overflow-y-auto p-4 bg-white shadow rounded">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col my-2 ${
                msg.sender === sender ? "items-end" : "items-start"
              }`}
            >
              <span className="text-sm font-bold text-gray-600 mb-1">
                {user.name}
              </span>
              <div
                className={`px-3 py-2 max-w-xs rounded-lg shadow-md text-white ${
                  msg.sender === sender ? "bg-green-500" : "bg-blue-500"
                }`}
              >
                {msg.message}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No messages yet</p>
        )}
      </div>

      <div className="flex mt-2">
        <input
          type="text"
          className="flex-1 border p-2 rounded"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-green-500 text-white px-4 py-2 rounded cursor-pointer"
        >
          Send
        </button>
      </div>
    </div>
  );
}
