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

