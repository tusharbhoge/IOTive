import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/"); // Redirect to login after logout
    } catch (error) {
      console.error("Logout failed:", error);
      alert("An error occurred while logging out. Please try again.");
    }
  };

  const navigateTo = (path) => {
    setIsOpen(false); // Close the drawer on navigation
    navigate(path);
  };

  return (
    <div className="w-full h-full overflow-hidden">
      {/* Navbar */}
      <div className="w-full h-[120px] bg-emerald-600 rounded-b-3xl flex justify-between p-4 items-center">
        {/* Toggle Button */}
        <div
          onClick={toggleDrawer}
          className="text-white text-4xl cursor-pointer ml-5"
        >
          {isOpen ? (
            <MenuOpenIcon
              style={{ fontSize: "40px", fill: "white", cursor: "pointer" }}
            />
          ) : (
            <MenuIcon
              style={{ fontSize: "40px", fill: "white", cursor: "pointer" }}
            />
          )}
        </div>
        <h1 className="text-3xl font-bold text-white mr-5">IOITIVE</h1>
      </div>

      {/* Side Drawer */}
      <div
        className={`fixed top-30 left-0 h-full w-72 bg-gray-100 shadow-lg rounded-xl transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 z-20`}
      >
        <div className="p-10 text-white gap-5 flex flex-col justify-center items-center">
          <ul className="space-y-6 text-lg">
            <li
              onClick={() => navigateTo("/user-dashboard")}
              className="cursor-pointer hover:text-emerald-100"
            >
              Home
            </li>
            <li
              onClick={() => navigateTo("/control-panel")}
              className="cursor-pointer hover:text-emerald-100"
            >
              Control Panel
            </li>
            <li
              onClick={() => navigateTo("/active-appliances")}
              className="cursor-pointer hover:text-emerald-100"
            >
              Active Appliances
            </li>
            <li
              onClick={() => navigateTo("/schedules")}
              className="cursor-pointer hover:text-emerald-100"
            >
              Schedules
            </li>
            <li
              onClick={() => navigateTo("/notifications")}
              className="cursor-pointer hover:text-emerald-100"
            >
              Notification
            </li>
            <li
              onClick={() => navigateTo("/report")}
              className="cursor-pointer hover:text-emerald-100"
            >
              Report
            </li>
            <li
              onClick={() => navigateTo("/analytics")}
              className="cursor-pointer hover:text-emerald-100"
            >
              Analytics
            </li>
            <li
              onClick={() => navigateTo("/profile")}
              className="cursor-pointer hover:text-emerald-100"
            >
              Profile
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="text-rose-700 font-bold text-lg"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-10 z-10"
          onClick={toggleDrawer}
        ></div>
      )}
    </div>
  );
};

export default Navbar;
