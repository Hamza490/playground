// teltonikaRemoteAccessLink.js
import { getRemoteAccessConfigs } from "./teltonikaRemoteAccess.js";

/**
 * Fetches the HTTPS Remote Access ID for a given device.
 * Extracts the data array safely and finds the HTTPS protocol entry.
 */
export async function getHttpsAccessId(deviceId) {
  // Fetch the full API response
  const response = await getRemoteAccessConfigs(deviceId);

  // Ensure response is valid and contains an array
  if (!response || !Array.isArray(response.data)) {
    console.error("Invalid response format from getRemoteAccessConfigs:", response);
    throw new Error("Unexpected response: missing or invalid 'data' array");
  }

  // Extract the configs array
  const configs = response.data;

  // Find the HTTPS configuration
  const httpsConfig = configs.find(config => config.protocol?.toLowerCase() === "https");

  if (!httpsConfig) {
    throw new Error("No HTTPS access configuration found for this device.");
  }

  console.log("✅ Found HTTPS Access ID:", httpsConfig.id);
  return httpsConfig.id;
}
