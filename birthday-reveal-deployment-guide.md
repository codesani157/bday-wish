# Step-by-Step Vercel & Cloud Deployment Guide 🚀

This guide walks you through deploying the **Birthday Reveal Platform** to the cloud step-by-step ($0 cost on free tiers).

---

## 🎯 Platform Overview
Your platform consists of two main web clients and one API backend:
1. **`birthday-reveal-web`** (Recipient 3D Web Engine) ➔ Deployed on **Vercel** ($0 Free).
2. **`birthday-reveal-mobile`** (Sender Web App) ➔ Deployed on **Vercel** ($0 Free).
3. **`birthday-reveal-api`** (Backend REST API & Delivery Worker) ➔ Deployed on **Railway** or **Render** ($0–$5/mo).

---

## 📦 PHASE 1: Deploying the 3D Web Reveal Engine (`birthday-reveal-web`) on Vercel

### Step 1: Log in to Vercel
1. Go to [https://vercel.com](https://vercel.com) and log in with your **GitHub** account.

### Step 2: Import Your Repository
1. Click **"Add New..."** ➔ **"Project"**.
2. Select your GitHub repository: **`codesani157/bday-wish`**.

### Step 3: Configure Project Settings
In the Vercel project deployment configuration screen:
1. **Project Name**: Set to `birthday-reveal-web` (or your custom name).
2. **Framework Preset**: Select **Vite**.
3. **Root Directory**: Click **Edit** and select **`birthday-reveal-web`**.
4. **Build & Output Settings**:
   - **Build Command**: `npm run build` (or `tsc -b && vite build`)
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step 4: Environment Variables (Optional for now)
If your API backend is already deployed:
- Add variable: `VITE_API_BASE` = `https://your-api-domain.com`
*(If not set yet, it will default to localhost or fallback demo mode).*

### Step 5: Deploy!
1. Click **"Deploy"**.
2. Vercel will build your 3D WebGL engine and assign you a live production URL (e.g., `https://birthday-reveal-web.vercel.app`).

---

## 📱 PHASE 2: Deploying the Sender Web Portal (`birthday-reveal-mobile`) on Vercel

### Step 1: Import Project Again in Vercel
1. On your Vercel Dashboard, click **"Add New..."** ➔ **"Project"**.
2. Select the same GitHub repository: **`codesani157/bday-wish`**.

### Step 2: Configure Project Settings
1. **Project Name**: Set to `birthday-reveal-sender` (or your custom name).
2. **Framework Preset**: Select **Other** or **Vite**.
3. **Root Directory**: Click **Edit** and select **`birthday-reveal-mobile`**.
4. **Build & Output Settings**:
   - **Build Command**: `npx expo export:web` or `npm run build`
   - **Output Directory**: `web-build` or `dist`
   - **Install Command**: `npm install`

### Step 3: Deploy!
1. Click **"Deploy"**.
2. Vercel will build your Expo Web app and assign a live production URL (e.g., `https://birthday-reveal-sender.vercel.app`).

---

## ⚙️ PHASE 3: Deploying the Backend API (`birthday-reveal-api`) on Railway / Render

Since Node.js APIs require a persistent server process and background worker, deploy `birthday-reveal-api` on **Railway.app** or **Render.com**:

### Option A: Railway.app Deployment ($0 Free Credit)
1. Go to [https://railway.app](https://railway.app) and sign in with GitHub.
2. Click **"New Project"** ➔ **"Provision PostgreSQL"** (Creates your live Postgres database).
3. Click **"New"** ➔ **"GitHub Repo"** ➔ Select `codesani157/bday-wish`.
4. Set **Root Directory**: `birthday-reveal-api`.
5. Set **Start Command**: `npm start` (Runs Fastify server on port `$PORT`).
6. Set **Environment Variables**:
   - `DATABASE_URL` = `${Postgres.DATABASE_URL}`
   - `JWT_SECRET` = `super-secret-key-change-in-prod`
   - `NODE_ENV` = `production`
7. Railway will deploy your API and generate a public HTTPS URL (e.g., `https://api-production-xxxx.up.railway.app`).

---

## 🔗 PHASE 4: Connect Everything Together

Once your API backend URL is generated on Railway (e.g. `https://api-production-xxxx.up.railway.app`):
1. Go back to your **`birthday-reveal-web`** project on Vercel.
2. Go to **Settings** ➔ **Environment Variables**.
3. Add: `VITE_API_BASE` = `https://api-production-xxxx.up.railway.app`.
4. Click **Redeploy**.

---

## 🎉 You're Live!
- **Sender Portal**: `https://birthday-reveal-sender.vercel.app`
- **Recipient 3D Reveal**: `https://birthday-reveal-web.vercel.app`
- **Backend API**: `https://api-production-xxxx.up.railway.app`
