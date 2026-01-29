const fs = require('fs');
const path = require('path');

try {
    const creds = require('./credentials.json');
    // Read existing .env to preserve SHEET_ID if present
    let sheetId = 'YOUR_SHEET_ID_HERE';
    if (fs.existsSync('.env')) {
        const envConfig = fs.readFileSync('.env', 'utf8');
        const match = envConfig.match(/GOOGLE_SHEET_ID=(.*)/);
        if (match && match[1]) {
            sheetId = match[1].trim();
        }
    }

    // Format the key: ensure it is a single line with literal \n
    const formattedKey = creds.private_key.replace(/\n/g, '\\n');

    const envContent = `GOOGLE_SERVICE_ACCOUNT_EMAIL=${creds.client_email}
GOOGLE_PRIVATE_KEY="${formattedKey}"
GOOGLE_SHEET_ID=${sheetId}
PORT=3000
`;

    fs.writeFileSync('.env', envContent);
    console.log('✅ Successfully fixed .env file using credentials.json');
} catch (error) {
    console.error('❌ Error fixing .env:', error.message);
}
