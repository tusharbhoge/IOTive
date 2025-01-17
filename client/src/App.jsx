import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
        {/* Navbar is placed outside Routes to show it on all pages */}
        <Navbar />
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

export default App;
