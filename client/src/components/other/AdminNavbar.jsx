
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { useAuth } from "../context/AuthProvider";
import HomeIcon from '@mui/icons-material/Home';
import AddBoxIcon from '@mui/icons-material/AddBox';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';

const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(true); // State to manage sidebar open/close
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const { currentUser, logout } = useAuth();
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/"); // Redirect to login after logout
    } catch (error) {
      console.error("Logout failed:", error);
      alert("An error occurred while logging out. Please try again.");
    }
  };

  return (
    <div className="flex h-screen fixed">
      {/* Sidebar */}
      <div
        className={`bg-gray-100 h-full transition-all duration-300 ${
          isOpen ? "w-64" : "w-18"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          
          {isOpen && <h1 className="text-3xl text-emerald-600 font-bold ">IOTIVE</h1>}
          <button
            className="text-3xl font-extrabold "
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "<<" : ">>"}
          </button>

          
        </div>

        {/* Navigation Items */}
        <ul className="mt-6 space-y-4">
          <li
            className={`flex items-center cursor-pointer hover:bg-gray-300 p-2 rounded ${
              isOpen ? "justify-start" : "justify-center"
            }`}
            onClick={() => handleNavigation("/admin-dashboard")}
          >
            <HomeIcon style={{ fontSize: "30px", cursor: "pointer" }}/>
            {isOpen && <span className="ml-4 text-xl">Home</span>}
          </li>
          <li
            className={`flex items-center cursor-pointer hover:bg-gray-300 p-2 rounded ${
              isOpen ? "justify-start" : "justify-center"
            }`}
            onClick={() => handleNavigation("/create-client")}
          >
            <AddBoxIcon style={{ fontSize: "30px", cursor: "pointer" }}/>
            {isOpen && <span className="ml-4 text-xl">Create Client</span>}
          </li>
          <li
            className={`flex items-center cursor-pointer hover:bg-gray-300 p-2 rounded ${
              isOpen ? "justify-start" : "justify-center"
            }`}
            onClick={() => handleNavigation("/view-clients")}
          >
           <PeopleAltIcon style={{ fontSize: "30px", cursor: "pointer" }}/>
            {isOpen && <span className="ml-4 text-xl">Clients</span>}
          </li>
          <li
            className={`flex items-center cursor-pointer hover:bg-gray-300 p-2 rounded ${
              isOpen ? "justify-start" : "justify-center"
            }`}
            onClick={() => handleNavigation("/admin-profile")}
          >
            <PersonIcon style={{ fontSize: "30px", cursor: "pointer" }}/>
            {isOpen && <span className="ml-4 text-xl">Profile</span>}
          </li>
          <li
            className={`flex items-center cursor-pointer text-red-500 hover:bg-gray-300 p-2 rounded ${
              isOpen ? "justify-start" : "justify-center"
            }`}
            onClick={handleLogout}
          >
            <LogoutIcon style={{ fontSize: "30px", cursor: "pointer" }}/>
            {isOpen && <span className="ml-4 text-xl text-red-500">Sign Out</span>}
          </li>
        </ul>
      </div>

    
     
    </div>
  );
};

export default AdminNavbar;

