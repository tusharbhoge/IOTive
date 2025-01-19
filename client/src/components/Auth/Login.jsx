import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../db/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginHandler = async (e) => {
    e.preventDefault();

    if (email && password) {
      try {
        // Sign in the user
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Fetch user role from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const role = userData.role;

          // Redirect based on role
          if (role === "admin") {
            navigate("/admin-dashboard"); // Admin dashboard
          } else if (role === "user") {
            navigate("/user-dashboard"); // User dashboard
          } else {
            alert("No role assigned. Please contact support.");
          }
        } else {
          alert("User data not found in Firestore.");
        }
      } catch (error) {
        alert(`Login Error: ${error.message}`);
      }
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-start items-center pt-[200px] gap-[60px]">
      <h1 className="text-4xl font-bold">
        Welcome to <span className="text-4xl text-emerald-600">IOTIVE !!!</span>
      </h1>
      <form
        onSubmit={loginHandler}
        className="w-[400px] h-[300px] border-[1px] border-neutral-100 rounded-xl p-10 flex flex-col gap-3 justify-center items-center shadow-xl shadow-neutral-400"
      >
        <h1 className="text-2xl font-semibold pb-5 text-emerald-600">Login</h1>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Enter Your Email..."
          className="w-full p-3 px-4 bg-transparent border-2 border-neutral-400 rounded-xl outline-none"
          required
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Enter Password..."
          className="w-full p-3 px-4 bg-transparent border-2 border-neutral-400 rounded-xl outline-none"
          required
        />
        <button
          type="submit"
          className="w-full p-3 px-4 rounded-xl text-white bg-emerald-600"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
