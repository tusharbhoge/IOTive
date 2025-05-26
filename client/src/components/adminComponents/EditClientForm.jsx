import { useState } from "react";

const EditClientForm = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState(user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBoardChange = (index, field, value) => {
    const updatedBoards = [...formData.boards];
    updatedBoards[index][field] = value;
    setFormData({ ...formData, boards: updatedBoards });
  };

  const handleApplianceChange = (boardIndex, applianceIndex, value) => {
    const updatedBoards = [...formData.boards];
    updatedBoards[boardIndex].appliances[applianceIndex] = value;
    setFormData({ ...formData, boards: updatedBoards });
  };

  const addBoard = () => {
    setFormData({
      ...formData,
      boards: [
        ...formData.boards,
        { boardId: `board-${Date.now()}`, room: "", appliances: [""] },
      ],
    });
  };

  const removeBoard = (index) => {
    const updatedBoards = formData.boards.filter((_, i) => i !== index);
    setFormData({ ...formData, boards: updatedBoards });
  };

  const addAppliance = (boardIndex) => {
    const updatedBoards = [...formData.boards];
    updatedBoards[boardIndex].appliances.push("");
    setFormData({ ...formData, boards: updatedBoards });
  };

  const removeAppliance = (boardIndex, applianceIndex) => {
    const updatedBoards = [...formData.boards];
    updatedBoards[boardIndex].appliances = updatedBoards[
      boardIndex
    ].appliances.filter((_, i) => i !== applianceIndex);
    setFormData({ ...formData, boards: updatedBoards });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
      <h2 className="text-2xl font-semibold text-emerald-600 mb-6">Edit Client</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Info Section */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className="border p-3 rounded-lg w-full"
            required
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="border p-3 rounded-lg w-full"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="border p-3 rounded-lg w-full"
            required
          />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="border p-3 rounded-lg w-full"
            required
          />
        </div>

        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          className="border p-3 rounded-lg w-full"
          required
        />

        {/* Boards Section */}
        <div className="bg-gray-100 p-5 rounded-lg">
          <h3 className="text-xl font-semibold text-emerald-600 mb-3">Boards</h3>

          {formData.boards.map((board, boardIndex) => (
            <div
              key={board.boardId}
              className="bg-white p-4 rounded-lg shadow-md mb-4"
            >
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold text-gray-700">
                  Board {boardIndex + 1}
                </h4>
                <button
                  type="button"
                  onClick={() => removeBoard(boardIndex)}
                  className="text-red-500 text-sm font-semibold"
                >
                  Remove Board
                </button>
              </div>

              {/* Board ID Input */}
              <input
                type="text"
                value={board.boardId}
                onChange={(e) =>
                  handleBoardChange(boardIndex, "boardId", e.target.value)
                }
                className="border p-2 rounded-lg w-full mt-2"
                disabled
              />

              {/* Room Input */}
              <input
                type="text"
                value={board.room}
                onChange={(e) =>
                  handleBoardChange(boardIndex, "room", e.target.value)
                }
                placeholder="Room Name"
                className="border p-2 rounded-lg w-full mt-2"
                required
              />

              {/* Appliances Section */}
              <div className="mt-4">
                <h5 className="text-md font-semibold text-gray-600">
                  Appliances
                </h5>

                {board.appliances.map((appliance, applianceIndex) => (
                  <div key={applianceIndex} className="flex items-center gap-2 mt-2">
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
                      className="border p-2 rounded-lg w-full"
                    />
                    <button
                      type="button"
                      onClick={() => removeAppliance(boardIndex, applianceIndex)}
                      className="text-red-500 text-sm font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addAppliance(boardIndex)}
                  className="mt-3 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Add Appliance
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addBoard}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4"
          >
            Add Board
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold w-full"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold w-full"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditClientForm;