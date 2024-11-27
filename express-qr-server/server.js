// server.js

const express = require("express");
const NeDB = require("nedb");
const QRCode = require("qrcode");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const db = new NeDB();

app.use(cors()); // Corrected: call cors as a function
app.use(bodyParser.json());
app.use(express.static("public"));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.post("/generate-qr", (req, res) => {
  const { name } = req.body;
  const qrData = `${name}-${Date.now()}`; // Create unique data for QR

  QRCode.toDataURL(qrData, (err, url) => {
    if (err) return res.status(500).send("QR code generation failed.");

    // Save to NeDB
    db.insert({ name, qrData });

    res.json({ qrImage: url });
  });
});

app.post("/verify-qr", (req, res) => {
  const { name, qrData } = req.body;

  db.findOne({ name, qrData }, (err, doc) => {
    if (err) return res.status(500).send("Error querying database.");
    if (doc) {
      res.json({ message: "Authentication successful" });
    } else {
      res.json({ message: "Authentication failed" });
    }
  });
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("Server running on port 5000"));
