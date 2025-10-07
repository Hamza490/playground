import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.post("/device-info", (req, res) => {
  const {serialNumber, deviceName} =req.body;

  if (!serialNumber) {
    return res.status(400).json({error: "Serial number is required"});
  }

  else if (!deviceName) {
    return res.status(400).json({error: "Device name is required"});
  }

  res.json({ receivedSerialNumber: serialNumber, 
             receivedDeviceName: deviceName});
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});