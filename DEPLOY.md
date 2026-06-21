# DEPLOY GUIDE — Hire Me Maybe

## PREREQUISITES
Node.js 18+ required. Check: node --version

---

## STEP 1 — INSTALL DEPENDENCIES
cd your-project-folder
npm install

---

## STEP 2 — CREATE .env.local
Copy .env.example to .env.local and fill in values:

cp .env.example .env.local

Then open .env.local and paste:

GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAJUJGsXwPbwzVs0nt2gvEh8UuNmaaBL4o
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=plshireme-twt.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=plshireme-twt
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=plshireme-twt.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=930163488115
NEXT_PUBLIC_FIREBASE_APP_ID=1:930163488115:web:91aeb803a30c1d9e51c106
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-E4D7R9KF9K

---

## STEP 3 — SET UP FIREBASE (one-time)

A. Go to https://console.firebase.google.com
B. Select project: plshireme-twt

C. Enable Firestore:
   → Build → Firestore Database → Create database
   → Choose "Start in test mode"
   → Select a region (us-central1 recommended)

D. Enable Google Authentication:
   → Build → Authentication → Sign-in method
   → Enable Google provider
   → Add your email as support email
   → Save

E. Set Firestore security rules:
   → Firestore Database → Rules tab
   → Paste this and click Publish:

   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /leaderboard/{doc} {
         allow read: if true;
         allow create: if request.auth != null
           && request.resource.data.uid == request.auth.uid
           && request.resource.data.atsScore is number
           && request.resource.data.atsScore >= 0
           && request.resource.data.atsScore <= 100;
       }
     }
   }

---

## STEP 4 — GET GEMINI API KEY

A. Go to https://aistudio.google.com/app/apikey
B. Click "Create API Key"
C. Copy the key (starts with AIza...)
D. Paste into .env.local as GEMINI_API_KEY=

---

## STEP 5 — RUN LOCALLY

npm run dev

Open: http://localhost:3000
Test: upload a PDF resume → should analyze in ~15s

---

## STEP 6 — BUILD CHECK

npm run build

Must show: ✓ Compiled successfully

---

## STEP 7 — PUSH TO GITHUB

git init
git add .
git commit -m "Initial commit — Hire Me Maybe"

Go to https://github.com/new
Create a new repository (name it anything, keep it public or private)
Copy the repo URL, then run:

git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main

---

## STEP 8 — DEPLOY TO VERCEL

A. Go to https://vercel.com
B. Click "Add New Project"
C. Import your GitHub repository
D. Framework: Next.js (auto-detected)

E. ADD ENVIRONMENT VARIABLES:
   In Vercel → Project Settings → Environment Variables
   Add each variable from your .env.local:

   GEMINI_API_KEY                       = (your key)
   NEXT_PUBLIC_FIREBASE_API_KEY         = AIzaSyAJUJGsXwPbwzVs0nt2gvEh8UuNmaaBL4o
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN     = plshireme-twt.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID      = plshireme-twt
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET  = plshireme-twt.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 930163488115
   NEXT_PUBLIC_FIREBASE_APP_ID          = 1:930163488115:web:91aeb803a30c1d9e51c106
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID  = G-E4D7R9KF9K

F. Click Deploy

---

## STEP 9 — ADD VERCEL DOMAIN TO FIREBASE

After deploy, Vercel gives you a URL like: your-app.vercel.app

A. Go to Firebase Console → Authentication → Settings → Authorized Domains
B. Click "Add Domain"
C. Paste your Vercel URL (e.g. your-app.vercel.app)
D. Save

(Without this, Google Sign-In will fail on production)

---

## STEP 10 — VERIFY DEPLOYMENT

Open your Vercel URL and test:
1. Upload a PDF resume → ATS score appears
2. Click "Roast Mode" → toggle on, funny feedback appears
3. Click "Recruiter Mode → Run Analysis" → Hire/Maybe/Reject appears
4. Click "Rewrite Resume" → improved resume appears
5. Upload second resume in Compare section → comparison table appears
6. Click "Export PDF" → PDF downloads
7. Wait 3 seconds → Leaderboard modal appears → sign in → score saved
8. Visit /leaderboard → your score appears

---

## UPGRADE NOTES

Vercel Hobby plan: API calls timeout at 10 seconds
Gemini calls take 15-30 seconds
→ Upgrade to Vercel Pro ($20/month) for 60-second timeouts

---

## TROUBLESHOOTING

Gemini returns error: Check API key at aistudio.google.com
Firebase auth fails: Check authorized domains in Firebase Console
Build fails: Run npm install, then npm run build
Leaderboard empty: Enable Firestore in Firebase Console first
