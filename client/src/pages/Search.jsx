import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../context/Context";
import { Link } from "react-router-dom";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [sortBy, setSortBy] = useState("");
  const { backendURI, setUsers, users } = useContext(AppContext);
  const [filteredUsers, setFilteredUsers] = useState(users || []);
  const [followers, setFollowers] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${backendURI}/api/user/get`, {
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
      }
    };

    fetchUsers();
  }, [backendURI, setUsers]); // ✅ Added dependencies to avoid unnecessary re-renders

  useEffect(() => {
    let updatedUsers = [...(users || [])];

    if (searchQuery.trim()) {
      updatedUsers = updatedUsers.filter(
        (user) =>
          user.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedRole) {
      updatedUsers = updatedUsers.filter(
        (user) => user.role?.toLowerCase() === selectedRole.toLowerCase()
      );
    }

    if (followers) {
      updatedUsers = updatedUsers.filter((user) => user.followers >= followers);
    }

    if (selectedRole === "businessman" && selectedIndustry) {
      updatedUsers = updatedUsers.filter(
        (user) =>
          user.industry?.toLowerCase() === selectedIndustry.toLowerCase()
      );
    }

    // Sorting logic
    if (sortBy) {
      updatedUsers.sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        else if (sortBy === "followers") return b.followers - a.followers;
        return 0;
      });
    }

    setFilteredUsers(updatedUsers);
  }, [searchQuery, selectedRole, sortBy, users, followers, selectedIndustry]);

  return (
    <div className="py-6  w-full mx-auto flex gap-8 flex-row-reverse">
      <aside className="w-1/4 bg-gray-100 p-4 mt-15 rounded-lg shadow-md h-fit hidden md:block">
        <h3 className="text-xl font-semibold mb-3">Filters</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full mt-1 p-2 border-2 border-gray-400 outline-none rounded-lg focus:border-blue-500"
          >
            <option value="">All</option>
            <option value="influencer">Influencer</option>
            <option value="businessman">Businessman</option>
          </select>
        </div>

        {/* Sorting */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full mt-1 p-2 border-2 border-gray-400 outline-none rounded-lg focus:border-blue-500"
          >
            <option value="">None</option>
            <option value="name">Name</option>
            <option value="followers">Followers</option>
          </select>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Min Followers
          </label>
          <input
            onChange={(e) => setFollowers(Number(e.target.value))}
            type="text"
            value={followers}
            placeholder="Min Followers"
            className="w-full mt-1 p-2 border-2 border-gray-400 outline-none rounded-lg focus:border-blue-500"
          />
        </div>

        {selectedRole === "businessman" && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Industry
            </label>
            <select
              onChange={(e) => setSelectedIndustry(e.target.value)}
              value={selectedIndustry}
              className="w-full mt-1 p-2 border-2 border-gray-400 outline-none rounded-lg focus:border-blue-500"
            >
              <option value="">Select Industry</option>
              <option value="tech">Tech</option>
              <option value="finance">Finance</option>
              <option value="health">Health</option>
            </select>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="w-full md:w-3/4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Search Users
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search by location or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-2 border-gray-300 p-3 rounded-lg text-lg shadow focus:outline-none focus:border-blue-500"
            />
            {searchQuery && (
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl text-gray-500 hover:text-red-500"
                onClick={() => setSearchQuery("")}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {filteredUsers.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user, index) => (
              <Link key={index} to={`/profile/${user._id}`}>
                <li className="cursor-pointer bg-white rounded-xl shadow-md overflow-hidden transition transform hover:scale-105 hover:shadow-lg">
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-full h-40 object-cover object-top"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {user.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {user.location || "Unknown Location"}
                    </p>
                    <p className="text-sm font-medium text-gray-700">
                      {user.role} |{" "}
                      <span className="font-bold">
                        {user.followers?.toLocaleString() || 0} Followers
                      </span>
                    </p>
                  </div>
                </li>
              </Link>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center mt-4">No users found</p>
        )}
      </div>
    </div>
  );
};

export default Search;
