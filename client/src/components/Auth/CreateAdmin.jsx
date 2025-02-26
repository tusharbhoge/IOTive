import React, { useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid"; // Import UUID to generate userUid

const CreateAdmin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // Added name state
  const [phone, setPhone] = useState(""); // Added phone state
  const [profilePicture, setProfilePicture] = useState(""); // Added profilePicture state
  const [status, setStatus] = useState("active"); // Added status state
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (email && password && name && phone) { // Added validation for name and phone
      setLoading(true);
      try {
        await createAdmin();
        setEmail("");
        setPassword("");
        setName("");
        setPhone("");
        setProfilePicture("");
        setStatus("active");
      } catch (error) {
        alert(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please fill in all fields.");
    }
  };

  const createAdmin = async () => {
    try {
      const response = await axios.post("/api/admin/create-admin", {
        name, // Send name
        email,
        password,
        phone,
        profilePicture,
        status,
      });
  
      if (response.status === 201) {
        alert("Admin account created successfully!");
      }
    } catch (error) {
      console.error("Error creating admin: ", error.response?.data || error.message);
      alert(`Error: ${error.response?.data?.message || "Failed to create admin."}`);
    }
  };

  return (
    <div className="w-screen h-auto flex justify-center items-center">
      <form
        onSubmit={submitHandler}
        className="w-[400px] h-auto rounded-xl p-10 flex flex-col gap-3 justify-center items-center shadow-xl shadow-emerald-600"
      >
        <h1 className="text-2xl font-semibold">Create Admin</h1>
        
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          type="text"
          placeholder="Enter Admin Name..."
          className="w-full p-3 px-4 bg-transparent border-2 border-emerald-600 rounded-xl outline-none"
        />
        
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          type="email"
          placeholder="Enter Admin Email..."
          className="w-full p-3 px-4 bg-transparent border-2 border-emerald-600 rounded-xl outline-none"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          type="password"
          placeholder="Create Admin Password..."
          className="w-full p-3 px-4 bg-transparent border-2 border-emerald-600 rounded-xl outline-none"
        />
        
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          type="text"
          placeholder="Enter Admin Phone..."
          className="w-full p-3 px-4 bg-transparent border-2 border-emerald-600 rounded-xl outline-none"
        />
        
        <input
          value={profilePicture}
          onChange={(e) => setProfilePicture(e.target.value)}
          type="text"
          placeholder="Profile Picture URL (Optional)"
          className="w-full p-3 px-4 bg-transparent border-2 border-emerald-600 rounded-xl outline-none"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-3 px-4 bg-transparent border-2 border-emerald-600 rounded-xl outline-none"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button
          className="w-full p-3 px-4 rounded-xl bg-emerald-600"
          type="submit"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Admin"}
        </button>
      </form>
    </div>
  );
};

export default CreateAdmin;
