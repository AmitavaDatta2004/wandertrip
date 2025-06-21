# 💸✨ WanderLedger: The Ultimate Multi-User Travel Expense Tracker 🌍🧳

Welcome to **WanderLedger** — your all-in-one, beautifully designed app for tracking, splitting, and managing travel expenses with friends, family, or groups! Whether you’re backpacking across Europe, road-tripping with buddies, or planning a family vacation, WanderLedger keeps your finances organized and stress-free. 🧳✨


---

## 📚 Table of Contents
- [🌟 Overview](#-overview)
- [🚀 Key Features](#-key-features)
- [👥 Multi-User Collaboration](#-multi-user-collaboration)
- [🧭 User Flow](#-user-flow)
- [📸 Screenshots](#-screenshots)
- [📁 Project Structure](#-project-structure)
- [🛠️ Setup & Installation](#-setup--installation)
- [🔑 Environment Variables](#-environment-variables)
- [🎨 Customization](#-customization)
- [📄 License](#-license)

---

## 🌟 Overview
WanderLedger is a modern, secure, and intuitive web app for managing group travel expenses. No more messy spreadsheets or awkward money talk — just seamless, transparent, and fair expense sharing! 💚

- 🕒 Track every expense in real time
- 🤝 Split costs automatically among group members
- 💸 Settle up with a single tap
- 📊 Visualize spending with beautiful charts and summaries
- 🌐 Access your trips from any device, anywhere

---

## 🚀 Key Features

### 💳 Effortless Expense Tracking
- ➕ Add, edit, and delete expenses with ease
- 🏷️ Categorize expenses (food, transport, lodging, activities, etc.)
- 📎 Attach notes, receipts, and photos to each expense
- 💱 Multi-currency support with automatic conversion

### 👥 Real-Time Multi-User Collaboration
- ✉️ Invite friends or family to join your trip
- 🔄 Real-time updates for all group members
- 🧮 Assign expenses to individuals or split equally/by percentage/by share
- 🧾 See who owes whom, and settle up instantly

### 📊 Analytics & Insights
- 📈 Visualize spending by category, person, or day
- 📤 Export trip reports as PDF or CSV
- 🧮 Get smart summaries: total spent, per-person share, outstanding balances

### 🔒 Security & Cloud Sync
- 🔐 Secure authentication (Firebase Auth)
- ☁️ All data stored safely in the cloud (Firebase/Firestore)
- 📲 Access your trips from any device, anytime

### 🖌️ Beautiful, Responsive UI
- 🎨 Modern design with Tailwind CSS
- 📱 Works great on desktop, tablet, and mobile
- 🌙 Dark mode support for night owls

---

## 👥 Multi-User Collaboration
- 🆕 **Create a trip:** Start a new trip and invite others via email or link
- 📝 **Add expenses:** Anyone in the group can add or edit expenses
- 🔄 **Automatic sync:** All changes are instantly visible to everyone
- 💵 **Settle up:** See who owes what, and mark payments as settled

---

## 🧭 User Flow
1. 🔐 **Sign Up / Log In:** Securely authenticate with email or social login
2. 🗺️ **Create or Join a Trip:** Start a new trip or join an existing one via invite
3. ➕ **Add Expenses:** Log expenses, assign payers, split costs
4. 📊 **Track & Visualize:** View charts, summaries, and balances
5. 💸 **Settle Up:** Mark payments, export reports, and finish your trip with zero confusion!

---


## 📁 Project Structure (Key Files)
- `src/pages/` — Main app pages (Dashboard, Trip, Login, Signup, etc.)
- `src/components/` — UI components (ExpenseList, AddExpense, TripSummary, etc.)
- `src/contexts/` — Context providers for auth, trips, and users
- `src/lib/` — Utility functions, API integrations, and services
- `public/` — Static assets (icons, images, etc.)

---

## 🛠️ Setup & Installation
1. 📥 **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/wanderledger.git
   cd wanderledger
   ```
2. 📦 **Install dependencies:**
   ```sh
   npm install
   # or yarn, pnpm, bun
   ```
3. 🔑 **Configure environment variables:**
   - Add your Firebase credentials and any other required keys to `.env` (see below).
4. ▶️ **Run the development server:**
   ```sh
   npm run dev
   ```
5. 🌐 **Open the app:**
   - Visit [http://localhost:3000](http://localhost:3000)

---

## 🔑 Environment Variables
Create a `.env` file in the root directory:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-firebase-measurement-id
```

---

## 🎨 Customization
- 🖌️ **UI/UX:** Tweak components in `src/components/` for your brand or workflow
- 💡 **Expense Logic:** Extend `src/contexts/TripContext.tsx` for custom splitting or analytics
- 🌍 **Localization:** Add more currencies or languages as needed
- 📊 **Analytics:** Integrate more charts or export formats for deeper insights

---

## 📄 License
MIT License. See [LICENSE](LICENSE) for details.

---

<p align="center">
  <b>🌟 WanderLedger: Travel together, spend smarter, and make memories — not money messes! 🌟</b><br/>
  <i>Made with ❤️ for travelers everywhere!</i>
</p>
