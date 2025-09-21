# REST Client App

Initial setup for the **RS School React Course 2025 final task** project.

## 🚀 How to Run

```bash
git clone https://github.com/IgorMotorin/rest-client-app.git
cd rest-client-app
npm install
npm run dev
```

App will be available at [http://localhost:3000](http://localhost:3000).

## ✅ What’s set up

- Next.js (App Router) + TypeScript
- Added dependencies: firebase, firebase-admin, next-intl, zustand, tailwindcss, tailgrids, zod, react-hook-form
- Firebase client SDK initialized (`src/lib/firebase.ts`)
- Minimal routes:
  - Localized Home page (`/en`, `/ru`)
  - Localized 404 page
- Localization with `next-intl` (English + Russian JSON files)
- Project folders aligned with suggested structure (`components/`, `services/`, `store/`, `i18n/`)
- `.gitkeep` added to keep empty dirs under version control
- Note: Global CSS variables for colors are included, but these are not final — we can decide together on the exact palette and global styling.

## 🔑 Firebase Setup

This project uses **Firebase** (Auth + Firestore).  
Before running locally, create a `.env` file in the project root with your Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## ❌ Not yet

- `/pages/` directory (Next.js uses `app/` instead)
- Testing framework (pending team decision)
- Full feature implementation (REST client, variables, history)

## 📂 Structure

### Suggested

```
src/
├── components/
├── pages/
├── services/
├── store/
├── App.tsx
├── index.tsx
└── setupTests.ts
```

### Current

```
src/
└── app/
    ├── [locale]/
    │   ├── layout.tsx
    │   ├── not-found.tsx
    │   └── Rest.tsx
    └── globals.css
├── components/
├── i18n/
├── services/
└── store/
```

## 📝 Next Steps

- Pick a testing framework (Jest, Vitest, etc.)
- Implement components (`RequestForm`, `ResponsePanel`)
- Add Firebase Auth logic
- Build REST client, Variables, History routes
- Replace `.gitkeep` with real code
