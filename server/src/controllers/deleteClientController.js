import { db } from '../db/index.js';
import admin from 'firebase-admin';
import setCustomClaims from '../utils/setCustomClaims.js';


export const deleteClient = async (req, res) => {
    try {
      const { adminUid, clientUid } = req.params;
  
      // Step 1: Delete Authentication User
      try {
        await admin.auth().deleteUser(clientUid);
        console.log(`Deleted authentication user: ${clientUid}`);
      } catch (authError) {
        console.error("Error deleting authentication user:", authError.message);
        return res.status(500).json({ message: "Error deleting authentication user", error: authError.message });
      }
  
      // Step 2: Delete Client Document and Subcollections (Boards) under admin
      const clientDocRef = admin.firestore().collection('admins').doc(adminUid).collection('clients').doc(clientUid);
      const boardsCollectionRef = clientDocRef.collection('boards');
      const boardsSnapshot = await boardsCollectionRef.get();
  
      // Step 3: Delete Client Document and Subcollections (Boards, Filters) under clientInformation
      const clientInfoDocRef = admin.firestore().collection('clientInformation').doc(clientUid);
      const clientInfoBoardsCollectionRef = clientInfoDocRef.collection('boards');
      const clientInfoFiltersCollectionRef = clientInfoDocRef.collection('filters');
  
      const clientInfoBoardsSnapshot = await clientInfoBoardsCollectionRef.get();
      const clientInfoFiltersSnapshot = await clientInfoFiltersCollectionRef.get();
  
      // Initialize a batch
      const batch = admin.firestore().batch();
  
      // Delete boards under admin
      boardsSnapshot.docs.forEach((doc) => batch.delete(doc.ref));
  
      // Delete boards under clientInformation
      clientInfoBoardsSnapshot.docs.forEach((doc) => batch.delete(doc.ref));
  
      // Delete filters under clientInformation
      clientInfoFiltersSnapshot.docs.forEach((doc) => batch.delete(doc.ref));
  
      // Delete client document under admin
      batch.delete(clientDocRef);
  
      // Delete client document under clientInformation
      batch.delete(clientInfoDocRef);
  
      // Step 4: Decrement Client Count Atomically
      const adminDocRef = admin.firestore().collection('admins').doc(adminUid);
      batch.update(adminDocRef, {
        clientCount: admin.firestore.FieldValue.increment(-1),
      });
  
      // Step 5: Commit Batch
      await batch.commit();
  
      // Step 6: Delete client data from Realtime Database
      const rtdbRef = admin.database().ref(`clients/${clientUid}`);
      await rtdbRef.remove();
  
      res.status(200).json({ message: "Client and authentication details deleted successfully!" });
    } catch (error) {
      console.error("Error deleting client:", error);
      res.status(500).json({ message: "Error deleting client", error: error.message });
    }
  };

  