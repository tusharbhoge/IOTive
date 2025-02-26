import React, { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../db/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const ViewClients = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminUid, setAdminUid] = useState("");
  const navigate = useNavigate();

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

  useEffect(() => {
    let isMounted = true; 

    const fetchClients = async () => {
      if (!adminUid) return;
      try {
        const response = await axios.get(`/api/admin/${adminUid}/clients`);
        // console.log("API Response:", response.data); 

        if (isMounted) {
          const clientData = Array.isArray(response.data.clients) ? response.data.clients : [];
          setClients(clientData);
          setFilteredClients(clientData); // Initialize filtered list
        }
      } catch (err) {
        console.error("Error fetching clients:", err);
        if (isMounted) setError("Failed to load clients");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchClients();
    return () => {
      isMounted = false;
    };
  }, [adminUid]);

  // Search function
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = clients.filter(
      (client) =>
        client.firstName.toLowerCase().includes(query) ||
        client.lastName.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query)
    );

    setFilteredClients(filtered);
  };

  return (
    <div className="p-10 flex flex-col items-center space-y-4">
      <h1 className="text-2xl font-bold">Clients List</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search clients by name or email..."
        value={searchQuery}
        onChange={handleSearch}
        className="p-2 px-6 w-2/6 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-600"
      />

      {loading && <p>Loading clients...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && filteredClients.length === 0 && <p>No clients found.</p>}

      {!loading &&
        !error &&
        filteredClients.map((client) => (
          <div
            key={client.clientId}
            className="p-6 w-1/2 flex items-center justify-between border border-gray-100 rounded-xl shadow-2xl"
          >
            <span role="img" aria-label="man">👨</span>
            <span className="flex-1 ml-2">
              {client?.firstName || "N/A"} {client?.lastName || ""}
            </span>
            <button
              onClick={() => navigate("/client-info", { state: { userUid: client.userUid } })}

              className="px-2 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-800"
            >
              View
            </button>
          </div>
        ))}
    </div>
  );
};

export default ViewClients;
