import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../context/Context";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { backendURI, setUsers, users } = useContext(AppContext);
  const [filteredUsers, setFilteredUsers] = useState(users || []);

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `${backendURI}/api/users/get/${searchQuery}`
      );
      setUsers(response.data);
    } catch (error) {
      toast.error("Failed to fetch users", { autoClose: 2000 });
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users || []);
    } else {
      setFilteredUsers(
        users?.filter((user) =>
          user.location?.toLowerCase().includes(searchQuery.toLowerCase())
        ) || []
      );
    }
  }, [searchQuery, users]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Search Users</h2>

      <div className="relative flex mb-4">
        <input
          type="text"
          placeholder="Search by location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 flex-grow rounded pl-3 pr-10 text-lg"
        />
        {searchQuery && (
          <button
            className="absolute right-5 top-1/2 transform -translate-y-1/2 text-xl text-gray-500 hover:text-red-500"
            onClick={() => setSearchQuery("")}
          >
            X
          </button>
        )}
      </div>

      {filteredUsers.length > 0 ? (
        <ul className="grid grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <li key={user._id} className="bg-white rounded-lg shadow">
              <img
                src={user.image || "https://via.placeholder.com/150"}
                alt={user.name}
                className="w-full h-40 object-cover rounded"
              />
              <h3 className="text-lg font-semibold mt-2">{user.name}</h3>
              <p className="text-sm text-gray-600">
                {user.location || "Unknown Location"}
              </p>
              <p className="text-sm text-gray-800 font-bold">
                {user.category || "No Category"} |{" "}
                {user.followers?.toLocaleString() || 0} followers
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No Users Found</p>
      )}
    </div>
  );
};

export default Search;
