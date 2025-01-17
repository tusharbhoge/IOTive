import React from "react";
import { useNavigate } from "react-router-dom";

const UserHome = () => {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <div className="w-full h-auto flex flex-col justify-start items-center p-8 gap-5">
      <div
        onClick={() => navigateTo("/control-panel")}
        className="w-full h-[100px] flex justify-center items-center shadow-lg bg-neutral-900 rounded-xl shadow-emerald-800 cursor-pointer hover:bg-neutral-800 transition-all"
      >
        <h2 className="text-2xl font-semibold text-white">Control Panel</h2>
      </div>
      <div
        onClick={() => navigateTo("/active-appliances")}
        className="w-full h-[100px] flex justify-center items-center shadow-lg bg-neutral-900 rounded-xl shadow-emerald-800 cursor-pointer hover:bg-neutral-800 transition-all"
      >
        <h2 className="text-2xl font-semibold text-white">Active Appliances</h2>
      </div>
      <div
        onClick={() => navigateTo("/schedules")}
        className="w-full h-[100px] flex justify-center items-center shadow-lg bg-neutral-900 rounded-xl shadow-emerald-800 cursor-pointer hover:bg-neutral-800 transition-all"
      >
        <h2 className="text-2xl font-semibold text-white">Schedules</h2>
      </div>
      <div
        onClick={() => navigateTo("/notifications")}
        className="w-full h-[100px] flex justify-center items-center shadow-lg bg-neutral-900 rounded-xl shadow-emerald-800 cursor-pointer hover:bg-neutral-800 transition-all"
      >
        <h2 className="text-2xl font-semibold text-white">Notifications</h2>
      </div>
      <div
        onClick={() => navigateTo("/report")}
        className="w-full h-[100px] flex justify-center items-center shadow-lg bg-neutral-900 rounded-xl shadow-emerald-800 cursor-pointer hover:bg-neutral-800 transition-all"
      >
        <h2 className="text-2xl font-semibold text-white">Report</h2>
      </div>
      <div
        onClick={() => navigateTo("/analytics")}
        className="w-full h-[100px] flex justify-center items-center shadow-lg bg-neutral-900 rounded-xl shadow-emerald-800 cursor-pointer hover:bg-neutral-800 transition-all"
      >
        <h2 className="text-2xl font-semibold text-white">Analytics</h2>
      </div>
    </div>
  );
};

export default UserHome;
