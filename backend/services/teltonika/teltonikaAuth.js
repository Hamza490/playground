// Handles base config and authentication
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const teltonikaAPI = axios.create({
  baseURL: process.env.TELTONIKA_BASE_URL, // e.g., "https://rms.teltonika-networks.com/api"
  headers: {
    Authorization: `Bearer ${process.env.TELTONIKA_API_KEY}`,
    "Content-Type": "application/json"
  }
});
