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
- [❓ The Problem It Solves](#-the-problem-it-solves)
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

## ❓ The Problem It Solves
Traveling with friends, family, or even solo can be stressful when it comes to planning and managing expenses. Traditional methods—like spreadsheets, group chats, or manual calculations—are error-prone, time-consuming, and often lead to confusion or disputes.

**wandertrip** solves these problems by:
- 🧠 Using Gemini AI to generate personalized, mood-based trip plans, saving hours of research and making travel more accessible and exciting for everyone.
- 🤝 Making group expense management seamless, transparent, and fair—no more awkward money talk or lost receipts!
- 📊 Providing real-time analytics and summaries so everyone knows exactly who owes what, and how much has been spent.
- 🌐 Enabling multi-user collaboration, so all group members can add, edit, and track expenses from any device, anywhere.
- 🔒 Ensuring data security and privacy with cloud storage and secure authentication.

### What Can People Use It For?
- Plan the perfect trip based on your mood, interests, and budget—instantly!
- Effortlessly split and track expenses with friends, family, or colleagues on group trips.
- Keep all travel plans, itineraries, and expenses organized in one place.
- Export reports for reimbursement, accounting, or just to remember your adventures.
- Avoid misunderstandings and disputes about money—settle up with a tap!

### How Does It Make Life Easier & Safer?
- **No more manual calculations:** Automatic splitting and real-time updates keep everyone on the same page.
- **No more lost receipts:** Attach photos and notes to every expense.
- **No more confusion:** Visual summaries and smart notifications ensure clarity for all group members.
- **No more privacy worries:** All data is securely stored and only accessible to authorized users.

---

## ✨ More About Tripmancer
**Tripmancer** is your personal AI-powered travel designer, built to make trip planning effortless, inspiring, and truly personalized. Powered by Google Gemini AI, Tripmancer takes your mood, preferences, and constraints, and transforms them into actionable, exciting travel plans.

### 🧠 How Tripmancer Works
- **Mood-Based Planning:** Just tell Tripmancer how you feel—adventurous, relaxed, romantic, spontaneous, or anything else. The AI understands your vibe and finds destinations that match.
- **Smart Prompting:** Tripmancer crafts a detailed prompt for Gemini AI, including your mood, group size, budget, location, and special requests.
- **AI-Generated Itineraries:** Gemini AI returns three unique, detailed trip options. Each includes:
  - 🏝️ Destination details (name, description, coordinates, image query)
  - 📌 3-5 points of interest (with coordinates)
  - 📅 Day-by-day itineraries (activities, meals, local experiences)
  - 🏨 Accommodation, 🍲 cuisine, 🕰️ best time to visit, 💰 estimated costs
  - 🎒 Packing list, 📝 mood quote, 💡 travel tips
- **Interactive Exploration:** Users can browse, compare, and save their favorite plans, view maps, and export itineraries for easy sharing or offline use.

### 🌍 Why Tripmancer is Special
- **Personalization at Scale:** No two users get the same trip. Every plan is tailored to your mood, needs, and context.
- **Saves Time & Reduces Stress:** No more endless searching or decision fatigue. Tripmancer does the research and curation for you.
- **Inspires New Adventures:** Discover places and experiences you might never have considered, all matched to your current vibe.
- **Accessible to All:** Whether you’re a solo traveler, a couple, or a group, Tripmancer adapts to your situation and makes planning inclusive and fun.

### 🛠️ Key Technologies
- **Google Gemini AI:** For natural language understanding and creative itinerary generation.
- **React & Tailwind CSS:** For a fast, beautiful, and responsive user interface.
- **TypeScript:** For robust, maintainable code.

### 🚀 Example Use Cases
- "I feel adventurous and want a 5-day trip with friends on a moderate budget."
- "We’re a couple looking for a romantic weekend getaway, departing from Kolkata."
- "I want a relaxing solo trip with great food and local culture."

Tripmancer turns these wishes into reality—instantly, beautifully, and with all the details you need to just pack and go!

---

## 💸 More About WanderLedger
**WanderLedger** is your ultimate travel expense companion, designed to make group trips financially stress-free, transparent, and fair. Whether you’re traveling with friends, family, or colleagues, WanderLedger ensures that everyone can focus on making memories—not managing money.

### 🏦 How WanderLedger Works
- **Effortless Expense Logging:** Add, edit, and delete expenses in seconds. Categorize each expense (food, transport, lodging, activities, etc.) and attach notes or receipts for clarity.
- **Multi-User Collaboration:** Invite your travel companions to join your trip. Everyone can add and track expenses, and all changes sync in real time.
- **Smart Splitting:** Assign expenses to individuals, split equally, by percentage, or by custom shares. WanderLedger automatically calculates who owes what.
- **Instant Settling:** See a clear summary of balances and settle up with a tap. No more awkward conversations or confusion about who paid for what!
- **Analytics & Reports:** Visualize spending by category, person, or day. Export detailed reports as PDF or CSV for reimbursement, accounting, or memories.
- **Cloud Sync & Security:** All data is securely stored in the cloud (Firebase/Firestore) and accessible from any device. Authentication ensures only authorized users can access trip data.

### 🌟 Why WanderLedger is Special
- **No More Money Drama:** Transparent, real-time updates keep everyone on the same page and eliminate disputes.
- **Perfect for Any Group:** Works for friends, families, work trips, or even solo travelers who want to track their own spending.
- **Beautiful, Modern UI:** Responsive design with Tailwind CSS, dark mode, and intuitive navigation.
- **Multi-Currency Support:** Track expenses in any currency, with automatic conversion for global trips.
- **Privacy & Security:** Your financial data is encrypted and only accessible to you and your group.

### 🛠️ Key Technologies
- **Firebase Auth & Firestore:** For secure authentication, cloud storage, and real-time sync.
- **React & Tailwind CSS:** For a fast, beautiful, and responsive user interface.
- **TypeScript:** For robust, maintainable code.

### 🚀 Example Use Cases
- "We’re a group of 6 friends backpacking across Europe—WanderLedger keeps our expenses fair and organized."
- "Family vacation? No more confusion about who paid for dinner or the hotel."
- "Business trip with colleagues—export a report for easy reimbursement."

WanderLedger makes group travel easy, fair, and fun—so you can focus on the journey, not the math!

---

## 📄 License
MIT License. See [LICENSE](LICENSE) for details.

---

<p align="center">
  <b>🌟 wandertrip: Let AI and collaboration power your next adventure! 🌟</b><br/>
  <i>Made with ❤️ for Hack4Bengal 2025 — Gemini AI Track</i>
</p>
