import axios from "axios";

const WOKWI_API_BASE = "https://wokwi.com/api/v1";
const WOKWI_TOKEN = process.env.WOKWI_TOKEN;

export const createWokwiProject = async () => {
  try {
    const response = await axios.post(
      `${WOKWI_API_BASE}/projects`,
      {
        name: "New Firmware Project", // You can customize the name dynamically
      },
      {
        headers: {
          Authorization: `Bearer ${WOKWI_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    // The new project's ID
    return response.data.id;
  } catch (error) {
    console.error("Error creating Wokwi project:", error);
    throw new Error("Failed to create a new Wokwi project.");
  }
};
