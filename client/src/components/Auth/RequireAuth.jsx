import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const RequireAuth = ({ children }) => {
  const { currentUser } = useAuth();

  return currentUser ? children : <Navigate to="/login" />;
};

export default RequireAuth;
