require('dotenv').config();
const express = require('express');
const path = require('path');
const { authenticate } = require('@google-cloud/local-auth');
const emailProcessor = require('./emailProcessor'); // Make sure this path is correct
const app = express();


// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static('public'));
const PORT = process.env.PORT || 4002;

// Route for handling email processing
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
    res.redirect('/config?success=true'); // Redirect to /config with a success parameter
  } catch (error) {
    console.error("Failed to process emails:", error);
    res.redirect('/config?success=false'); // Redirect to /config with a failure parameter
  }
});


app.get('/config', (req, res) => {
  const currentSettings = emailProcessor.getCurrentSettings();
  const successMessage = req.query.success === 'true' ? 'Email authentication successful!' : '';
  const errorMessage = req.query.success === 'false' ? 'Failed to process emails. Please try again.' : '';
  
  res.render('config', { 
    currentSettings: currentSettings,
    vacationMessages: emailProcessor.vacationMessages,
    message: successMessage,
    error: errorMessage
  });
});









// Route for updating configuration settings
app.post('/config', (req, res) => {
  emailProcessor.updateSettings(req.body);
  res.redirect('/api');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
