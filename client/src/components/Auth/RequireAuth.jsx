import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const RequireAuth = ({ children, role }) => {
  const { currentUser } = useAuth();

  // Check if the user is logged in and has the required role
  if (!currentUser) {
    return <Navigate to="/" />; // Redirect to login if no user is logged in
  }

  if (role && currentUser.role !== role) {
    // Redirect unauthorized users if they don't have the required role
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default RequireAuth;
