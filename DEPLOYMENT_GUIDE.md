# Deployment Guide for Gandi.net

This guide outlines the steps to deploy your `green-utopia` website to Gandi.net Simple Hosting using GitHub Actions.

## Prerequisites
- Access to your [Gandi.net](https://www.gandi.net/) account.
- Access to this project's GitHub repository.
- A terminal (Command Prompt, PowerShell, or Git Bash).

---

## Step 1: Set up Gandi Simple Hosting
1. Log in to your Gandi.net account.
2. Navigate to **Simple Hosting** in the left menu.
3. Click **Create Instance**.
4. Select **Node.js** as the language/database environment.
5. Choose the **Small** size (sufficient for this project).
6. Complete the checkout process to create the instance.

## Step 2: Configure Environment Variables
Your application requires specific secrets to connect to Google Sheets.
1. In your Gandi Instance dashboard, go to the **Configuration** or **Environment** tab.
2. Add the following variables (values can be found in your local `.env` file):
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_SHEET_ID`
   - `GOOGLE_PRIVATE_KEY`
     - *Note: Copy the full key including `-----BEGIN...` and `...END-----`. If you encounter issues, ensure newline characters (`\n`) are handled correctly.*
   - `PORT`: Set to `8080`.

## Step 3: Get Connection Details
1. On your Instance overview page, look for the **"Git"** or **"Deployment"** section.
2. Copy the **Git URL**. It will look similar to: 
   `ssh://123456@git.sd3.gpaas.net/default.git`

## Step 4: Setup SSH Keys
You need a key pair to allow GitHub to push code to Gandi securely.

1. **Generate a Key Pair** (on your local machine):
   Open your terminal and run:
   ```bash
   ssh-keygen -t rsa -b 4096 -C "gandi-deploy"
   ```
   - Press **Enter** to accept the default file location.
   - Press **Enter** twice to skip adding a password.

2. **Add Public Key to Gandi**:
   - Locate the `id_rsa.pub` file created in the user directory (e.g., `C:\Users\YourName\.ssh\id_rsa.pub`).
   - Open it with a text editor and copy the contents.
   - In your Gandi dashboard, go to **Security** or **SSH Keys** > **Add Key** and paste the public key.

3. **Add Private Key to GitHub**:
   - Locate the `id_rsa` file (without extension) in the same directory.
   - Open it and **copy the entire content**.
   - Go to your GitHub Repository > **Settings** > **Secrets and variables** > **Actions**.
   - Click **New repository secret**.
     - **Name**: `GANDI_SSH_PRIVATE_KEY`
     - **Value**: Paste the private key content.

## Step 5: Add Git URL to GitHub
In the same GitHub Secrets page, add another secret:
- **Name**: `GANDI_GIT_URL`
- **Value**: The Git URL you copied in Step 3.

## Step 6: Update Domain in Code
Before the final push, ensure your code points to the live server.
1. Open `js/script.js`.
2. Locate the `API_URL` definition (around line 240).
3. Update the production URL to match your domain:
   ```javascript
   // Example
   : 'https://your-domain.com/submit-form';
   ```

## Step 7: Push to GitHub
The deployment is automated via the `.github/workflows/gandi_deploy.yml` file. Whenever you push to the `main` branch, GitHub will deploy to Gandi.

1. Update your code and commit:
   ```bash
   git add .
   git commit -m "Configure deployment and updates"
   git push origin main
   ```
2. Go to the **Actions** tab in your GitHub repository to monitor the deployment status.

---

### Troubleshooting
- **Deployment Fails**: Check the "Actions" tab logs on GitHub for error messages.
- **Form Not Working**: Ensure environment variables in Gandi are identical to your `.env` file and that the `API_URL` in `script.js` is correct.
