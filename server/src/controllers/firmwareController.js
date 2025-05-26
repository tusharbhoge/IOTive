import { generateFirmwareCode } from "../services/generateFirmwareCode.js";
import { compileFirmware } from "../services/compileFirmware.js";
import { flashFirmware } from "../services/flashFirmware.js";

export const generateAndUploadFirmware = async (req, res) => {
  try {
    const { clientId, boardId, appliances, wifiSSID, wifiPassword, port } = req.body;

    // Step 1: Generate firmware code
    const firmwarePath = generateFirmwareCode({ clientId, boardId, appliances, wifiSSID, wifiPassword });

    // Step 2: Compile firmware
    const compiledFirmware = await compileFirmware(firmwarePath);

    // Step 3: Flash firmware onto ESP32
    const flashResult = await flashFirmware(compiledFirmware, port);

    res.json({ message: "Firmware flashed successfully!", details: flashResult });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process firmware", details: error.message });
  }
};

