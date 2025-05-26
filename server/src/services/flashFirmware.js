import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

const firmwareDir = path.resolve('./src/firmwares'); // Ensure absolute path

export const flashFirmware = (firmwarePath, port) => {
  return new Promise((resolve, reject) => {
    const formattedPath = path.resolve(firmwarePath);
    const command = `esptool --chip esp32 --port ${port} --baud 115200 write_flash -z 0x1000 ${formattedPath}`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`❌ Flashing Error: ${stderr || error.message}`);
      } else {
        console.log("✅ Firmware flashed successfully!");
        
        // Clean up the firmwares directory
        cleanFirmwareDirectory()
          .then(() => resolve("Firmware flashed and directory cleaned successfully!"))
          .catch((cleanupError) => reject(`Firmware flashed, but cleanup failed: ${cleanupError.message}`));
      }
    });
  });
};

// Function to clean up the firmwares directory
const cleanFirmwareDirectory = () => {
  return new Promise((resolve, reject) => {
    fs.readdir(firmwareDir, (err, files) => {
      if (err) return reject(err);

      // Delete all files inside the firmwares directory
      Promise.all(
        files.map((file) => {
          const filePath = path.join(firmwareDir, file);
          return fs.promises.unlink(filePath); // Delete each file
        })
      )
        .then(() => resolve())
        .catch((error) => reject(error));
    });
  });
};
