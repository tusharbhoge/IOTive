import React from "react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const { currentUser, logout } = useAuth(); // Access the user and logout function from the AuthProvider
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      alert("Logged out successfully!");
      navigate("/"); // Redirect to login after logout
    } catch (error) {
      console.error("Logout failed:", error);
      alert("An error occurred while logging out. Please try again.");
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to Your Dashboard</h1>
      {currentUser && (
        <p className="text-lg mb-4">
          Logged in as: <strong>{currentUser.email}</strong>
        </p>
      )}
      <button
        onClick={handleLogout}
        className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-500"
      >
        Logout
      </button>
    </div>
  );
};

export default UserDashboard;
