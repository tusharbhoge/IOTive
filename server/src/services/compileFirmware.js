import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

export const compileFirmware = (firmwarePath) => {
  return new Promise((resolve, reject) => {
    const firmwareDir = path.dirname(firmwarePath);
    const firmwareFileName = path.basename(firmwarePath, path.extname(firmwarePath));

    const arduinoLibraryPath = "C:\\Users\\tusha\\OneDrive\\Documents\\Arduino\\libraries\\Firebase_Arduino_Client_Library_for_ESP8266_and_ESP32";

    const command = `arduino-cli compile --fqbn esp32:esp32:lilygo_t_display --library "${arduinoLibraryPath}" --output-dir "${firmwareDir}" "${firmwarePath}"`;


    console.log(`🔧 Compiling Firmware with command:\n${command}\n`);

    exec(command, (error, stdout, stderr) => {
      if (stdout) console.log(`📢 Output:\n${stdout}`);
      if (stderr) console.error(`⚠️ Error Output:\n${stderr}`);

      if (error) {
        return reject(`❌ Compilation Failed:\n${stderr || error.message}`);
      }

      const compiledFilePath = path.join(firmwareDir, `${firmwareFileName}.ino.bin`);
      const finalFilePath = path.join(firmwareDir, `firmwares.bin`);

      if (!fs.existsSync(compiledFilePath)) {
        return reject(`❌ Compiled firmware not found at: ${compiledFilePath}`);
      }

      fs.rename(compiledFilePath, finalFilePath, (renameErr) => {
        if (renameErr) {
          return reject(`❌ Error renaming firmware: ${renameErr.message}`);
        }
        console.log(`✅ Compilation Successful! Firmware saved as: ${finalFilePath}`);
        resolve(finalFilePath);
      });
    });
  });
};
