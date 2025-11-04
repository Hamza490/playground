// backend/services/teltonika/teltonikaAccessMap.js
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const BASE_URL = "https://rms.teltonika-networks.com/api";
const API_KEY = process.env.TELTONIKA_API_KEY;

/**
 * Fetch remote-access entries for a router and return a dictionary mapping.
 *
 * @param {number|string} routerDeviceId - RMS device_id for the router (e.g. 1488216)
 * @returns {Promise<Record<string, Array<Object>>>} - mapping: key -> list of access entries
 *
 * Example return shape:
 * {
 *   "192.168.1.144": [
 *     { id: 2032842, name: "Camera HTTPS", protocol: "https", destination_port: "443", created_at: "..." },
 *     { id: 2032850, name: "Camera HTTP", protocol: "http", destination_port: "80", created_at: "..." }
 *   ],
 *   "192.168.1.1": [ ... ],
 *   "Camera-UnknownIP-2153960": [ ... ] // fallback key when destination_ip is null
 * }
 */
export async function getAccessMapForRouter(routerDeviceId) {
  try {
    if (!routerDeviceId) {
      throw new Error("routerDeviceId is required");
    }

    // Request only fields we need to keep payload small
    const fields = [
      "id",
      "device_id",
      "name",
      "destination_ip",
      "destination_port",
      "protocol",
      "created_at",
    ].join(",");

    const url = `${BASE_URL}/devices/remote-access?device_id=${routerDeviceId}&fields=${encodeURIComponent(fields)}`;

    const resp = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!resp.ok) {
      const txt = await resp.text();
      throw new Error(`Failed to fetch remote-access list: ${resp.status} - ${txt}`);
    }

    const json = await resp.json();
    const items = Array.isArray(json.data) ? json.data : [];

    // reduce into a dictionary grouped by destination_ip (fallback: name or id)
    const map = items.reduce((acc, entry) => {
      const {
        id,
        name = null,
        destination_ip = null,
        destination_port = null,
        protocol = null,
        created_at = null,
      } = entry;

      // key preference: destination_ip -> name -> id
      const key = destination_ip || name || `access-${id}`;

      const normalized = {
        id,
        name,
        protocol,
        destination_ip,
        destination_port,
        created_at,
      };

      if (!acc[key]) acc[key] = [];
      acc[key].push(normalized);
      return acc;
    }, {});

    // for convenience, sort entries per key by created_at desc (newest first)
    Object.keys(map).forEach((k) => {
      map[k].sort((a, b) => {
        if (!a.created_at && !b.created_at) return 0;
        if (!a.created_at) return 1;
        if (!b.created_at) return -1;
        return new Date(b.created_at) - new Date(a.created_at);
      });
    });

    return map;
  } catch (err) {
    console.error("teltonikaAccessMap.getAccessMapForRouter error:", err.message);
    throw err;
  }
}

export default getAccessMapForRouter;
