import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/Context";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import axios from "axios";
import { 
  FaBriefcase, FaUsers, FaMapMarkerAlt, FaCheckCircle, 
  FaIndustry, FaStar, FaChartLine,
} from "react-icons/fa";
import { MdDescription } from "react-icons/md";

const OtherUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { backendURI } = useContext(AppContext);
  const { id } = useParams();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${backendURI}/api/user/otherUser/${id}`, {
          withCredentials: true,
        });

        if (response.data.success) {
          setUser(response.data.user);
        } else {
          toast.error(response.data.message || "Failed to fetch user", { autoClose: 2000 });
        }
      } catch (error) {
        toast.error(error.message || "Error fetching user", { autoClose: 2000 });
      }
      setLoading(false);
    };

    fetchUsers();
  }, [backendURI, id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-lg">Loading...</div>;
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center text-lg">No user found.</div>;
  }

  const isBusinessman = user.role === "businessman";
  const themeColor = isBusinessman ? "bg-blue-600" : "bg-gray-600";
  const textColor = isBusinessman ? "text-blue-600" : "text-gray-600";
  const buttonColor = isBusinessman ? "bg-blue-500 hover:bg-blue-400" : "bg-gray-500 hover:bg-gray-400";
  const badgeText = isBusinessman ? "Businessman" : "Influencer";

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full flex flex-col md:flex-row border border-gray-300 overflow-hidden">
        
        <div className={`md:w-1/3 flex flex-col items-center justify-center p-6 ${themeColor} text-white`}>
          <img
            src={user.image || "/default-avatar.png"}
            alt={user.name}
            className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-full border-4 border-white shadow-lg"
          />
          <span className="mt-3 px-3 py-1 text-sm font-semibold bg-white text-gray-700 rounded-full">
            {badgeText}
          </span>
        </div>

        <div className="md:w-2/3 p-8 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            {user.name} <FaCheckCircle className={`text-lg ${textColor}`} />
          </h1>

          <div className="space-y-3 mt-4 text-gray-700">
            {user.location && (
              <p className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-gray-500" /> 
                <span className="font-semibold">Location:</span> {user.location}
              </p>
            )}

            {user.role === "influencer" && user.followers !== undefined && (
              <p className="flex items-center gap-2">
                <FaUsers className="text-gray-500" /> 
                <span className="font-semibold">Followers:</span> {user.followers?.toLocaleString()}
              </p>
            )}

            {isBusinessman && user.industry && (
              <p className="flex items-center gap-2">
                <FaIndustry className="text-gray-500" /> 
                <span className="font-semibold">Industry:</span> {user.industry}
              </p>
            )}

            {isBusinessman && user.businessName && (
              <p className="flex items-center gap-2">
                <FaBriefcase className="text-gray-500" /> 
                <span className="font-semibold">Business Name:</span> {user.businessName}
              </p>
            )}

            {!isBusinessman && user.category && (
              <p className="flex items-center gap-2">
                <FaChartLine className="text-gray-500" /> 
                <span className="font-semibold">Category:</span> {user.category}
              </p>
            )}

            {!isBusinessman && user.rating !== undefined && (
              <p className="flex items-center gap-2">
                <FaStar className="text-yellow-500" /> 
                <span className="font-semibold">Rating:</span> {user.rating} / 5
              </p>
            )}

            {user.description && (
              <p className="flex items-center gap-2">
                <MdDescription className="text-gray-500"/>
                <span className="font-semibold">Description:</span>
                {user.description}</p>
            )}
          </div>

          <div className="mt-6">
            <Link
              to={`/chat/${id}`}
              className={`px-6 py-2 text-white font-semibold rounded-full shadow-md transition duration-300 ${buttonColor}`}
            >
              Message
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherUser;
