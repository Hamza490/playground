import fetch from "node-fetch";

export async function getDeviceIdBySerial(serialNumber) {
  const url = `https://rms.teltonika-networks.com/api/devices?fields=id,serial&q=${encodeURIComponent(serialNumber)}`;

  const resp = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.TELTONIKA_API_KEY}`
    },
  });

  if (!resp.ok) {
    const text = await resp.text();
    console.error("Failed getDevices:", resp.status, text);
    throw new Error("Failed to get devices");
  }

  const body = await resp.json();
  // The response might have an array of devices
  const devices = body.data || body;  // depending on how the API returns
  if (!devices || devices.length === 0) {
    throw new Error("No device found with this serial number");
  }

  // take first matching device -- > change for future
  const device = devices[0];
  return device.id;
}
