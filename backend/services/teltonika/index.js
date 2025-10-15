// services/teltonika/index.js
import { getHttpsAccessId } from "./teltonikaRemoteAccessLink.js";
import { generateWebUiLink } from "./teltonikaWebUI.js";
import { getDeviceIdBySerial } from "./teltonikaDevice.js";

// Unified function that the Express route (or demo script) can call
export async function getWebUiForDevice(serialNumber, deviceName) {
  try {
    const deviceId = await getDeviceIdBySerial(serialNumber, deviceName);
    console.log("🔍 Found Device ID:", deviceId);

    const accessId = await getHttpsAccessId(deviceId);
    console.log("🔑 Found HTTPS Access ID:", accessId);

    const webUiUrl = await generateWebUiLink(accessId);
    console.log("🌐 Web UI URL:", webUiUrl);

    return webUiUrl;
  } catch (err) {
    console.error("❌ Error in getWebUiForDevice:", err.message);
    throw err;
  }
}
