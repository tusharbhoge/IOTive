import { db } from '../db/index.js';
import admin from 'firebase-admin';
import setCustomClaims from '../utils/setCustomClaims.js';

export const updateClient = async (req, res) => {
    try {
      const { adminUid, clientUid } = req.params;
      const updatedData = req.body;
  
      // Validate required parameters
      if (!adminUid || !clientUid) {
        return res.status(400).json({ message: "Admin UID and Client UID are required" });
      }
  
      console.log(`Fetching client data for update: adminUid=${adminUid}, clientUid=${clientUid}`);
  
      // Reference to the admin's client document
      const clientDocRef = admin.firestore().collection('admins').doc(adminUid).collection('clients').doc(clientUid);
      const clientDoc = await clientDocRef.get();
  
      if (!clientDoc.exists) {
        return res.status(404).json({ message: "Client not found" });
      }
  
      // Reference to the client document in the clientInformation collection
      const clientInfoDocRef = admin.firestore().collection('clientInformation').doc(clientUid);
  
      // Fetch existing client data
      const existingClientData = clientDoc.data();
  
      // Fetch boards subcollection
      const boardsSnapshot = await clientDocRef.collection('boards').get();
      const existingBoards = boardsSnapshot.docs.map(doc => ({
        boardId: doc.id,
        room: doc.data().room || "Unknown", // Add room field
        ...doc.data(),
      }));
  
      // Merge updated data with existing data (only update specified fields)
      const mergedData = { ...existingClientData, ...updatedData };
  
      // Extract boards data separately
      const { boards, ...clientInfo } = mergedData;
  
      // Initialize a batch
      const batch = admin.firestore().batch();
  
      // Step 1: Update client document (if there are other fields to update)
      if (Object.keys(clientInfo).length > 0) {
        console.log("Updating client info:", clientInfo);
        batch.set(clientDocRef, clientInfo, { merge: true }); // Update under admin
        batch.set(clientInfoDocRef, clientInfo, { merge: true }); // Update in clientInformation
      }
  
      // Step 2: Update boards subcollection
      if (boards && Array.isArray(boards)) {
        const boardsCollectionRef = clientDocRef.collection('boards');
        const clientInfoBoardsCollectionRef = clientInfoDocRef.collection('boards');
  
        for (const board of boards) {
          if (!board.boardId || !Array.isArray(board.appliances)) {
            console.warn(`Skipping invalid board entry: ${JSON.stringify(board)}`);
            continue;
          }
  
          const boardDocRef = boardsCollectionRef.doc(board.boardId);
          const clientInfoBoardDocRef = clientInfoBoardsCollectionRef.doc(board.boardId);
  
          batch.set(
            boardDocRef,
            {
              boardId: board.boardId,
              room: board.room || "Unknown", // Add room field
              appliances: board.appliances, // Store appliances as an array
            },
            { merge: true }
          );
  
          batch.set(
            clientInfoBoardDocRef,
            {
              boardId: board.boardId,
              room: board.room || "Unknown", // Add room field
              appliances: board.appliances, // Store appliances as an array
            },
            { merge: true }
          );
        }
        console.log(`Updated ${boards.length} boards`);
      }
  
      // Step 3: Update filters in clientInformation collection
      const filters = {};
  
      if (boards && Array.isArray(boards)) {
        boards.forEach((board) => {
          const roomName = board.room || "Unknown"; // Default room name
          const filterId = roomName.toLowerCase().replace(/\s+/g, '-'); // Create filter ID from room name
  
          // Initialize filter if it doesn't exist
          if (!filters[filterId]) {
            filters[filterId] = {
              filterId,
              name: roomName,
              appliances: [],
            };
          }
  
          // Add appliances to the filter
          board.appliances.forEach((appliance) => {
            const applianceName = typeof appliance === 'string' ? appliance : appliance.name;
            if (applianceName) {
              filters[filterId].appliances.push(applianceName);
            }
          });
        });
  
        // Add filters to clientInformation collection
        Object.values(filters).forEach((filter) => {
          const filterDocRef = clientInfoDocRef.collection('filters').doc(filter.filterId);
          batch.set(filterDocRef, {
            filterId: filter.filterId,
            name: filter.name,
            appliances: filter.appliances,
          }, { merge: true });
        });
      }
  
      // Step 4: Commit batch write
      await batch.commit();
  
      // Step 5: Update Realtime Database
      const rtdbRef = admin.database().ref(`clients/${clientUid}`);
      const rtdbData = {
        boards: boards.reduce((acc, board) => {
          acc[board.boardId] = {
            room: board.room || "Unknown", // Add room field
            appliances: board.appliances.reduce((appliancesAcc, appliance) => {
              // Handle both strings and objects
              const applianceName = typeof appliance === 'string' ? appliance : appliance.name;
              const applianceStatus = typeof appliance === 'string' ? false : appliance.status || false;
              const appliancePowerUsage = typeof appliance === 'string' ? 0 : appliance.powerUsage || 0;
  
              if (!applianceName) {
                console.warn(`Skipping invalid appliance: ${JSON.stringify(appliance)}`);
                return appliancesAcc;
              }
  
              appliancesAcc[applianceName] = {
                status: applianceStatus,
                powerUsage: appliancePowerUsage,
                lastUpdated: Date.now(),
              };
              return appliancesAcc;
            }, {}),
          };
          return acc;
        }, {}),
      };
  
      console.log("Updating RTDB:", rtdbData); // Debug log
      await rtdbRef.update(rtdbData); // Use `update` instead of `set` to merge changes
  
      // Return the updated client data to the frontend
      return res.status(200).json({
        message: "Client and boards updated successfully!",
        updatedClientData: mergedData, // Send merged data back for frontend updates
      });
    } catch (error) {
      console.error("Error updating client:", error);
      return res.status(500).json({ message: "Error updating client", error: error.message });
    }
  };

  