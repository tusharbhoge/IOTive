import React from "react";

const UserHome = () => {

  return (
    <div className="w-full h-auto  flex flex-col justify-start items-center p-8 gap-5 ">
      <div className="w-full h-[100px] flex justify-center items-center shadow-lg bg-neutral-900 rounded-xl shadow-emerald-800 ">
        <h2 className="text-2xl font-semibold">Control Panel</h2>
      </div>
      <div className="w-full h-[100px] flex justify-center items-center shadow-lg bg-neutral-900 rounded-xl shadow-emerald-800 ">
        <h2 className="text-2xl font-semibold">Active Appliances</h2>
      </div>
      <div className="w-full h-[100px] flex justify-center items-center shadow-lg bg-neutral-900 rounded-xl shadow-emerald-800 ">
        <h2 className="text-2xl font-semibold">Schedules</h2>
      </div>
      <div className="w-full h-[100px] flex justify-center items-center shadow-lg bg-neutral-900 rounded-xl shadow-emerald-800 ">
        <h2 className="text-2xl font-semibold">Notifications</h2>
      </div>
      <div className="w-full h-[100px] flex justify-center items-center shadow-lg bg-neutral-900 rounded-xl shadow-emerald-800 ">
        <h2 className="text-2xl font-semibold">Report</h2>
      </div>
      <div className="w-full h-[100px] flex justify-center items-center shadow-lg bg-neutral-900 rounded-xl shadow-emerald-800 ">
        <h2 className="text-2xl font-semibold">Analytics</h2>
      </div>
    </div>
  );
};

export default UserHome;
