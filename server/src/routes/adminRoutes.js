import express from 'express';
import { 
  createAdmin, 
  createClient, 
  readClient, 
  updateClient, 
  deleteClient, 
  getClientsByAdmin 
} from '../controllers/adminController.js';

const router = express.Router();

// Route to create an admin user
router.post('/admin/create-admin', createAdmin); // No auth required for first admin setup

// Routes to manage clients (requires admin authentication)
router.post('/admin/:adminUid/create-client', createClient); // Create client under an admin
router.get('/admin/:adminUid/clients/:clientUid', readClient); // Read client details
router.get('/admin/:adminUid/clients', getClientsByAdmin); // Fetch all clients for an admin
router.put('/admin/:adminUid/clients/:clientUid', updateClient); // Update client
router.delete('/admin/:adminUid/clients/:clientUid', deleteClient); // Delete client

export default router;
