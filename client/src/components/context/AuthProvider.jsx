import React, { createContext, useState, useEffect, useContext } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../db/firebase"; // Import Firebase auth

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component to wrap the app
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to refresh token and get custom claims
  const getUserClaims = async (user) => {
    try {
      const tokenResult = await user.getIdTokenResult(true); // Force refresh
      return tokenResult.claims; // Returns an object containing custom claims
    } catch (error) {
      console.error("Error fetching custom claims:", error);
      return {};
    }
  };

  useEffect(() => {
    // Listen to authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const claims = await getUserClaims(user);

          // Update currentUser state with email & custom claims (role)
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            role: claims.role || "user", // Default to "user" if no role is set
          });

          // Store Firebase ID Token in localStorage
          const token = await user.getIdToken(true);
          localStorage.setItem("authToken", token);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setCurrentUser(null); // Reset state on error
          localStorage.removeItem("authToken");
        }
      } else {
        setCurrentUser(null); // No user logged in
        localStorage.removeItem("authToken");
      }

      setLoading(false); // Stop loading state
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null); // Clear user state after logout
      localStorage.removeItem("authToken"); // Clear token on logout
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const value = { currentUser, logout };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div>Loading...</div> // Optionally render a loading spinner
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
