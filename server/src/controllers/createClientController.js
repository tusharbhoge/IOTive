import { db } from '../db/index.js';
import admin from 'firebase-admin';
import setCustomClaims from '../utils/setCustomClaims.js';

export const createClient = async (req, res) => {
    try {
      const { adminUid } = req.params;
      const { firstName, lastName, email, phone, address, board_count, boards } = req.body;
  
      // Validate required fields
      if (!firstName || !lastName || !email || !phone || !address) {
        return res.status(400).json({ message: 'Missing required client details' });
      }
  
      if (!boards || !Array.isArray(boards) || boards.length === 0) {
        return res.status(400).json({ message: 'Boards data is required and must be an array' });
      }
  
      let userUid; // Declare userUid here
  
      // Step 1: Check if email already exists
      try {
        const userRecord = await admin.auth().getUserByEmail(email);
        return res.status(400).json({ message: 'Email address is already in use' });
      } catch (error) {
        if (error.code !== 'auth/user-not-found') {
          throw error; // Re-throw unexpected errors
        }
        // If the error is 'auth/user-not-found', proceed to create the user
      }
  
      // Step 2: Create Firebase Authentication user
      try {
        const userRecord = await admin.auth().createUser({
          email,
          password: phone, // Using phone as the default password
          emailVerified: false,
          disabled: false,
        });
        userUid = userRecord.uid; // Assign userUid here
      } catch (error) {
        console.error('Error creating Firebase user:', error);
        return res.status(500).json({ message: 'Failed to create Firebase user', error: error.message });
      }
  
      // Step 3: Assign custom user claims
      try {
        await admin.auth().setCustomUserClaims(userUid, { role: 'user' });
      } catch (error) {
        console.error('Error setting custom claims:', error);
        return res.status(500).json({ message: 'Failed to assign user role', error: error.message });
      }
  
      // Step 4: Create client document in Firestore (under admin)
      const boardCount = boards.length;
      const clientData = {
        firstName,
        lastName,
        email,
        phone,
        address,
        board_count: boardCount,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        userUid,
        createdBy: adminUid, // Add admin UID who created the client
      };
  
      // Reference to the client document under the admin
      const clientDocRef = admin.firestore().collection('admins').doc(adminUid).collection('clients').doc(String(userUid));
  
      // Reference to the client document in the clientInformation collection
      const clientInfoDocRef = admin.firestore().collection('clientInformation').doc(String(userUid));
  
      // Step 5: Add boards and appliances using Firestore batch write
      const batch = admin.firestore().batch();
  
      // Add client document under admin
      batch.set(clientDocRef, clientData);
  
      // Add client document in clientInformation collection
      batch.set(clientInfoDocRef, clientData);
  
      // Step 6: Group appliances by room and create filters
      const filters = {};
  
      boards.forEach((board) => {
        if (!board.boardId || !Array.isArray(board.appliances)) {
          console.warn(`Skipping invalid board entry: ${JSON.stringify(board)}`);
          return;
        }
  
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
  
        // Add boards and appliances under admin
        const boardDocRef = clientDocRef.collection('boards').doc(String(board.boardId));
        batch.set(boardDocRef, {
          boardId: board.boardId,
          room: roomName,
          appliances: board.appliances,
        });
  
        // Add boards and appliances in clientInformation collection
        const clientInfoBoardDocRef = clientInfoDocRef.collection('boards').doc(String(board.boardId));
        batch.set(clientInfoBoardDocRef, {
          boardId: board.boardId,
          room: roomName,
          appliances: board.appliances,
        });
      });
  
      // Step 7: Add filters to clientInformation collection
      Object.values(filters).forEach((filter) => {
        const filterDocRef = clientInfoDocRef.collection('filters').doc(filter.filterId);
        batch.set(filterDocRef, {
          filterId: filter.filterId,
          name: filter.name,
          appliances: filter.appliances,
        });
      });
  
      // Step 8: Increment the client count for the admin
      const adminDocRef = admin.firestore().collection('admins').doc(adminUid);
      batch.update(adminDocRef, {
        clientCount: admin.firestore.FieldValue.increment(1),
      });
  
      // Commit the batch
      await batch.commit();
  
      // Step 9: Add client data to Realtime Database
      const rtdbRef = admin.database().ref(`clients/${userUid}`);
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
  
      console.log("Writing to RTDB:", rtdbData); // Debug log
      await rtdbRef.set(rtdbData);
  
      // Return success response
      res.status(201).json({
        message: 'Client created successfully!',
        clientUid: clientDocRef.id,
        userUid,
      });
    } catch (error) {
      console.error('Error creating client:', error);
      res.status(500).json({ message: 'Error creating client', error: error.message });
    }
  };

  