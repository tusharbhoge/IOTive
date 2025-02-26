import { db } from '../db/index.js';
import admin from 'firebase-admin';


import setCustomClaims from '../utils/setCustomClaims.js';

export const createAdmin = async (req, res) => {
  try {
    const { email, password, name, phone, profilePicture, status } = req.body;

    if (!email || !password || !name || !phone) {
      return res.status(400).json({ message: 'Email, password, name, and phone are required' });
    }

    // Step 1: Create user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
      emailVerified: false,
      disabled: false,
    });

    const userUid = userRecord.uid; // Get UID from created user

    // Step 2: Store admin details in Firestore
    const adminData = {
      name, // Store name
      email,
      phone,
      profilePicture: profilePicture || "", // Optional
      status: status || "active", // Default to active if not provided
      role: 'admin',
      clientCount: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(), // Timestamp
    };

    const userDocRef = db.collection('admins').doc(String(userUid)); // Admin collection
    await userDocRef.set(adminData);

    // Step 3: Set custom admin claims in Firebase Auth
    await setCustomClaims(userUid, 'admin');

    res.status(201).json({ message: 'Admin created successfully!', userUid });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ message: 'Error creating admin', error: error.message });
  }
};



export const createClient = async (req, res) => {
  try {
    const { adminUid } = req.params; // Get adminUid from request params
    const { firstName, lastName, email, phone, address, board_count, boards } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !address) {
      return res.status(400).json({ message: 'Missing required client details' });
    }
    
    if (!boards || !Array.isArray(boards) || boards.length === 0) {
      return res.status(400).json({ message: 'Boards data is required and must be an array' });
    }

    // Step 1: Verify admin exists
    const adminDocRef = admin.firestore().collection('admins').doc(adminUid);
    const adminDoc = await adminDocRef.get();

    if (!adminDoc.exists) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Step 2: Create Firebase Authentication user
    let userRecord;
    try {
      userRecord = await admin.auth().createUser({
        email,
        password: phone, // Using phone as the default password
        emailVerified: false,
        disabled: false,
      });
    } catch (error) {
      console.error('Error creating Firebase user:', error);
      return res.status(500).json({ message: 'Failed to create Firebase user', error: error.message });
    }

    const userUid = userRecord.uid; // Get user UID

    // Step 3: Assign custom user claims
    try {
      await admin.auth().setCustomUserClaims(userUid, { role: 'user' });
    } catch (error) {
      console.error('Error setting custom claims:', error);
      return res.status(500).json({ message: 'Failed to assign user role', error: error.message });
    }

    // Step 4: Create client document in Firestore
    const boardCount =  boards.length;
    const clientData = {
      firstName,
      lastName,
      email,
      phone,
      address,
      board_count: boardCount,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      userUid,
    };

    const clientDocRef = adminDocRef.collection('clients').doc(String(userUid));

    // Step 5: Add boards and appliances using Firestore batch write
    const batch = admin.firestore().batch();

    batch.set(clientDocRef, clientData); // Add client document

    boards.forEach((board) => {
      if (!board.boardId || !Array.isArray(board.appliances)) {
        console.warn(`Skipping invalid board entry: ${JSON.stringify(board)}`);
        return;
      }

      const boardDocRef = clientDocRef.collection('boards').doc(String(board.boardId));
      batch.set(boardDocRef, {
        boardId: board.boardId,
        appliances: board.appliances, // Store appliances as an array
      });
    });

    // Step 6: Increment the client count for the admin
    batch.update(adminDocRef, {
      clientCount: admin.firestore.FieldValue.increment(1),
    });

    // Commit the batch
    await batch.commit();

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
          ...doc.data(),
        }));

    res.status(200).json({ ...clientData, boards });
  } catch (error) {
    console.error("Error reading client:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Update Client (Optimized)
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
    const clientDocRef = db.collection("admins").doc(adminUid).collection("clients").doc(clientUid);
    const clientDoc = await clientDocRef.get();

    if (!clientDoc.exists) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Fetch existing client data
    let existingClientData = clientDoc.data();

    // Fetch boards subcollection
    const boardsSnapshot = await clientDocRef.collection("boards").get();
    const existingBoards = boardsSnapshot.docs.map(doc => ({
      boardId: doc.id,
      ...doc.data(),
    }));

    existingClientData.boards = existingBoards; // Attach existing boards to client data

    // Merge updated data with existing data (only update specified fields)
    const mergedData = { ...existingClientData, ...updatedData };

    // Extract boards data separately
    const { boards, ...clientInfo } = mergedData;

    // Initialize a batch
    const batch = db.batch();

    // Step 1: Update client document (if there are other fields to update)
    if (Object.keys(clientInfo).length > 0) {
      console.log("Updating client info:", clientInfo);
      batch.set(clientDocRef, clientInfo, { merge: true });
    }

    // Step 2: Update boards subcollection
    if (boards && Array.isArray(boards)) {
      const boardsCollectionRef = clientDocRef.collection("boards");

      for (const board of boards) {
        if (!board.boardId || !Array.isArray(board.appliances)) {
          console.warn(`Skipping invalid board entry: ${JSON.stringify(board)}`);
          continue;
        }

        const boardDocRef = boardsCollectionRef.doc(board.boardId);
        batch.set(
          boardDocRef,
          {
            boardId: board.boardId,
            appliances: board.appliances,
          },
          { merge: true }
        );
      }
      console.log(`Updated ${boards.length} boards`);
    }

    // Step 3: Commit batch write
    await batch.commit();

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



// Delete Client and Authentication Details
export const deleteClient = async (req, res) => {
  try {
    const { adminUid, clientUid } = req.params;
    const auth = admin.auth();
    const db = admin.firestore();
    
    // Step 1: Delete Authentication User
    try {
      await auth.deleteUser(clientUid);
      console.log(`Deleted authentication user: ${clientUid}`);
    } catch (authError) {
      console.error("Error deleting authentication user:", authError.message);
      return res.status(500).json({ message: "Error deleting authentication user", error: authError.message });
    }

    // Step 2: Delete Client Document and Subcollections (Boards)
    const clientDocRef = db.collection('admins').doc(adminUid).collection('clients').doc(clientUid);
    const boardsCollectionRef = clientDocRef.collection('boards');
    const boardsSnapshot = await boardsCollectionRef.get();

    const batch = db.batch();
    boardsSnapshot.docs.forEach((doc) => batch.delete(doc.ref));
    batch.delete(clientDocRef);

    // Step 3: Decrement Client Count Atomically
    const adminDocRef = db.collection('admins').doc(adminUid);
    batch.update(adminDocRef, {
      clientCount: admin.firestore.FieldValue.increment(-1),
    });

    // Step 4: Commit Batch
    await batch.commit();

    res.status(200).json({ message: "Client and authentication details deleted successfully!" });
  } catch (error) {
    console.error("Error deleting client:", error);
    res.status(500).json({ message: "Error deleting client", error: error.message });
  }
};



export const getClientsByAdmin = async (req, res) => {
  try {
    const { adminUid } = req.params; // Get admin UID from request params

    const clientsCollectionRef = db.collection('admins').doc(adminUid).collection('clients');
    const snapshot = await clientsCollectionRef.get();

    if (snapshot.empty) {
      return res.status(200).json({ message: 'No clients found', clients: [] });
    }

    const clients = snapshot.docs.map(doc => ({ clientId: doc.id, ...doc.data() }));

    res.status(200).json({ clients });
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ message: 'Error fetching clients' });
  }
};

