import React from "react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import UserHome from "../pages/UserHome";

const UserDashboard = () => {
    

  return (
    <>

    <UserHome/>
    </>
  );
};

export default UserDashboard;
