# Deployment Guide for Rohan's Event Horizon Portfolio

This guide explains step-by-step how to deploy your **Event Horizon: Black Hole & Hyperspace Portfolio** to the web for free.

---

## 🚀 Option 1: Deploy with Vercel (Recommended — 2 Minutes)

Vercel is the fastest and easiest platform for Vite + React applications, offering free hosting, fast global CDNs, automatic HTTPS, and free custom domain support.

### Step 1: Push Your Code to GitHub
1. Create a new repository on your GitHub account ([github.com/Rohan616](https://github.com/Rohan616)) named `black-hole-portfolio` (or `portfolio`).
2. In your terminal inside the project directory:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Event Horizon portfolio"
   git branch -M main
   git remote add origin https://github.com/Rohan616/black-hole-portfolio.git
   git push -u origin main
   ```

### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com/) and log in with your GitHub account.
2. Click **"Add New..."** → **"Project"**.
3. Select your `black-hole-portfolio` repository and click **"Import"**.

### Step 3: Configure Environment Variables
1. Under **Environment Variables**, add:
   - **Key**: `VITE_GEMINI_API_KEY`
   - **Value**: `AQ.Ab8RN6LZIVoZ-a3xDNAnLE8Ojc3w4q0nmLCWd96SczDSRsfPww`
2. Keep the default Build settings (`Build Command: npm run build`, `Output Directory: dist`).

### Step 4: Click Deploy!
- Click **"Deploy"**. Within ~45 seconds, your site will be live at `https://black-hole-portfolio.vercel.app` (or your custom domain)!

---

## ⚡ Option 2: Deploy with Netlify (Drag-and-Drop or GitHub)

### Method A: 30-Second Drag-and-Drop
1. Build the production bundle locally:
   ```bash
   npm run build
   ```
   This generates the optimized `dist` folder.
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
3. Drag and drop the `dist` folder into the upload box.
4. Your site goes live instantly with a free `.netlify.app` URL!

### Method B: GitHub Continuous Deployment
1. Log in to [netlify.com](https://www.netlify.com/) with GitHub.
2. Click **"Add new site"** → **"Import an existing project"**.
3. Select your repository.
4. Add your `VITE_GEMINI_API_KEY` in **Site Settings** → **Environment variables**.
5. Click **"Deploy Site"**.

---

## 🌐 Option 3: Deploying with Render or Railway (For Standalone `server.js`)

If you want to run the Express Gemini backend (`server.js`) on a dedicated cloud server:

1. Sign up at [render.com](https://render.com/).
2. Click **"New Web Service"** and connect your GitHub repository.
3. Configure:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node server.js`
4. In Environment Variables, set:
   - `GEMINI_API_KEY`: your Gemini API key
   - `PORT`: `3000` (or leave default)
5. Click **"Create Web Service"**.

---

## 🔑 Summary of Environment Variables for Production:
| Variable Name | Value | Purpose |
|---|---|---|
| `VITE_GEMINI_API_KEY` | `AQ.Ab8RN6LZIVoZ-a3xDNAnLE8Ojc3w4q0nmLCWd96SczDSRsfPww` | Direct in-browser Gemini 3.5 Flash queries |
| `GEMINI_API_KEY` | `AQ.Ab8RN6LZIVoZ-a3xDNAnLE8Ojc3w4q0nmLCWd96SczDSRsfPww` | Backend / Serverless API queries |
