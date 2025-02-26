import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./components/context/AuthProvider";
import Navbar from "./components/other/Navbar";
import AdminNavbar from "./components/other/AdminNavbar";

import Login from "./components/Auth/Login";
import UserDashboard from "./components/Dashboard/UserDashboard";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import RequireAuth from "./components/Auth/RequireAuth";
import ControlPanel from "./components/UserComponets/ControlPanel";
import ActiveAppliances from "./components/UserComponets/ActiveAppliances";
import Schedules from "./components/UserComponets/Schedules";
import Notifications from "./components/UserComponets/Notifications";
import Analytics from "./components/UserComponets/Analytics";
import Profile from "./components/UserComponets/Profile";
import Report from "./components/UserComponets/Report";
import CreateClient from "./components/adminComponents/CreateClient";
import ViewClient from "./components/adminComponents/ViewClient";
import AdminProfile from "./components/adminComponents/AdminProfile";

import { AdminProvider } from "./components/context/AdminContext";
import CreateAdmin from "./components/Auth/CreateAdmin";
import ClientInfo from "./components/adminComponents/ClientInfo";
import EditClientForm from "./components/adminComponents/EditClientForm";

const App = () => {
  return (
    <AuthProvider>
      <AdminProvider>
      <Router>
        <ConditionalNavbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/create-admin" element={<CreateAdmin />} />

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

          {/* User Feature Routes */}
          <Route
            path="/control-panel"
            element={
              <RequireAuth role="user">
                <ControlPanel />
              </RequireAuth>
            }
          />
          <Route
            path="/active-appliances"
            element={
              <RequireAuth role="user">
                <ActiveAppliances />
              </RequireAuth>
            }
          />
          <Route
            path="/schedules"
            element={
              <RequireAuth role="user">
                <Schedules />
              </RequireAuth>
            }
          />
          <Route
            path="/notifications"
            element={
              <RequireAuth role="user">
                <Notifications />
              </RequireAuth>
            }
          />
          <Route
            path="/report"
            element={
              <RequireAuth role="user">
                <Report />
              </RequireAuth>
            }
          />
          <Route
            path="/analytics"
            element={
              <RequireAuth role="user">
                <Analytics />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth role="user">
                <Profile />
              </RequireAuth>
            }
          />
          {/* admin Feature Routes */}
          <Route
            path="/create-client"
            element={
              <RequireAuth role="admin">
                <CreateClient />
              </RequireAuth>
            }
          />
          <Route
            path="/view-clients"
            element={
              <RequireAuth role="admin">
                <ViewClient />
              </RequireAuth>
            }
          />
          
          <Route
            path="/admin-profile"
            element={
              <RequireAuth role="admin">
                <AdminProfile />
              </RequireAuth>
            }
          />
          <Route
            path="/client-info"
            element={
              <RequireAuth role="admin">
                <ClientInfo />
              </RequireAuth>
            }
          />
          <Route
            path="/edit-clientform"
            element={
              <RequireAuth role="admin">
                <EditClientForm />
              </RequireAuth>
            }
          />
          


        </Routes>
      </Router>
      </AdminProvider>
    </AuthProvider>
  );
};

// Conditional Navbar Component
const ConditionalNavbar = () => {
  const location = useLocation();
  const excludeNavbarRoutes = ["/", "/admin-dashboard", "/create-user","/create-admin"]; // Exclude routes where the navbar is not needed
  const adminRoutes = ["/admin-dashboard","/create-client","/view-clients","/admin-profile","/client-info","/edit-clientform" ]; // You can expand this to include all admin-specific routes

  // Check if the current route matches an admin route
  if (adminRoutes.some((route) => location.pathname.startsWith(route))) {
    return <AdminNavbar />; // Render AdminNavbar for admin routes
  }

  return !excludeNavbarRoutes.includes(location.pathname) ? <Navbar /> : null;
};

export default App;
