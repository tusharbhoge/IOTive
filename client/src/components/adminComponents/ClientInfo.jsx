import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../db/firebase";
import EditClientForm from "./EditClientForm"; // Import the new form component

const ClientInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const clientUid = location.state?.userUid;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [adminUid, setAdminUid] = useState(null);
  const [firmwarePopup, setFirmwarePopup] = useState({ show: false, boardId: null });
  const [isEditing, setIsEditing] = useState(false);
  const [wifiSSID, setWifiSSID] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");

  // Fetch Admin UID
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAdminUid(user.uid);
      } else {
        setError("User not authenticated");
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch Client Data
  useEffect(() => {
    if (!clientUid || !adminUid) return;

    const fetchClientData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/admin/${adminUid}/clients/${clientUid}`);
        setUser(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch client data");
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [adminUid, clientUid]);

  const handleSave = async (updatedData) => {
    setLoading(true);
    try {
      const response = await axios.put(`/api/admin/${adminUid}/clients/${clientUid}`, updatedData);
      setUser(response.data.updatedClientData);
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update client data");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFirmware = (boardId) => {
    setFirmwarePopup({ show: true, boardId });
  };

  const handleGenerateFirmwareSubmit = async () => {
    if (!user) return;

    const board = user.boards.find((b) => b.boardId === firmwarePopup.boardId);
    if (!board) return;

    setLoading(true);
    try {
      const response = await axios.post(`/api/admin/${adminUid}/clients/${clientUid}/generate-firmware`, {
        clientId: clientUid,
        boardId: board.boardId,
        appliances: board.appliances,
        wifiSSID,
        wifiPassword,
        // firebaseURL: 'https://your-firebase-url.firebaseio.com' // Replace with your Firebase URL
      });
      console.log("Firmware generated:", response.data);
      setFirmwarePopup({ show: false, boardId: null });
      alert("Firmware generated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate firmware 1");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = () => {
    setIsEditing(true);
  };

  const handleRemoveUser = () => {
    setShowConfirm(true);
  };

  const confirmRemoveUser = async () => {
    setLoading(true);
    try {
      await axios.delete(`/api/admin/${adminUid}/clients/${clientUid}`);
      alert(`User Removed: ${user.firstName} ${user.lastName}`);
      navigate("/view-clients");
    } catch (err) {
      alert(`Error: ${err.response?.data?.message || "Failed to remove user"}`);
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!user) return <p className="text-center text-gray-500">User not found.</p>;

  return (
    <div className="p-10  w-1/2 mx-auto bg-white shadow-lg rounded-2xl border border-gray-200">
      {isEditing ? (
        <EditClientForm user={user} onSave={handleSave} onCancel={() => setIsEditing(false)} />
      ) : (
        <>
          <h2 className="text-2xl p-3 font-bold flex items-center gap-2">
            {user.firstName} {user.lastName} 👤
          </h2>

          <div className="p-4 rounded-lg mb-4">
            <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Address:</strong> {user.address}</p>
            <p><strong>Boards:</strong> {user.boards?.length || 0}</p>
            <p><strong>Joined On:</strong> {new Date(user.createdAt._seconds * 1000).toLocaleDateString("en-US")}</p>
          </div>

          <div className="mb-4">
            {user.boards?.length > 0 ? (
              user.boards.map((board) => (
                <BoardInfo key={board.boardId} board={board} onGenerateFirmware={handleGenerateFirmware} />
              ))
            ) : (
              <p className="text-gray-500">No boards available</p>
            )}
          </div>

          <div className="flex gap-4">
            <button onClick={handleUpdateUser} className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition">
              Update User
            </button>
            <button onClick={handleRemoveUser} className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-800 transition">
              Remove User
            </button>
          </div>
        </>
      )}

      {showConfirm && (
        <Modal
          message={`Are you sure you want to remove ${user.firstName} ${user.lastName}?`}
          onConfirm={confirmRemoveUser}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {firmwarePopup.show && (
        <FirmwareModal
          boardId={firmwarePopup.boardId}
          wifiSSID={wifiSSID}
          setWifiSSID={setWifiSSID}
          wifiPassword={wifiPassword}
          setWifiPassword={setWifiPassword}
          onSubmit={handleGenerateFirmwareSubmit}
          onCancel={() => setFirmwarePopup({ show: false, boardId: null })}
        />
      )}
    </div>
  );
};

const BoardInfo = ({ board, onGenerateFirmware }) => (
  <div className="border p-6 rounded-lg shadow-md mb-4">
    <h3 className="font-semibold text-lg pb-2">Board ID: {board.boardId}</h3>
    <ul className="list-disc pl-5 p-2 text-gray-700">
      {board.appliances?.length ? (
        board.appliances.map((appliance, index) => <li key={index}>{appliance}</li>)
      ) : (
        <li className="text-gray-500">No appliances found</li>
      )}
    </ul>
    <button onClick={() => onGenerateFirmware(board.boardId)} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition">
      Generate Firmware
    </button>
  </div>
);

const Modal = ({ message, onConfirm, onCancel, confirmText = "Yes, Remove" }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <p className="text-lg font-semibold">{message}</p>
      <div className="flex gap-4 mt-4">
        <button onClick={onConfirm} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition">
          {confirmText}
        </button>
        {onCancel && <button onClick={onCancel} className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition">Cancel</button>}
      </div>
    </div>
  </div>
);

const FirmwareModal = ({ boardId, wifiSSID, setWifiSSID, wifiPassword, setWifiPassword, onSubmit, onCancel }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Generate Firmware for Board ID: {boardId}</h3>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="wifiSSID">
          WiFi SSID
        </label>
        <input
          type="text"
          id="wifiSSID"
          value={wifiSSID}
          onChange={(e) => setWifiSSID(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="wifiPassword">
          WiFi Password
        </label>
        <input
          type="password"
          id="wifiPassword"
          value={wifiPassword}
          onChange={(e) => setWifiPassword(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="flex gap-4">
        <button onClick={onSubmit} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition">
          Generate
        </button>
        <button onClick={onCancel} className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition">
          Cancel
        </button>
      </div>
    </div>
  </div>
);

export default ClientInfo;