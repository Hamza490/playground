// teltonikaWebUI.js
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = "https://rms.teltonika-networks.com/api";
const API_KEY = process.env.TELTONIKA_API_KEY;

/**
 * Generates the RMS Web UI link for a given HTTPS access ID.
 * Follows the two-step flow: create channel → get active session.
 *
 * @param {number} accessId - The HTTPS access ID.
 * @param {number} duration - Duration of the connection in seconds (default 3600 = 1 hour).
 * @returns {string} - The active Web UI URL.
 */
export async function generateWebUiLink(accessId, duration = 3600) {
  try {
    // Step 1: Create channel
    const createResp = await fetch(`${BASE_URL}/devices/connect/${accessId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ access_id: accessId, duration }),
    });

    if (!createResp.ok) {
      const text = await createResp.text();
      throw new Error(`Failed to create connection: ${text}`);
    }

    const createData = await createResp.json();
    const channel = createData.meta?.channel;
    if (!channel) throw new Error("No channel returned from Teltonika API.");
    console.log("✅ Channel created:", channel);

    // Step 2: Get active sessions
    const sessionsResp = await fetch(
      `${BASE_URL}/devices/connect/${accessId}/sessions?active=true`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!sessionsResp.ok) {
      const text = await sessionsResp.text();
      throw new Error(`Failed to fetch active sessions: ${text}`);
    }

    const sessionsData = await sessionsResp.json();
    const activeSession = sessionsData.data?.[0];

    if (!activeSession || !activeSession.url) {
      throw new Error("No active Web UI URL returned from Teltonika API.");
    }

    // Step 3: Build the full Web UI URL
    const webUiUrl = `https://${activeSession.url}`;
    console.log("🌐 Generated Web UI Link:", webUiUrl);

    return webUiUrl;
  } catch (err) {
    console.error("Error generating WebUI link:", err.message);
    throw err;
  }
}
