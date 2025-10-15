import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { getWebUiForDevice } from "./services/teltonika/index.js"; // ⬅ new combined function

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.post("/device-info", async (req, res) => {
  //Split serial number and device name into seperate variables
  const { serialNumber, deviceName } = req.body;

  //Ensure the user didn't send empty values for either variable
  if (!serialNumber) {
    return res.status(400).json({ error: "Serial number is required" });
  } else if (!deviceName) {
    return res.status(400).json({ error: "Device name is required" });
  }

  try {
    // Stores the url from the teltonika service flow
    const webUIUrl = await getWebUiForDevice(serialNumber, deviceName);
    res.json({ success: true, webUIUrl });
  } catch (err) {
    console.error("❌ Error generating WebUI:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(`✅ Backend running on http://localhost:${PORT}`);
});
