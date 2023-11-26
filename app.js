require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const { authenticate } = require('@google-cloud/local-auth');
const emailProcessor = require('./emailProcessor');

const PORT = process.env.PORT || 4002;

app.get("/api", async (req, res) => {
  try {
    console.log("Authenticating...");
    const auth = await authenticate({
      keyfilePath: path.join(__dirname, process.env.GOOGLE_CREDENTIALS_FILE),
      scopes: [
        "https://www.googleapis.com/auth/gmail.readonly",
        "https://www.googleapis.com/auth/gmail.send",
        "https://www.googleapis.com/auth/gmail.labels",
        "https://mail.google.com/",
      ],
    });
    console.log("Authentication successful.");

    await emailProcessor.processEmails(auth);
    res.send("Email processing completed.");
  } catch (error) {
    console.error("Failed to process emails:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
