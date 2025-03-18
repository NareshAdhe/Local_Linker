import { useState, useContext, useEffect } from "react";
import { AppContext } from "../context/Context";
import axios from "axios";
import { toast } from "react-toastify";
import { FaCamera } from "react-icons/fa";

const Profile = () => {
  const { backendURI, user, setUser } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});
  const [updateLoading, setUpdateLoading] = useState(false);
  const [imageLoad, setImageLoad] = useState(false);
  const [newImage, setNewImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setNewImage(file);
      console.log(previewURL);
      setFormData((prev) => ({ ...prev, image: previewURL }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = async () => {
    if (!newImage) {
      toast.error("Please select an image first.");
      return;
    }

    setImageLoad(true);
    const formData = new FormData();
    formData.append("userId", user._id);
    formData.append("profileImage", newImage);

    try {
      const response = await axios.post(
        `${backendURI}/api/user/save-image`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.success) {
        setUser(response.data.user);
        toast.success("Image uploaded successfully", { autoClose: 2000 });
        setNewImage(null);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong", { autoClose: 2000 });
    } finally {
      setImageLoad(false);
    }
  };

  useEffect(() => {
    if (user) {
      console.log(user);
      setLoading(false);
      setFormData((prev) => ({
        ...prev,
        name: user?.name || "",
        email: user?.email || "",
        location: user?.location || "",
        number: user?.number || "",
        image: user?.image || "",
        role: user?.role || "",
        ...(user.role === "businessman"
          ? {
              businessName: user.businessName || "",
              industry: user.industry || "",
              description: user.description || "",
            }
          : {}),

        ...(user.role === "influencer"
          ? {
              category: user.category || "",
              rating: user.rating || 0,
              followers: user.followers || 0,
            }
          : {}),
      }));
      console.log(formData);
    } else setLoading(true);
  }, [user]);

  if (loading) return <p>Loading...</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);

    const phoneRegex = /^[6-9]\d{9}$/;
    if (formData.number && !phoneRegex.test(formData.number)) {
      toast.error(
        "Invalid Indian phone number. It should be 10 digits and start with 6-9.",
        { autoClose: 2000 }
      );
      setUpdateLoading(false);
      return;
    }

    try {
      const response = await axios.put(
        `${backendURI}/api/user/update`,
        { userId: user.id, ...formData },
        { withCredentials: true }
      );

      if (response.data.success) {
        setUser(response.data.user);
        toast.success("Profile updated successfully", { autoClose: 2000 });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong", { autoClose: 2000 });
    }
    setUpdateLoading(false);
  };

  return (
    formData && (
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg border-2 border-gray-400">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Profile Settings
        </h2>

        <div className="relative w-32 h-32 mx-auto">
          <img
            src={formData.image}
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
        {formData.role === "influencer" && (
          <div className="flex gap-6 justify-center">
            <div className="text-center mt-2 text-gray-800 text-lg font-extrabold">
              Rating: {formData.rating || 0}
            </div>
            <div className="text-center mt-2 text-gray-800 text-lg font-extrabold">
              Followers: {formData.followers}
            </div>
          </div>
        )}
        {newImage && (
          <div className="flex items-center justify-center">
            <button
              onClick={handleImageUpload}
              disabled={imageLoad}
              className={`mt-4 w-40 cursor-pointer text-white py-2 rounded-lg 
        ${
          imageLoad
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
            >
              {imageLoad ? "Saving..." : "Save Image"}
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
                onChange={handleChange}
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
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700">Phone Number</label>
              <input
                type="text"
                name="number"
                value={formData.number || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>
          {formData?.role === "businessman" && (
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
          {formData?.role === "influencer" && (
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
          )}

          <button
            type="submit"
            className="w-full cursor-pointer bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            {updateLoading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    )
  );
};

export default Profile;
