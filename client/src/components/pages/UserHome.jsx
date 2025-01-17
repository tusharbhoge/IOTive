import React from "react";
import { useNavigate } from "react-router-dom";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SummarizeOutlinedIcon from "@mui/icons-material/SummarizeOutlined";

const UserHome = () => {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <div className="w-full h-auto flex flex-col justify-start p-8 gap-5">
      <div
        onClick={() => navigateTo("/control-panel")}
        className="w-full h-[100px] flex items-center shadow-lg bg-white rounded-xl shadow-gray-950 cursor-pointer hover:bg-gray-100 transition-all px-6"
      >
        <div className="w-auto h-auto flex items-center justify-center mr-4">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeT3pEYguanS_oaYEQfAW8JNE0eVWeZdRAsQ&s"
            alt="Control Panel"
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
        <h2 className="text-2xl font-semibold text-black">Control Panel</h2>
      </div>

      <div
        onClick={() => navigateTo("/active-appliances")}
        className="w-full h-[100px] flex items-center shadow-lg bg-white rounded-xl shadow-gray-950 cursor-pointer hover:bg-gray-100 transition-all px-6"
      >
        <div className="w-auto h-auto flex items-center justify-center mr-4">
          <ToggleOnIcon style={{ fill: "black", width: "40px", height: "40px" }} />
        </div>
        <h2 className="text-2xl font-semibold text-black">Active Appliances</h2>
      </div>

      <div
        onClick={() => navigateTo("/schedules")}
        className="w-full h-[100px] flex items-center shadow-lg bg-white rounded-xl shadow-gray-950 cursor-pointer hover:bg-gray-100 transition-all px-6"
      >
        <div className="w-auto h-auto flex items-center justify-center mr-4">
          <CalendarMonthIcon style={{ fill: "black", width: "40px", height: "40px" }} />
        </div>
        <h2 className="text-2xl font-semibold text-black">Schedules</h2>
      </div>

      <div
        onClick={() => navigateTo("/notifications")}
        className="w-full h-[100px] flex items-center shadow-lg bg-white rounded-xl shadow-gray-950 cursor-pointer hover:bg-gray-100 transition-all px-6"
      >
        <div className="w-auto h-auto flex items-center justify-center mr-4">
          <NotificationsIcon style={{ fill: "black", width: "40px", height: "40px" }} />
        </div>
        <h2 className="text-2xl font-semibold text-black">Notifications</h2>
      </div>

      <div
        onClick={() => navigateTo("/report")}
        className="w-full h-[100px] flex items-center shadow-lg bg-white rounded-xl shadow-gray-950 cursor-pointer hover:bg-gray-100 transition-all px-6"
      >
        <div className="w-auto h-auto flex items-center justify-center mr-4">
          <SummarizeOutlinedIcon style={{ fill: "black", width: "40px", height: "40px" }} />
        </div>
        <h2 className="text-2xl font-semibold text-black">Report</h2>
      </div>

      <div
        onClick={() => navigateTo("/analytics")}
        className="w-full h-[100px] flex items-center shadow-lg bg-white rounded-xl shadow-gray-950 cursor-pointer hover:bg-gray-100 transition-all px-6"
      >
        <div className="w-auto h-auto flex items-center justify-center mr-4">
          <AssessmentIcon style={{ fill: "black", width: "40px", height: "40px" }} />
        </div>
        <h2 className="text-2xl font-semibold text-black">Analytics</h2>
      </div>
    </div>
  );
};

export default UserHome;
