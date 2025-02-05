require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const AUTH_TOKEN = process.env.AUTH_TOKEN || "mysecuretoken";

app.get('/firebase-config', (req, res) => {
  const token = req.query.token;

  if (token !== AUTH_TOKEN) {
    return res.status(403).json({ error: "Unauthorized access" });
  }

  res.json({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
