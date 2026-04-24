# PU-BusLink — Firestore Seed Data Instructions

## Step 1: Enable Firebase Services

Go to your Firebase console and enable:
1. **Authentication** → "Sign-in method" → Enable `Email/Password` + `Google`
2. **Firestore Database** → Create in **Production mode**
3. **Deploy rules** from `firestore.rules` using Firebase CLI:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init firestore
   firebase deploy --only firestore:rules
   ```

## Step 2: Add Your Firebase Config

Open `.env.local` and replace placeholder values with your real config from:
**Firebase Console → Project Settings → Your Apps → Web App → SDK setup and configuration**

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc...
```

## Step 3: Create an Admin User

1. Register a new account via the app using your PU email
2. Go to **Firestore Console** → `users` collection → find your document
3. Change the `role` field from `"student"` to `"admin"`

## Step 4: Seed Sample Bus Data (Firestore Console)

In Firestore Console → `buses` collection → Add document:

**Document 1** (auto ID):
```json
{
  "busNumber": "PU-01",
  "routeId": "route-1",
  "driverName": "Ramesh Kumar",
  "driverPhone": "9876543210",
  "lat": 26.8467,
  "lng": 75.7480,
  "isActive": true,
  "speed": 35,
  "lastUpdated": (server timestamp)
}
```

**Document 2** (auto ID):
```json
{
  "busNumber": "PU-02",
  "routeId": "route-2",
  "driverName": "Suresh Singh",
  "driverPhone": "9876543211",
  "lat": 26.8510,
  "lng": 75.7520,
  "isActive": true,
  "speed": 22,
  "lastUpdated": (server timestamp)
}
```

## Step 5: Seed Sample Route Data

In Firestore Console → `routes` collection → Add document:

**Document 1** (use ID: `route-1`):
```json
{
  "name": "Route A — City Center",
  "busNumber": "PU-01",
  "active": true,
  "departureTime": "07:30 AM",
  "returnTime": "05:30 PM",
  "stops": [
    { "id": "s1", "name": "Poornima University", "time": "07:30 AM", "lat": 26.8467, "lng": 75.748, "order": 1 },
    { "id": "s2", "name": "Sitapura Bypass",     "time": "07:45 AM", "lat": 26.84,   "lng": 75.77,  "order": 2 },
    { "id": "s3", "name": "Tonk Road",           "time": "08:00 AM", "lat": 26.855,  "lng": 75.788, "order": 3 },
    { "id": "s4", "name": "Sindhi Camp",         "time": "08:20 AM", "lat": 26.922,  "lng": 75.817, "order": 4 },
    { "id": "s5", "name": "City Center",         "time": "08:40 AM", "lat": 26.93,   "lng": 75.82,  "order": 5 }
  ]
}
```

## Step 6: Run the App

```bash
cd pu-buslink
npm run dev
```

Open http://localhost:3000
