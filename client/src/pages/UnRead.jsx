import { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/Context";
import { Link } from "react-router-dom";

const UnRead = () => {
  const { unreadUsers } = useContext(AppContext);

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Unread Messages</h2>
      {unreadUsers.length === 0 ? (
        <p className="text-gray-500 text-center">No unread messages</p>
      ) : (
        <div className="w-full max-w-xl flex flex-col gap-4">
          {unreadUsers.map(([sender,count]) => (
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
                <p className="text-sm text-black font-extrabold">
                  {count} new Message
                </p>
              </div>
              {count > 0 && (
                <span className="absolute top-1/2 -translate-y-1/2 right-4 w-5 h-5 bg-red-500 text-white text-xs font-bold flex items-center justify-center rounded-full">
                  {count}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default UnRead;
