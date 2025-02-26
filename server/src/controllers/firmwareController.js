import { createWokwiProject } from '../services/createWokwiProject.js';
import { generateFirmwareCode } from '../services/generateFirmwareCode.js';
import { sendFirmwareToWokwi } from '../services/sendToWokwi.js';

export const generateAndUploadFirmware = async (req, res) => {
  try {
    // Extract client data from the request body
    const { clientId, boardId, appliances, wifiSSID, wifiPassword } = req.body;

    console.log('Received request to generate firmware with data:', {
      clientId,
      boardId,
      appliances,
      wifiSSID,
      wifiPassword
    });

    // Step 1: Generate dynamic firmware code based on the client's data
    const firmwareCode = generateFirmwareCode({
      clientId,
      boardId,
      appliances,
      wifiSSID,
      wifiPassword
    });

    console.log('Generated firmware code:', firmwareCode);

    // Step 2: Create a new Wokwi project
    const projectId = await createWokwiProject();
    console.log(`New Wokwi Project Created: ${projectId}`);

    // Step 3: Send the generated firmware code to Wokwi for compilation/upload
    const result = await sendFirmwareToWokwi(firmwareCode, projectId);
    console.log('Firmware sent to Wokwi, result:', result);

    // Step 4: Respond with the result (e.g., download link or success message)
    res.json(result);
  } catch (error) {
    console.error('Error in firmware generation/upload:', error);
    res.status(500).json({ error: 'Firmware generation failed', details: error.message });
  }
};


