import { useState } from 'react'
import './App.css'

function App() {
  const [serialNumber, setSerialNumber] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:3000/device-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serialNumber, deviceName }),
      });

      if (!res.ok) throw new Error("Network response was not ok");

      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setResponse("Error: " + err);
    }
  };

  return (
    <div style={{padding: "2rem", fontfamily: "sans-serif"}}>
      <h1>Teltonika Device Interface</h1>

      <input
        type="text"
        placeholder="Serial Number"
        value={serialNumber}
        onChange={(e)=>setSerialNumber(e.target.value)}
        style={{ marginRight: "1rem", marginBottom: "1rem" }}
      />

      <input
        type="text"
        placeholder="Device Name"
        value={deviceName}
        onChange={(e) => setDeviceName(e.target.value)}
        style={{ marginRight: "1rem", marginBottom: "1rem" }}
      />

      <button onClick={handleSubmit}>Open Interface</button>
      
      <pre style={{ marginTop: "1rem", background: "#f0f0f0", padding: "1rem" }}>
        {response}
      </pre>
      
    </div>
  )

}
export default App
