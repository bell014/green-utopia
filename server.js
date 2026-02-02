const express = require('express');
const cors = require('cors');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allow all CORS requests for now (can be restricted to specific domain)
app.use(express.json()); // Parse JSON bodies

// Google Sheets Setup
// Strict .env usage as requested

// Helper function to clean the private key
const getPrivateKey = () => {
    const key = process.env.GOOGLE_PRIVATE_KEY;
    if (!key) return null;

    // If the key is wrapped in double quotes in the .env file, dotenv might leave them if not parsed correctly,
    // but usually dotenv handles it. 
    // We need to convert literal "\n" characters back to actual newlines.
    return key.replace(/\\n/g, '\n');
};

let doc;
const privateKey = getPrivateKey();

if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && privateKey && process.env.GOOGLE_SHEET_ID) {
    try {
        const serviceAccountAuth = new JWT({
            email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            key: privateKey,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
        doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
        console.log('✅ Auth initialized using .env variables');
    } catch (err) {
        console.error('❌ Error initializing Google Auth:', err.message);
        process.exit(1); // Exit if auth fails
    }
} else {
    console.error('❌ CRITICAL ERROR: Missing .env credentials.');
    console.error('Please ensure GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, and GOOGLE_SHEET_ID are set.');
    process.exit(1); // Exit if credentials missing
}

// Endpoint to handle form submission
app.post('/submit-form', async (req, res) => {
    try {
        const { fullName, company, email, phone, expertise, message } = req.body;

        if (!fullName || !email || !message) {
            return res.status(400).json({ error: 'Missing required fields: fullName, email, message' });
        }

        // Load document info
        await doc.loadInfo();

        // Use the first sheet
        const sheet = doc.sheetsByIndex[0];

        // Append a row
        await sheet.addRow({
            Date: new Date().toISOString(),
            FullName: fullName,
            Company: company || 'N/A',
            Email: email,
            Phone: phone || 'N/A',
            Expertise: expertise || 'N/A',
            Message: message
        });
        console.log('✅ Data saved to Google Sheet');

        res.status(200).json({ message: 'Form submitted successfully' });

    } catch (error) {
        console.error('Error submitting form:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// Endpoint to handle newsletter subscription
app.post('/subscribe', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Load document info
        await doc.loadInfo();

        // Get or create "green-utopia-newsletter" sheet
        let sheet = doc.sheetsByTitle['green-utopia-newsletter'];
        if (!sheet) {
            console.log('Creating new sheet: green-utopia-newsletter');
            sheet = await doc.addSheet({ title: 'green-utopia-newsletter', headerValues: ['Date', 'Email'] });
        }

        // Append a row
        await sheet.addRow({
            Date: new Date().toISOString(),
            Email: email
        });
        console.log(`✅ New subscriber added to "green-utopia-newsletter" sheet: ${email}`);

        res.status(200).json({ message: 'Subscribed successfully' });

    } catch (error) {
        console.error('Error subscribing:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

