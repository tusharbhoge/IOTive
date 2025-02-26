import axios from 'axios';

const WOKWI_TOKEN = process.env.WOKWI_TOKEN || wok_JB666mF6BMBUIgGQCJM4FXKmaz3GhBLD3e1b0d6a;
// const WOKWI_PROJECT_ID = process.env.WOKWI_PROJECT_ID;

export const sendFirmwareToWokwi = async (firmwareCode,projectId) => {
  try {
    const response = await axios.post(
      `https://wokwi.com/api/v1/projects/${projectId}/upload`,
      {
        token: WOKWI_TOKEN,
        code: firmwareCode,
      }
    );

    // Return result from Wokwi (e.g., download link for compiled firmware)
    return response.data;
  } catch (error) {
    throw new Error("Error sending firmware to Wokwi: " + error.message);
  }
};


