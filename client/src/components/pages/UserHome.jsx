import React from "react";
import { useNavigate } from "react-router-dom";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SummarizeOutlinedIcon from "@mui/icons-material/SummarizeOutlined";
import TuneIcon from '@mui/icons-material/Tune';

const UserHome = () => {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <div className="w-full h-auto flex flex-col justify-start p-8 gap-5">
      <div
        onClick={() => navigateTo("/control-panel")}
        className="w-full h-[80px] flex items-center shadow-lg bg-white rounded-xl shadow-neutral-400 cursor-pointer hover:bg-gray-100 transition-all px-6"
      >
         <div className="w-auto h-auto flex items-center justify-center mx-6">
          <TuneIcon style={{ width: "35px", height: "35px" }} />
        </div>
        <h2 className="text-xl font-medium  ">Control Panel</h2>
      </div>

      <div
        onClick={() => navigateTo("/active-appliances")}
        className="w-full h-[80px] flex items-center shadow-lg bg-white rounded-xl shadow-neutral-400 cursor-pointer hover:bg-gray-100 transition-all px-6"
      >
        <div className="w-auto h-auto flex items-center justify-center mx-6">
          <ToggleOnIcon style={{ width: "35px", height: "35px" }} />
        </div>
        <h2 className="text-xl font-semibold ">Active Appliances</h2>
      </div>

      <div
        onClick={() => navigateTo("/schedules")}
        className="w-full h-[80px] flex items-center shadow-lg bg-white rounded-xl shadow-neutral-400 cursor-pointer hover:bg-gray-100 transition-all px-6"
      >
        <div className="w-auto h-auto flex items-center justify-center mx-6">
          <CalendarMonthIcon style={{  width: "35px", height: "35px" }} />
        </div>
        <h2 className="text-xl font-semibold ">Schedules</h2>
      </div>

      <div
        onClick={() => navigateTo("/notifications")}
        className="w-full h-[80px] flex items-center shadow-lg bg-white rounded-xl shadow-neutral-400 cursor-pointer hover:bg-gray-100 transition-all px-6"
      >
        <div className="w-auto h-auto flex items-center justify-center mx-6">
          <NotificationsIcon style={{  width: "35px", height: "35px" }} />
        </div>
        <h2 className="text-xl font-semibold ">Notifications</h2>
      </div>

      <div
        onClick={() => navigateTo("/report")}
        className="w-full h-[80px] flex items-center shadow-lg bg-white rounded-xl shadow-neutral-400 cursor-pointer hover:bg-gray-100 transition-all px-6"
      >
        <div className="w-auto h-auto flex items-center justify-center mx-6">
          <SummarizeOutlinedIcon style={{  width: "35px", height: "35px" }} />
        </div>
        <h2 className="text-xl font-semibold">Report</h2>
      </div>

      <div
        onClick={() => navigateTo("/analytics")}
        className="w-full h-[80px] flex items-center shadow-lg bg-white rounded-xl shadow-neutral-400 cursor-pointer hover:bg-gray-100 transition-all px-6"
      >
        <div className="w-auto h-auto flex items-center justify-center mx-6">
          <AssessmentIcon style={{  width: "35px", height: "35px" }} />
        </div>
        <h2 className="text-xl font-semibold ">Analytics</h2>
      </div>
    </div>
  );
};

export default UserHome;
