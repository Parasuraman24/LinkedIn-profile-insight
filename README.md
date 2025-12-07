# LinkedIn Profile Insights - Chrome Extension

A Chrome Extension for unlocking LinkedIn profile analytics and viewer insights.

## Features
- **Secure Login**: LinkedIn OAuth2 integration.
- **Dashboard**: View profile stats (Views, Search Appearances).
- **Analytics Charts**: Visual trend lines for profile growth.
- **Recent Viewers**: (Mock/Safe) scan of who viewed your profile.
- **Privacy First**: Local storage only for tokens, explicit consent for scraping.

## Prerequisites
- Node.js (v18+)
- PostgreSQL (for Backend)

## Installation

### 1. Backend Setup
The backend handles OAuth and secure data storage.

```bash
cd backend
npm install
# Set up .env
cp .env.example .env
# Start Server
npm run dev
```

### 2. Extension Setup
The extension is built with React + Vite + CRXJS.

```bash
cd extension
npm install
npm run build
```

### 3. Load into Chrome
1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** (top right).
3. Click **Load unpacked**.
4. Select the `dist` folder inside `extension/`.

## Usage
1. Click the extension icon.
2. Sign in with LinkedIn.
3. View your dashboard.

## Tech Stack
- **Frontend**: React, TypeScript, TailwindCSS, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL Schema provided (`backend/src/database/schema.sql`)
