import React, { createContext, useState, useEffect, useContext } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../db/firebase"; // Import your Firestore instance (db)

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component to wrap the app
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Fetch user's document from Firestore
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            // Extract email and role from Firestore
            const { email, role } = userDoc.data();

            // Update currentUser state with role and email
            setCurrentUser({
              uid: user.uid,
              email,
              role,
            });
          } else {
            console.error("User document does not exist in Firestore.");
            setCurrentUser(null); // Fallback if no document is found
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setCurrentUser(null); // Handle Firestore fetching errors
        }
      } else {
        setCurrentUser(null); // No user is logged in
      }

      setLoading(false); // Stop loading state
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null); // Clear user state after logout
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
