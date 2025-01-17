import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./components/context/AuthProvider";
import Navbar from "./components/other/Navbar";
import CreateUser from "./components/Auth/CreateUser";
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
