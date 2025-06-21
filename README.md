# 🚀 wandertrip: Hack4Bengal 2025 — Gemini AI Track Submission 🌈

Welcome to **wandertrip** — our innovative project for Hack4Bengal 2025, built for the Gemini AI Track! This repository brings together two powerful, user-centric web applications: **Tripmancer** and **WanderLedger**. Together, they redefine the travel experience by combining AI-powered trip planning with seamless, multi-user expense management. 🧳💸

---

## 🏆 About Hack4Bengal & Gemini AI Track
Hack4Bengal is a leading hackathon that celebrates creativity, technology, and impact. The **Gemini AI Track** challenges teams to harness the capabilities of Google Gemini AI for real-world solutions. Our project leverages Gemini AI to deliver personalized travel planning and smart group expense management, making travel smarter, more fun, and stress-free!

---

## 📚 Table of Contents
- [🌟 Overview](#-overview)
- [🤖 Gemini AI Relevance](#-gemini-ai-relevance)
- [🚀 Key Features](#-key-features)
- [🧭 User Flow](#-user-flow)
- [📁 Project Structure](#-project-structure)
- [🛠️ Setup & Installation](#-setup--installation)
- [🔑 Environment Variables](#-environment-variables)
- [🎨 Customization](#-customization)
- [📄 License](#-license)

---

## 🌟 Overview
**wandertrip** is a comprehensive travel platform that unites:
- **Tripmancer**: An AI-powered mood-based trip suggestion app. Users describe their mood and preferences, and Gemini AI crafts three unique, detailed itineraries — complete with destinations, activities, food, and travel tips! 🏝️🧘
- **WanderLedger**: The ultimate multi-user travel expense tracker. Seamlessly split, track, and settle expenses with friends or family, with real-time collaboration and beautiful analytics. 💸🤝

---

## 🤖 Gemini AI Relevance
- **Tripmancer** leverages Google Gemini AI to:
  - 🧠 Understand nuanced user moods and preferences
  - 🏗️ Generate actionable, structured travel plans
  - ✨ Enhance user experience with creative, personalized suggestions
- **WanderLedger** demonstrates how AI-driven design and cloud tech can make group expense management effortless, transparent, and fair.

Both modules embody the spirit of the Gemini AI Track: using LLMs and modern web stacks to solve real-world problems for travelers everywhere! 🌏

---

## 🚀 Key Features

### ✨ Tripmancer
- 🧘 Mood-based trip generation using Gemini AI
- 🗺️ Three unique trip suggestions per request
- 📅 Detailed daily itineraries and activities
- 📍 Points of interest, local cuisine, and travel tips
- 🎒 Packing lists and 💸 budget estimates
- 🖌️ Responsive, modern UI (React + Tailwind CSS)

### 💸 WanderLedger
- 💳 Effortless expense tracking and splitting
- 👥 Real-time multi-user collaboration
- 📊 Analytics & insights (charts, summaries, exports)
- 🔒 Secure authentication & cloud sync (Firebase)
- 🌙 Beautiful, responsive UI with dark mode

---

## 🧭 User Flow
1. **Tripmancer**
   - 📝 Enter your mood, trip duration, group size, budget, and preferences
   - 🤖 Gemini AI crafts three unique trip options
   - 🗂️ Browse itineraries, maps, packing lists, and tips
   - 💾 Save, export, or share your favorite plans
2. **WanderLedger**
   - 🔐 Sign up or log in
   - 🗺️ Create or join a trip with friends
   - ➕ Add and split expenses in real time
   - 📊 Visualize spending, settle up, and export reports

---

## 📁 Project Structure (Key Files)
- `tripmancer/` — Tripmancer app (AI-powered trip planning)
  - `src/pages/GenerateTrip.tsx` — Trip generation form and logic
  - `src/lib/services/tripService.ts` — AI prompt construction and Gemini API calls
  - `src/lib/api/geminiAPI.ts` — Gemini API integration
  - `src/pages/Results.tsx` — Displays AI-generated trip suggestions
  - `src/components/home/CustomizationSection.tsx` — Trip customization UI
- `wanderledger/` — WanderLedger app (expense management)
  - `src/pages/` — Main app pages (Dashboard, Trip, Login, Signup, etc.)
  - `src/components/` — UI components (ExpenseList, AddExpense, TripSummary, etc.)
  - `src/contexts/` — Context providers for auth, trips, and users
  - `src/lib/` — Utility functions, API integrations, and services
  - `public/` — Static assets (icons, images, etc.)

---

## 🛠️ Setup & Installation
1. 📥 **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/wandertrip.git
   cd wandertrip
   ```
2. 📦 **Install dependencies:**
   ```sh
   cd tripmancer && npm install
   cd ../wanderledger && npm install
   # or use yarn, pnpm, or bun
   ```
3. 🔑 **Configure environment variables:**
   - Add your Gemini API key, Firebase credentials, and any other required keys to `.env` in each app (see below).
4. ▶️ **Run the development servers:**
   ```sh
   cd tripmancer && npm run dev
   # In a new terminal:
   cd ../wanderledger && npm run dev
   ```
5. 🌐 **Open the apps:**
   - Visit [http://localhost:3000](http://localhost:3000) for each app

---

## 🔑 Environment Variables
Create a `.env` file in the root of each app directory:
```env
# For Tripmancer (Gemini AI)
GEMINI_API_KEY=your-gemini-api-key

# For WanderLedger (Firebase)
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
- 📝 **Prompt Tuning:** Edit `tripService.ts` for Gemini AI prompt engineering
- 🖌️ **UI/UX:** Tweak components in `src/components/` for your brand or workflow
- 💡 **Expense Logic:** Extend `src/contexts/TripContext.tsx` for custom splitting or analytics
- 🌍 **Localization:** Add more currencies or languages as needed
- 📊 **Analytics:** Integrate more charts or export formats for deeper insights

---

## 📄 License
MIT License. See [LICENSE](LICENSE) for details.

---

<p align="center">
  <b>🌟 wandertrip: Let AI and collaboration power your next adventure! 🌟</b><br/>
  <i>Made with ❤️ for Hack4Bengal 2025 — Gemini AI Track</i>
</p>
