import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import React from "react";
import { useContext } from "react";

export default function ChatApp() {
  const [sender, setSender] = useState("Influencer");
  const [receiver, setReceiver] = useState("Businessman");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { backendURI } = useContext(AppContext);
  const socket = io(backendURI);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(backendURI + "api/chat/messages", {
        params: { sender, receiver },
      });
      setMessages(res.data);
    } catch (error) {
      toast.error(error, { autoClose: 2000 });
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    try {
      await axios.post(backendURI + "api/chat/send", {
        sender,
        receiver,
        message,
      });
      setMessage("");
    } catch (error) {
      toast.error(error, { autoClose: 2000 });
    }
  };

  useEffect(() => {
    fetchMessages();

    socket.on("newMessage", (newMsg) => {
      if (
        (newMsg.sender === sender && newMsg.receiver === receiver) ||
        (newMsg.sender === receiver && newMsg.receiver === sender)
      ) {
        setMessages((prev) => [...prev, newMsg]);
      }
    });

    return () => {
      socket.off("newMessage");
    };
  }, [sender, receiver]);

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-100">
      <h1 className="text-xl font-bold text-center mb-4">
        Influencer & Business Chat
      </h1>

      <div className="flex justify-center mb-2">
        <input
          type="text"
          className="border p-2 mr-2 rounded"
          placeholder="Your Name"
          value={sender}
          onChange={(e) => setSender(e.target.value)}
        />
        <input
          type="text"
          className="border p-2 mr-2 rounded"
          placeholder="Chat with"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-white shadow rounded">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col my-2 ${
              msg.sender === sender ? "items-end" : "items-start"
            }`}
          >
            <span className="text-sm font-bold text-gray-600 mb-1">
              {msg.sender}
            </span>
            <div
              className={`px-3 py-2 max-w-xs rounded-lg shadow-md text-white ${
                msg.sender === sender ? "bg-green-500" : "bg-blue-500"
              }`}
            >
              {msg.message}
            </div>
          </div>
        ))}
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
          className="ml-2 bg-green-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
