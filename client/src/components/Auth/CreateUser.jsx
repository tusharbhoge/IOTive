import React, { useState } from "react";
import {  createUserWithEmailAndPassword } from "firebase/auth";
import {auth } from "../db/firebase"


const CreateUser = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")


  const submitHandler=(e)=>{
    e.preventDefault();
    createClient();
    setEmail("");
    setPassword("");
  }

  const createClient=()=>{
    if (email && password) {
      createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          alert("Account created successfully!");
        })
        .catch((error) => {
          alert(`Error: ${error.message}`);
        });
    } else {
      alert("Please fill in all fields.");
    }

  }


  return (
    <div className=" w-screen h-[80vh] flex justify-center items-center  ">
      <form onSubmit={submitHandler} className=" w-[400px] h-[300px] rounded-xl p-10 flex flex-col gap-3 justify-center items-center shadow-xl shadow-emerald-600 ">
        <h1 className="text-2xl font-semibold">Create User</h1>
        <input
          value={email}
          onChange={(e)=>{setEmail(e.target.value)}}
          required
          type="email"
          placeholder="Enter Your Email..."
          className="w-full p-3 px-4 bg-transparent border-2 border-emerald-600 rounded-xl outline-none "
        />
        <input
          value={password}
          onChange={(e)=>{setPassword(e.target.value)}}
          required
          type="password"
          placeholder="Create Password..."
          className="w-full p-3 px-4 bg-transparent border-2 border-emerald-600 rounded-xl outline-none "
        />
        <button className="w-full p-3 px-4  rounded-xl bg-emerald-600 ">
          Create User
        </button>
      </form>
    </div>
  );
};

export default CreateUser;
