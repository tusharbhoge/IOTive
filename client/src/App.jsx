import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./components/context/AuthProvider";
import Navbar from "./components/other/Navbar";
import CreateUser from "./components/Auth/CreateUser";
import Login from "./components/Auth/Login";
import UserDashboard from "./components/Dashboard/UserDashboard";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import RequireAuth from "./components/Auth/RequireAuth";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <ConditionalNavbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/create-user" element={<CreateUser />} />

          {/* Protected Routes */}
          <Route
            path="/user-dashboard"
            element={
              <RequireAuth role="user">
                <UserDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <RequireAuth role="admin">
                <AdminDashboard />
              </RequireAuth>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

// Conditional Navbar Component
const ConditionalNavbar = () => {
  const location = useLocation();
  const excludeNavbarRoutes = ["/"]; // Add any other routes you want to exclude here
  return !excludeNavbarRoutes.includes(location.pathname) ? <Navbar /> : null;
};

export default App;
