import { useState } from "react";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("general");

  const handleTabClick = (tab) => setActiveTab(tab);

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <div className="p-4">
            <div className="flex items-center gap-4">
              <img
                src="https://bootdey.com/img/Content/avatar/avatar1.png"
                alt="avatar"
                className="w-20 h-20 rounded-full"
              />
              <div>
                <button className="px-4 py-2 bg-blue-500 text-white rounded">
                  Upload New Photo
                </button>
                <p className="text-sm text-gray-500 mt-2">
                  Allowed JPG, GIF or PNG. Max size of 800K
                </p>
              </div>
            </div>
            <input
              className="mt-6 w-full p-2 border rounded"
              type="text"
              placeholder="Username"
              defaultValue="nmaxwell"
            />
            <input
              className="mt-4 w-full p-2 border rounded"
              type="text"
              placeholder="Name"
              defaultValue="Nelle Maxwell"
            />
            <input
              className="mt-4 w-full p-2 border rounded"
              type="email"
              placeholder="E-mail"
              defaultValue="nmaxwell@mail.com"
            />
            <input
              className="mt-4 w-full p-2 border rounded"
              type="text"
              placeholder="Company"
              defaultValue="Company Ltd."
            />
          </div>
        );

      case "info":
        return (
          <div className="p-4">
            <textarea
              className="w-full p-2 border rounded"
              rows="5"
              placeholder="Bio"
            >
              Lorem ipsum dolor sit amet...
            </textarea>
            <input
              className="mt-4 w-full p-2 border rounded"
              type="text"
              placeholder="Birthday"
              defaultValue="May 3, 1995"
            />
            <select className="mt-4 w-full p-2 border rounded">
              <option>USA</option>
              <option>Canada</option>
              <option>UK</option>
            </select>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
      <div className="flex gap-8">
        <div className="w-1/4">
          {["general", "info"].map((tab) => (
            <button
              key={tab}
              className={`w-full text-left px-4 py-2 rounded ${
                activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-100"
              }`}
              onClick={() => handleTabClick(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div className="w-3/4 border rounded bg-white">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Profile;
