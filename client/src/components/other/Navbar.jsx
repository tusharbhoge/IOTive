import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { useNavigate , Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle the side drawer
  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };


  const { currentUser, logout } = useAuth(); // Access the user and logout function from the AuthProvider
    const Navigate = useNavigate();
  
    const handleLogout = async () => {
      try {
        await logout();
   
        Navigate("/"); // Redirect to login after logout
      } catch (error) {
        console.error("Logout failed:", error);
        alert("An error occurred while logging out. Please try again.");
      }
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
              style={{ fontSize: "40px", color: "white", cursor: "pointer" }}
            />
          ) : (
            <MenuIcon
              style={{ fontSize: "40px", color: "white", cursor: "pointer" }}
            />
          )}
        </div>
        <h1 className="text-3xl font-bold text-white mr-5">IOITIVE</h1>
      </div>

      {/* Side Drawer */}
      <div
        className={`fixed top-30 left-0 h-full w-72 bg-neutral-800 shadow-lg rounded-xl transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 z-20`}
      >
        <div className="p-10 text-white gap-5 flex flex-col justify-center items-center ">
          {/* <h2 className="text-2xl font-bold mb-4">Menu</h2> */}
          <ul className="space-y-6 text-lg">
            <li className="cursor-pointer hover:text-emerald-100 ">Home</li>
            <li className="cursor-pointer hover:text-emerald-100 ">Control Panel</li>
            <li className="cursor-pointer hover:text-emerald-100 ">Active Appliances</li>
            <li className="cursor-pointer hover:text-emerald-100 ">Schedules</li>
            <li className="cursor-pointer hover:text-emerald-100 ">Notification</li>
            <li className="cursor-pointer hover:text-emerald-100 ">Report</li>
            <li className="cursor-pointer hover:text-emerald-100 ">Analytics</li>
            <li className="cursor-pointer hover:text-emerald-100 ">Profile</li>
            <li><button
            onClick={handleLogout}
            className="  text-rose-700 font-bold text-lg "
          >
            Logout
          </button></li>
          </ul>
          
        </div>
      </div>

      {/* Overlay (to close drawer when clicking outside) */}
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
