import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../db/firebase";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Initialize the navigate hook

  const loginHandler = (e) => {
    e.preventDefault();
    LoginClient();
  };

  const LoginClient = () => {
    if (email && password) {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          
          navigate("/user-dashboard"); // Navigate to /user-dashboard after successful login
        })
        .catch((error) => {
          alert(`Error: ${error.message}`);
        });
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <div className="w-screen h-[80vh] flex justify-center items-center">
      <form
        onSubmit={loginHandler}
        className="w-[400px] h-[300px] rounded-xl p-10 flex flex-col gap-3 justify-center items-center shadow-xl shadow-emerald-600"
      >
        <h1 className="text-2xl font-semibold">Login</h1>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          type="email"
          placeholder="Enter Your Email..."
          className="w-full p-3 px-4 bg-transparent border-2 border-emerald-600 rounded-xl outline-none"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          type="password"
          placeholder="Enter Password..."
          className="w-full p-3 px-4 bg-transparent border-2 border-emerald-600 rounded-xl outline-none"
        />
        <button
          type="submit"
          className="w-full p-3 px-4 rounded-xl bg-emerald-600"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
