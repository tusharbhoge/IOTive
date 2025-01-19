import React, { useState } from "react";

const Profile = () => {
  // Mock user data
  const userData = {
    name: "Siddhi",
    email: "siddhi@ka.com",
    user_id: "user_12345",
    board: {
      board_id1: {
        appliances: {
          light: true,
          fan: false,
        },
      },
      board_id2: {
        appliances: {
          light: true,
          fan: false,
        },
      },
    },
  };

  // State for profile picture
  const [profilePic, setProfilePic] = useState(null);

  // Handle profile picture upload
  const handleProfilePicUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Calculate the total number of boards
  const totalBoards = Object.keys(userData.board).length;

  return (
    <div className="flex flex-col items-center min-h-screen bg-white">
      <div className=" text-white text-center mt-5 py-2">
        <h1 className="text-xl font-semibold">Profile</h1>
      </div>
      <div className="w-[90%] p-6 mt-3 text-lg bg-white border-[1px]  shadow-lg rounded-lg">
        {/* Profile Picture */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 mb-4">
            <img
              src={profilePic || "https://via.placeholder.com/150"}
              alt=""
              className="w-full h-full object-cover rounded-full border-2 border-emerald-500 shadow"
            />
          </div>
          <label className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm cursor-pointer">
            Upload Photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfilePicUpload}
            />
          </label>
        </div>

        {/* User Information */}
        <div className="mt-6">
          <h1 className="text-xl font-bold text-gray-800 text-center">
            {userData.name}
          </h1>
          <p className="text-gray-600 text-center">{userData.email}</p>
        </div>

        {/* User Details */}
        <div className="mt-6">
          <div className="flex justify-between py-2 border-b">
            <span className="font-medium text-gray-700">User ID:</span>
            <span className="text-gray-600">{userData.user_id}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="font-medium text-gray-700">Total Boards:</span>
            <span className="text-gray-600">{totalBoards}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
