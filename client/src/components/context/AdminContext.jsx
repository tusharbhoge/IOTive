import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../db/firebase.jsx"; // Ensure Firebase is correctly initialized

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        
        // Fetch custom claims (role)
        const token = await firebaseUser.getIdTokenResult();
        setRole(token.claims.role || "user");
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AdminContext.Provider value={{ user, role, loading }}>
      {children}
    </AdminContext.Provider>
  );
};
