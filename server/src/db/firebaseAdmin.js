import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get __dirname equivalent in ESM
const __dirname = dirname(fileURLToPath(import.meta.url));

// Build the absolute path for the JSON file
const serviceAccountPath = resolve(__dirname, '../../firestoreinfo/path-to-your-service-account.json');

try {
  // Read the JSON file manually
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

  // Initialize Firebase Admin SDK
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://ioitive-default-rtdb.asia-southeast1.firebasedatabase.app/", // Add your RTDB URL
  });

  console.log('🔥 Firebase Admin SDK initialized successfully');
} catch (error) {
  console.error('❌ Error initializing Firebase Admin SDK:', error);
  process.exit(1); // Exit the process if initialization fails
}

export default admin;