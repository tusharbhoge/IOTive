export const generateFirmwareCode = (clientData) => {
    const { clientId, boardId, wifiSSID, wifiPassword } = clientData;
  
    // Example of generating dynamic firmware code (can add more logic based on clientData)
    const firmwareCode = `
  void setup() {
    Serial.begin(115200); // Start serial communication
    // WiFi setup
    WiFi.begin("${wifiSSID}", "${wifiPassword}");
    while (WiFi.status() != WL_CONNECTED) {
      delay(1000);
      Serial.println("Connecting to WiFi...");
    }
    Serial.println("Connected to WiFi");
    pinMode(LED_BUILTIN, OUTPUT);
  }
  
  void loop() {
    // Simple LED blink code
    digitalWrite(LED_BUILTIN, HIGH);
    delay(1000);
    digitalWrite(LED_BUILTIN, LOW);
    delay(1000);
  }
    `;
    return firmwareCode;
  };

  