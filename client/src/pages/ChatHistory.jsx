import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/Context";
import { Link } from "react-router-dom";

const ChatHistory = () => {
  const { chatUsers, users } = useContext(AppContext);
  const [filteredChatUsers, setFilteredChatUsers] = useState([]);

  useEffect(() => {
    setFilteredChatUsers(users.filter((user) => chatUsers?.includes(user._id)));
  }, [users, chatUsers]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Chats</h2>
      {filteredChatUsers.length === 0 ? (
        <p className="text-gray-500 text-center">No Recent Chats</p>
      ) : (
        <div className="w-full max-w-xl flex flex-col gap-4">
          {filteredChatUsers.map((sender) => (
            <Link
              to={`/chat/${sender._id}`}
              key={sender._id}
              className="relative flex items-center bg-white p-4 rounded-lg shadow-md w-full hover:shadow-lg transition-all cursor-pointer border border-gray-200"
            >
              <img
                src={sender.image || "/default-avatar.png"}
                alt={sender.name}
                className="w-14 h-14 rounded-full object-cover border border-gray-300"
              />
              <div className="ml-4 flex-1">
                <p className="text-lg font-medium text-gray-900">
                  {sender.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatHistory;
