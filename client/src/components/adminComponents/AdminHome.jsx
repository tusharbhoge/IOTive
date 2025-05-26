
import React from "react";
import { useNavigate } from "react-router-dom";

const AdminHome = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  return (
    <div className="flex h-screen">
      <div className="w-full h-full flex flex-col justify-center items-center p-6">
        {/* Dashboard Stats */}
        <div className="flex m-20 justify-center items-center gap-20">
          <div className="w-[200px] h-[200px] flex flex-col justify-center items-center bg-emerald-600 shadow-xl shadow-neutral-700 p-4 rounded-xl">
            <h2 className="text-7xl text-white font-bold">17</h2>
            <p className="text-2xl text-white">Clients</p>
          </div>
          <div className="w-[200px] h-[200px] flex flex-col justify-center items-center bg-emerald-600 shadow-xl shadow-neutral-700 p-4 rounded-xl">
            <h2 className="text-7xl text-white font-bold">7</h2>
            <p className="text-2xl text-white">Basic Plan</p>
          </div>
          <div className="w-[200px] h-[200px] flex flex-col justify-center items-center bg-emerald-600 shadow-xl shadow-neutral-700 p-4 rounded-xl">
            <h2 className="text-7xl text-white font-bold">10</h2>
            <p className="text-2xl text-white">Premium Plan</p>
          </div>
          <div className="w-[200px] h-[200px] flex flex-col justify-center items-center bg-emerald-600 shadow-xl shadow-neutral-700 p-4 rounded-xl">
            <h2 className="text-7xl text-white font-bold">37</h2>
            <p className="text-2xl text-white">Devices</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-6 mt-6 gap-20">
          {/* Create Client Button */}
          <div
            className="w-[200px] h-[200px] cursor-pointer flex flex-col justify-center items-center bg-white shadow-xl shadow-neutral-700 p-4 rounded-xl"
            onClick={() => navigate("/create-client")} // Navigate to Create Client page
          >
            <h2 className="text-7xl text-emerald-600 font-bold">+</h2>
            <p className="text-2xl text-emerald-600">Create Client</p>
          </div>

          {/* View Client Button */}
          <div
            className="w-[200px] h-[200px] cursor-pointer flex flex-col justify-center items-center bg-white shadow-xl shadow-neutral-700 p-4 rounded-xl"
            onClick={() => navigate("/view-clients")} // Navigate to View Client page
          >
            <h2 className="text-5xl mb-4 text-emerald-600 font-bold">🙋‍♀️</h2>
            <p className="text-2xl text-emerald-600">View Clients</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;