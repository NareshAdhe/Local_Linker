import { useState, useContext, useEffect } from "react";
import { AppContext } from "../context/Context";
import axios from "axios";
import { toast } from "react-toastify";
import { FaCamera } from "react-icons/fa";

const Profile = () => {
  const { backendURI, loggedIn } = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});
  const [profileImage, setProfileImage] = useState(
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=60"
  );
  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${backendURI}/api/user/profile`, {
          withCredentials: true,
        });
        if (response.data.success) {
          setUser(response.data.user);
          setFormData(response.data.user);
          if (response.data.user.profileImage) {
            setProfileImage(response.data.user.profileImage);
          }
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.message || "Error fetching profile");
      } finally {
        setLoading(false);
      }
    };

    if (loggedIn) fetchUser();
  }, [backendURI, loggedIn]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async () => {
    if (!newImage) return;
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("profileImage", newImage);
      formDataToSend.append("userId", user._id);

      const response = await axios.put(
        `${backendURI}/api/user/update`,
        formDataToSend,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.success) {
        toast.success("Profile image updated successfully");
        setNewImage(null);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message || "Error updating image");
    }
  };

  if (loading) return <p>Loading...</p>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate Indian phone number
    const phoneRegex = /^[6-9]\d{9}$/;
    if (formData.number && !phoneRegex.test(formData.number)) {
      toast.error(
        "Invalid Indian phone number. It should be 10 digits and start with 6-9."
      );
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      const response = await axios.put(
        `${backendURI}/api/user/update`,
        formDataToSend,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setUser(response.data.user);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong", { autoClose: 2000 });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg border-2 border-gray-400">
      <h2 className="text-2xl font-bold mb-4 text-center">Profile Settings</h2>

      <div className="relative w-32 h-32 mx-auto">
        <img
          src={profileImage}
          alt="Profile"
          className="w-32 h-32 object-cover rounded-full border border-gray-300"
        />
        <label className="absolute bottom-0 right-2 bg-white p-2 rounded-full shadow cursor-pointer">
          <FaCamera className="text-gray-700" />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
      </div>
      {newImage && (
        <div className="flex items-center justify-center">
          <button
            onClick={handleImageUpload}
            className="mt-4 w-48 cursor-pointer bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Save Image
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div className="flex items-center gap-6">
          <div className="w-1/2">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              disabled
              className="w-full p-2 border rounded-lg bg-gray-100"
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-6">
          <div className="w-1/2">
            <label className="block text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location || ""}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-gray-700">Phone Number</label>
            <input
              type="text"
              name="number"
              value={formData.number || ""}
              onChange={(e) =>
                setFormData({ ...formData, number: e.target.value })
              }
              className="w-full p-2 border rounded-lg"
            />
          </div>
        </div>
        {user?.role === "businessman" && (
          <>
            <div className="flex items-center justify-between gap-6">
              <div className="w-1/2">
                <label className="block text-gray-700">Business Name</label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName || ""}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-gray-700">Industry</label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry || ""}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700">
                Business Description
              </label>
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg resize-none"
                rows="3"
              ></textarea>
            </div>
          </>
        )}
        {user?.role === "influencer" && (
          <>
            <div>
              <label className="block text-gray-700">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700">Rating</label>
              <input
                type="number"
                name="rating"
                value={formData.rating || 0}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                min="0"
                max="5"
                step="0.1"
              />
            </div>
          </>
        )}

        <button
          type="submit"
          className="w-full cursor-pointer bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;
