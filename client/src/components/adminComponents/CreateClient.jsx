import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { auth } from "../db/firebase.jsx";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import AddBoxIcon from "@mui/icons-material/AddBox";

const CreateClient = () => {
  const navigate = useNavigate();
  const [client, setClient] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    board_count: 1,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [boards, setBoards] = useState([{ boardId: "", room: "", appliances: [""] }]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClient({ ...client, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !client.firstName ||
      !client.lastName ||
      !client.email ||
      !client.phone ||
      !client.address
    ) {
      setError("All fields are required.");
      return;
    }
    setError("");
    handleClientCreation();
  };

  const handleClientCreation = async () => {
    setIsLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("Admin not logged in");
      }
      const adminUid = user.uid;
      const token = await user.getIdToken();

      await axios.post(
        `/api/admin/${adminUid}/create-client`,
        {
          ...client,
          board_count: Number(client.board_count),
          boards,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Client created successfully!");
      setClient({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        board_count: 1,
      });
      setBoards([{ boardId: "", room: "", appliances: [""] }]);
    } catch (error) {
      console.error("Error creating client:", error.response?.data || error);
      setError(
        `Failed to create client: ${
          error.response?.data?.error || error.message
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBoardChange = (index, field, value) => {
    const newBoards = [...boards];
    newBoards[index][field] = value;
    setBoards(newBoards);
  };

  const handleApplianceChange = (boardIndex, applianceIndex, value) => {
    const newBoards = [...boards];
    newBoards[boardIndex].appliances[applianceIndex] = value;
    setBoards(newBoards);
  };

  const addAppliance = (boardIndex) => {
    const newBoards = [...boards];
    newBoards[boardIndex].appliances.push("");
    setBoards(newBoards);
  };

  const removeAppliance = (boardIndex, applianceIndex) => {
    const newBoards = [...boards];
    if (newBoards[boardIndex].appliances.length > 1) {
      newBoards[boardIndex].appliances.splice(applianceIndex, 1);
      setBoards(newBoards);
    }
  };

  const addBoard = () => {
    setBoards([...boards, { boardId: "", room: "", appliances: [""] }]);
  };

  const removeBoard = (boardIndex) => {
    if (boards.length > 1) {
      const newBoards = [...boards];
      newBoards.splice(boardIndex, 1);
      setBoards(newBoards);
    }
  };

  return (
    <>
      <div className="max-w-3xl mx-auto py-10 h-auto">
        <h1 className="text-2xl font-bold mb-6">Create Client</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded p-6 space-y-4"
        >
          <h1 className="text-xl font-bold">Client Information</h1>
          <div className="space-y-4 bg-gray-100 p-4 rounded">
            <input
              type="text"
              name="firstName"
              value={client.firstName}
              onChange={handleInputChange}
              placeholder="First Name"
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="lastName"
              value={client.lastName}
              onChange={handleInputChange}
              placeholder="Last Name"
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="email"
              name="email"
              value={client.email}
              onChange={handleInputChange}
              placeholder="Email"
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="tel"
              name="phone"
              value={client.phone}
              onChange={handleInputChange}
              placeholder="Phone Number"
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="address"
              value={client.address}
              onChange={handleInputChange}
              placeholder="Address"
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="number"
              name="board_count"
              value={client.board_count}
              onChange={handleInputChange}
              placeholder="Board Count"
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <h1 className="text-xl font-bold">Board Information</h1>

          {/* Add Board Button */}
          <button
            onClick={addBoard}
            className="bg-emerald-600 text-white px-4 py-2 rounded shadow mb-4"
          >
            Add Board
          </button>

          {boards.map((board, boardIndex) => (
            <div key={boardIndex} className="bg-gray-100 p-4 rounded">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                {/* Board ID Input */}
                <input
                  type="text"
                  value={board.boardId}
                  onChange={(e) =>
                    handleBoardChange(boardIndex, "boardId", e.target.value)
                  }
                  placeholder="Board ID"
                  className="w-full p-2 border rounded"
                  required
                />
                 {/* Add Appliance Button */}
                 <button
                  type="button"
                  onClick={() => addAppliance(boardIndex)}
                  className="px-1 py-1"
                >
                  <AddBoxIcon
                    style={{
                      fontSize: "30px",
                      cursor: "pointer",
                      fill: "#5DB996",
                    }}
                  />
                </button>

                {/* Delete Board Button */}
                <button
                  type="button"
                  onClick={() => removeBoard(boardIndex)}
                  className="px-1 py-1"
                  disabled={boards.length === 1}
                >
                  <DeleteForeverIcon
                    style={{
                      fontSize: "35px",
                      cursor: "pointer",
                      fill: "#9AA6B2",
                    }}
                  />
                </button>
                </div>

                {/* Room Input */}
                <input
                  type="text"
                  value={board.room}
                  onChange={(e) =>
                    handleBoardChange(boardIndex, "room", e.target.value)
                  }
                  placeholder="Room Name"
                  className="w-full p-2 border rounded"
                  required
                />

               

                {/* Appliances Inputs */}
                {board.appliances.map((appliance, applianceIndex) => (
                  <div
                    key={applianceIndex}
                    className="flex items-center space-x-2 mt-2"
                  >
                    <input
                      type="text"
                      value={appliance}
                      onChange={(e) =>
                        handleApplianceChange(
                          boardIndex,
                          applianceIndex,
                          e.target.value
                        )
                      }
                      placeholder="Device Name"
                      className="w-full p-2 border rounded"
                      required
                    />

                    {/* Remove Appliance Button */}
                    <button
                      type="button"
                      onClick={() => removeAppliance(boardIndex, applianceIndex)}
                      className="px-3 py-1"
                      disabled={board.appliances.length === 1}
                    >
                      <DisabledByDefaultIcon
                        style={{
                          fontSize: "30px",
                          cursor: "pointer",
                          fill: "#D91656",
                        }}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-emerald-600 text-white px-6 py-2 rounded shadow w-full mt-6"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Client"}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateClient;