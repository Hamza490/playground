// services/teltonika/teltonikaRemoteAccess.js
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = "https://rms.teltonika-networks.com/api";
const API_KEY = process.env.TELTONIKA_API_KEY;

export async function getRemoteAccessConfigs(deviceId) {
  try {
    const url = `${BASE_URL}/devices/remote-access?device_id=${deviceId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Return the exact structure from the API (your sample JSON)
    return data;
  } catch (error) {
    console.error("Error fetching remote access configs:", error.message);
    throw error;
  }
}
