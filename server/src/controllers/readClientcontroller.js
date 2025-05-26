import { db } from '../db/index.js';
import admin from 'firebase-admin';
import setCustomClaims from '../utils/setCustomClaims.js';


// Read Client (Optimized)
export const readClient = async (req, res) => {
  try {
    const { adminUid, clientUid } = req.params;

    if (!adminUid || !clientUid) {
      return res.status(400).json({ message: "Missing adminUid or clientUid" });
    }

    const clientDocRef = db
      .collection("admins")
      .doc(String(adminUid))
      .collection("clients")
      .doc(String(clientUid));

    const clientDoc = await clientDocRef.get();

    if (!clientDoc.exists) {
      return res.status(404).json({ message: "Client not found" });
    }

    const clientData = clientDoc.data();

    // Fetch associated boards efficiently
    const boardsCollection = clientDocRef.collection("boards");
    const boardsSnapshot = await boardsCollection.get();

    const boards = boardsSnapshot.empty
      ? []
      : boardsSnapshot.docs.map((doc) => ({
          boardId: doc.id,
          room: doc.data().room || "Unknown", // Add room field
          ...doc.data(),
        }));

    res.status(200).json({ ...clientData, boards });
  } catch (error) {
    console.error("Error reading client:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};