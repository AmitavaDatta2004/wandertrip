
// types/trip.ts

// Define the structure for a single Point of Interest
type PointOfInterest = {
  name: string;
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
};

// Define the structure for Coordinates
type Coordinates = {
  lat: number;
  lng: number;
};

// Define the structure for Daily Meals
type DailyMeals = {
  breakfast: string;
  lunch: string;
  dinner: string;
};

// Define the structure for a single day in the itinerary
type ItineraryDay = {
  day: number;
  activities: string[]; // Array of detailed activity descriptions for the day
  meals: DailyMeals;
};

// Define the structure for Destination details
export type DestinationDetails = {
  name: string;
  description: string; // Why it matches the mood
  image: string; // Search query for an image
  coordinates: Coordinates; // Main coordinates for the destination
  pointsOfInterest: PointOfInterest[]; // Array of POIs
  howToReach: string;
  accommodationOptions: string[]; // Budget, Mid-range, Luxury suggestions
  localCuisine: string[]; // Famous local dishes
  bestTimeToVisit: string;
  estimatedCosts: string; // Cost breakdown specific to this option
};

// Define the structure for a single suggested trip option
export type SuggestedTrip = {
  destination: DestinationDetails;
  itinerary: ItineraryDay[]; // Itinerary specific to this destination
};

// Define the main TripData structure returned by the API call
export type TripData = {
  suggestedTrips: SuggestedTrip[]; // Array of 3 distinct trip suggestions
  packingList: string[]; // General packing list (8-10 items)
  moodTitle: string; // Title reflecting the mood
  moodQuote: string; // Quote reflecting the mood
  travelTips: string[]; // General travel tips
  budget?: { // Optional: Could be added by Gemini if requested/possible
    accommodation: number;
    food: number;
    activities: number;
    transportation: number;
  };
  culturalInfo?: { // Optional: Could be added by Gemini if requested/possible
    phrases: Array<{ phrase: string; meaning: string }>;
    etiquette: string[];
    cuisine: string[]; // Could potentially overlap with localCuisine per destination
  };
};

// --- Other existing types ---

export type NewsItem = {
  title: string;
  description: string;
  url: string;
  source: string;
  category?: string;
};

export type JournalEntry = {
  id?: string;
  date: string;
  content: string;
  mood: string;
  photos?: string[];
  location?: string;
  isPrivate: boolean;
};
