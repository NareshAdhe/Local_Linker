import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/Context";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import axios from "axios";

const OtherUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { backendURI } = useContext(AppContext);
  const { id } = useParams();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          backendURI + `/api/user/otherUser/${id}`,
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          setUser(response.data.user);
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
      setLoading(false);
    };

    fetchUsers();
  }, [backendURI, id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Error: {error.message}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        No user found.
      </div>
    );
  }

  return (
    <>
      {user ? (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row">
            <div className="md:w-1/2 flex items-center justify-center p-4">
              <img
                src={user.image}
                alt={user.name}
                className="w-80 h-80 object-cover rounded-full border-4 border-white shadow-lg"
              />
            </div>
            <div className="md:w-1/2 p-8 flex flex-col justify-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                {user.name}
              </h1>
              <div className="space-y-2 text-gray-700">
                <p>
                  <span className="font-semibold">Location:</span>{" "}
                  {user.location}
                </p>
                <p>
                  <span className="font-semibold">Followers:</span>{" "}
                  {user.followers?.toLocaleString() || "N/A"}
                </p>
              </div>
              <div className="mt-6">
                <Link
                  type="button"
                  to={`/chat/${id}`}
                  className="px-6 py-2 bg-yellow-500 text-white font-semibold rounded-full shadow-md hover:bg-yellow-400 transition duration-300"
                >
                  Message
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        "Loading..."
      )}
    </>
  );
};

export default OtherUser;
