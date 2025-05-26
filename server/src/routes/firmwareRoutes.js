import express from 'express';

import  { generateAndUploadFirmware } from '../controllers/firmwareController.js';

const router = express.Router();

// API Route for generating and uploading firmware
router.post('/admin/:adminUid/clients/:clientUid/generate-firmware', generateAndUploadFirmware);

export default router;

  