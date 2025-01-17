import React, { createContext, useState, useEffect, useContext } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../db/firebase";

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component to wrap the app
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false); // Update loading after user state is determined
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully!");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const value = { currentUser, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
