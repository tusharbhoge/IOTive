import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const RequireAuth = ({ children, role }) => {
  const { currentUser } = useAuth();

  // Check if the user is logged in
  if (!currentUser) {
    return <Navigate to="/" />; // Redirect to login if no user is logged in
  }

  // Check if the user has the required role
  if (role && currentUser.role !== role) {
    return <Navigate to="/unauthorized" />; // Redirect unauthorized users
  }

  return children;
};

export default RequireAuth;
