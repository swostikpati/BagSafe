// App.js
import React, { useState } from "react";
import axios from "axios";
import { Scanner } from "@yudiel/react-qr-scanner";

function App() {
  const [name, setName] = useState("");
  const [qrData, setQrData] = useState("");
  const [message, setMessage] = useState("");
  const [scanStatus, setScanStatus] = useState(""); // Immediate feedback for scan status

  const handleScan = (result) => {
    if (result) {
      setQrData(result[0].rawValue); // Capture the QR code's raw value
      console.log(result[0].rawValue);
      setScanStatus("QR Code Scanned!"); // Immediate feedback
    }
  };

  const handleError = (error) => {
    console.error(error);
    setMessage("Error scanning QR code.");
  };

  const handleSubmit = () => {
    if (name && qrData) {
      axios
        .post("https://bag-safe-server.vercel.app/verify-qr", { name, qrData })
        .then((res) => setMessage(res.data.message))
        .catch(() => setMessage("Error during verification."));
      setScanStatus(""); // Clear scan status after submission
    } else {
      setMessage("Please enter your name and scan the QR code first.");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>QR Code Authentication</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        style={{ padding: "10px", marginBottom: "10px" }}
      />
      <Scanner
        onScan={handleScan}
        onError={handleError}
        constraints={{ facingMode: "environment" }} // Use back camera if available
        style={{ width: "300px", margin: "20px auto" }}
      />
      {scanStatus && <p style={{ color: "green" }}>{scanStatus}</p>}{" "}
      {/* Immediate feedback */}
      <button onClick={handleSubmit} style={{ padding: "10px 20px" }}>
        Submit
      </button>
      <p>{message}</p>
    </div>
  );
}

export default App;
