import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../db/firebase";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const loginHandler = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
  
    setError(""); // Clear previous errors
    setIsLoading(true); // Set loading state
  
    try {
      // Sign in the user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Get user token and custom claims (getIdTokenResult) 
      const idTokenResult = await user.getIdTokenResult(true); // Force refresh to get updated claims
      const role = idTokenResult.claims.role; // Get role from custom claims
  
      // Redirect based on role
      if (role === "admin") {
        navigate("/admin-dashboard");
      } else if (role === "user") {
        navigate("/user-dashboard");
      } else {
        setError("No role assigned. Please contact support.");
      }
    } catch (error) {
      setError(`Login Error: ${error.message}`);
      console.error(error);  // Log the error for more insights
    } finally {
      setIsLoading(false); // Stop loading state
    }
  };
  
  
  return (
    <div className="w-screen h-screen flex flex-col justify-start items-center pt-[200px] gap-[60px]">
      <h1 className="text-4xl font-bold">
        Welcome to <span className="text-4xl text-emerald-600">IOTIVE !!!</span>
      </h1>
      <form
        onSubmit={loginHandler}
        className="w-[400px] h-auto border-[1px] border-neutral-100 rounded-xl p-10 flex flex-col gap-3 justify-center items-center shadow-xl shadow-neutral-400"
      >
        <h1 className="text-2xl font-semibold pb-5 text-emerald-600">Login</h1>

        {/* Display error message */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

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
          disabled={isLoading} // Disable button when loading
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
