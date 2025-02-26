import express from 'express';
import { generateFirmwareCode } from '../services/generateFirmwareCode.js';
import { sendFirmwareToWokwi } from '../services/sendToWokwi.js';
import  { generateAndUploadFirmware } from '../controllers/firmwareController.js';

const router = express.Router();

// API Route for generating and uploading firmware
router.post('/admin/:adminUid/clients/:clientUid/generate-firmware', generateAndUploadFirmware);

export default router;

  