# ✨ Tripmancer: Gemini AI-Powered Mood-Based Trip Suggestion ✨

🚀 *Project submission for Hack4Bengal — Showcasing the power of Google Gemini AI for personalized travel planning* 🚀

Tripmancer is an innovative web application built for Hack4Bengal, designed to help users discover and plan trips that match their mood and preferences. At its core, Tripmancer leverages Google Gemini AI to generate unique, detailed itineraries and travel suggestions, making every journey truly personal.

---

## 🗂️ Table of Contents
- [🌏 Overview](#overview)
- [🎉 Hack4Bengal & Gemini AI](#hack4bengal--gemini-ai)
- [⚙️ How It Works](#how-it-works)
- [🤖 Gemini AI Integration](#gemini-ai-integration)
- [🌟 Features](#features)
- [🧭 User Flow](#user-flow)
- [📁 Project Structure](#project-structure)
- [🛠️ Setup & Installation](#setup--installation)
- [🔑 Environment Variables](#environment-variables)
- [🎨 Customization](#customization)
- [📄 License](#license)

---

## 🌏 Overview
Tripmancer is a mood-driven travel planner. Users simply describe how they feel—adventurous, relaxed, romantic, or spontaneous—and Tripmancer, powered by Gemini AI, suggests three distinct trips tailored to their mood, budget, and preferences. Each suggestion includes:
- 🗓️ Day-by-day itineraries
- 📍 Points of interest, 🍜 local cuisine, and 💡 travel tips
- 🎒 Packing lists and 💸 budget estimates

## 🎉 Hack4Bengal & Gemini AI
This project was created for the Hack4Bengal hackathon to demonstrate the real-world impact of generative AI in travel and lifestyle applications. By integrating Google Gemini AI, Tripmancer showcases how advanced LLMs can:
- 🧠 Understand nuanced user moods and preferences
- 🏗️ Generate structured, actionable travel plans
- ✨ Enhance user experience with creativity and personalization

## ⚙️ How It Works
1. 📝 **User Input:** The user describes their mood, trip duration, group size, budget, location, and any special requests.
2. 🤖 **AI Prompting:** The app constructs a detailed prompt and sends it to Gemini AI via a secure API call.
3. 🎁 **AI Response:** Gemini returns three unique trip options, each with:
   - 🏝️ Destination details (name, description, coordinates, image query)
   - 📌 3-5 points of interest (with coordinates)
   - 📅 A detailed itinerary for each day (activities, meals)
   - 🏨 Accommodation, 🍲 cuisine, 🕰️ best time to visit, and 💰 estimated costs
   - 🎒 Packing list, 📝 mood quote, and 💡 travel tips
4. 🖥️ **Display:** The app presents the options in a rich, interactive UI, allowing users to explore, save, or export their favorite plans.

## 🤖 Gemini AI Integration
- 🔗 **API:** Integration is handled in `src/lib/api/geminiAPI.ts` and `geminiConfig.ts`.
- 🧑‍💻 **Prompt Engineering:** Prompts are crafted in `src/lib/services/tripService.ts` to maximize the quality and relevance of AI-generated trips.
- 🛡️ **Error Handling:** The app retries on transient errors and parses the AI's JSON response, surfacing any issues to the user.
- 🗂️ **Structured Output:** Gemini is instructed to return strict JSON, which is parsed and rendered in the UI.

## 🌟 Features
- 🧘 Mood-based trip generation using Gemini AI
- 🛠️ Customizable trip parameters (mood, days, budget, group size, location, time)
- 🧳 Three unique trip suggestions per request
- 🗺️ Detailed daily itineraries and activities
- 📍 Points of interest with maps
- 🎒 Packing list, travel tips, and mood quotes
- 💸 Budget estimation and currency selection
- 💾 Save, 📄 export, and 📤 share trip plans
- 🖌️ Responsive, modern UI (React + Tailwind CSS)

## 🧭 User Flow
1. 🏠 **Home:** User selects "Start Planning Now"
2. 🎛️ **Customization:** User sets mood, duration, group size, budget, location, and special requests
3. ✨ **Trip Generation:** User submits the form; Gemini AI generates trip options
4. 🗂️ **Results:** User browses suggested trips, views itineraries, maps, packing lists, and tips
5. 📝 **Actions:** User can save, export to PDF, or start a new search

## 📁 Project Structure (Key Files)
- `src/pages/GenerateTrip.tsx` — Main trip generation form and logic
- `src/lib/services/tripService.ts` — Constructs AI prompts and handles Gemini API calls
- `src/lib/api/geminiAPI.ts` — Handles Gemini API requests and error handling
- `src/lib/types/trip.ts` — Type definitions for trip data
- `src/pages/Results.tsx` — Displays AI-generated trip suggestions and details
- `src/components/home/CustomizationSection.tsx` — UI for customizing trip parameters

## 🛠️ Setup & Installation
1. 📥 **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/tripmancer.git
   cd tripmancer
   ```
2. 📦 **Install dependencies:**
   ```sh
   npm install
   # or yarn, pnpm, bun
   ```
3. 🔑 **Configure environment variables:**
   - Add your Gemini API key and any other required keys to `.env` (see below).
4. ▶️ **Run the development server:**
   ```sh
   npm run dev
   ```
5. 🌐 **Open the app:**
   - Visit [http://localhost:3000](http://localhost:3000)

## 🔑 Environment Variables
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your-gemini-api-key
```

## 🎨 Customization
- 📝 **Prompt Tuning:** Edit `tripService.ts` to adjust how prompts are constructed for Gemini.
- 🎨 **UI/UX:** Modify components in `src/components/` for branding or feature changes.
- 🗃️ **Trip Data Types:** Update `src/lib/types/trip.ts` to extend or refine trip data structures.

## 📄 License
MIT License. See [LICENSE](LICENSE) for details.

---

🌈 **Tripmancer: Let your mood guide your next adventure!** 🌈
