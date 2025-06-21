
import makeGeminiRequest from '../api/geminiAPI';
import { TripData } from '../types/trip';

export async function generateTripPlan(
  mood: string,
  description: string = "",
  days: number = 3,
  budget: string = "moderate",
  people: number = 1,
  location: string = "",
  currency: string = "USD",
  timeOfVisit: string = "now"
): Promise<TripData> {
  const locationInfo = location ? `starting from ${location}` : "";
  const timeInfo = getTimeOfVisitDescription(timeOfVisit);
  const currencySymbol = getCurrencySymbol(currency);
  
  // Construct user input clearly stating all parameters
  const userInput = `Plan a ${days}-day ${mood} vacation ${locationInfo} for ${people} traveler(s) with a ${budget} budget in ${currency}. Travel timing: ${timeInfo}. ${description ? `Specific requests: ${description}` : ''}`;

  console.log("Generating trip options with enhanced parameters:", {
    mood,
    description,
    days,
    budget,
    people,
    location,
    currency,
    timeOfVisit,
    userInput
  });

  const prompt = `
    Based on the user's input: "${userInput}", create **three distinct personalized travel plan options**.
    
    IMPORTANT CONSIDERATIONS:
    - Starting location: ${location || "No specific starting location - suggest global destinations"}
    - Travel timing: ${timeInfo} - Consider seasonal weather, local events, pricing, and crowd levels
    - Currency: All prices must be in ${currency} (${currencySymbol})
    - If starting location is provided, consider travel distances and transportation options
    
    Respond with JSON format only, no additional text, no markdown formatting, no backticks, in the following structure.
    Each destination within a trip option MUST include exact coordinates (latitude and longitude) and 3-5 points of interest nearby with their coordinates.
    For **each** of the three suggested trip options, provide a detailed **${days}-day itinerary** with 4-6 activities per day.

    {
      "suggestedTrips": [ // Array containing 3 distinct trip options
        {
          "destination": { // Details for the first destination option
            "name": "Destination Name 1",
            "description": "Detailed description of why this destination matches their mood and is perfect for ${timeInfo} (4-5 sentences)",
            "image": "A search query that would find a good representative image for Destination 1",
            "coordinates": { // Coordinates for the main destination area
              "lat": 12.3456,
              "lng": 78.9012
            },
            "pointsOfInterest": [ // 3-5 POIs for Destination 1
              {
                "name": "Point of Interest Name 1.1",
                "description": "Brief description of this location and why it's special",
                "coordinates": { // Coordinates for POI 1.1
                  "lat": 12.3456,
                  "lng": 78.9012
                }
              }
              // ... more POIs for Destination 1
            ],
            "howToReach": "${location ? `Transportation options from ${location} to this destination, including estimated travel time and costs` : 'Transportation options to reach this destination'}",
            "accommodationOptions": ["Budget option with ${currencySymbol} price range", "Mid-range option with ${currencySymbol} price range", "Luxury option with ${currencySymbol} price range"],
            "localCuisine": ["Famous dish 1.1", "Famous dish 1.2", "Famous dish 1.3", "Famous dish 1.4"],
            "bestTimeToVisit": "Best season information considering the requested travel time of ${timeInfo}",
            "estimatedCosts": "Detailed cost breakdown in ${currency} for ${days} days, ${people} people: Transportation ${currencySymbol}X, Accommodation ${currencySymbol}X per night, Food ${currencySymbol}X per day, Activities ${currencySymbol}X total, Total estimate: ${currencySymbol}X-${currencySymbol}Y"
          },
          "itinerary": [ // Itinerary SPECIFICALLY for Destination 1, covering ${days} days
            {
              "day": 1,
              "activities": [
                "9:00 AM - Detailed morning activity with specific location and duration",
                "11:30 AM - Mid-morning activity or exploration with specific details",
                "2:00 PM - Afternoon main attraction visit with details",
                "4:30 PM - Late afternoon cultural or leisure activity",
                "6:00 PM - Sunset viewing or evening exploration activity",
                "8:00 PM - Evening entertainment or nightlife recommendation"
              ],
              "meals": {
                "breakfast": "Specific restaurant/cafe recommendation with signature dish and approximate cost in ${currencySymbol}",
                "lunch": "Detailed lunch recommendation with local specialty and cost in ${currencySymbol}",
                "dinner": "Evening dining suggestion with atmosphere description and budget in ${currencySymbol}"
              }
            }
            // ... (Repeat structure for Day 2, Day 3, ..., up to Day ${days} for Destination 1)
          ]
        }
        // ... (Similar structure for destinations 2 and 3)
      ],
      // General information applicable potentially to any chosen trip
      "packingList": [
        "Essential item 1 for ${timeInfo} weather",
        "Essential item 2 for the activities planned",
        "Essential item 3 for the climate/season",
        "Essential item 4 for local customs",
        "Essential item 5 for transportation",
        "Essential item 6 for photography/memories",
        "Essential item 7 for health/safety",
        "Essential item 8 for comfort",
        "Essential item 9 for local experiences",
        "Essential item 10 for emergencies"
      ],
      "moodTitle": "A short title that encapsulates the mood (3-5 words)",
      "moodQuote": "A short inspirational quote related to the mood and travel timing (1 sentence)",
      "travelTips": [
        "Tip specific to traveling ${timeInfo} and weather conditions",
        "Currency exchange and payment tip for ${currency}",
        "Cultural awareness tip for the suggested regions",
        "Money-saving tip applicable to ${budget} budget",
        "Safety tip for ${people} traveler(s)",
        "Timing-specific tip for ${timeInfo} travel"
      ]
    }

    Provide **exactly three** distinct trip options that match the mood (${mood}) and are optimal for ${timeInfo}.
    Each day's itinerary should have 4-6 detailed, time-specific activities.
    All prices must be in ${currency} with ${currencySymbol} symbol.
    Consider seasonal factors, weather, local events, and crowd levels for ${timeInfo}.
    ${location ? `Factor in travel distance and transportation from ${location}.` : ''}
    Make sure all content is appropriate to the number of travelers (${people}) and the specified budget level (${budget}).
    Give very detailed, specific recommendations with times for each day's activities and meals.
    Ensure all coordinates (for main destination areas and points of interest) are provided accurately.
    Do not include any introductory or concluding text outside the JSON structure. Ensure the entire output is valid JSON.
  `;

  try {
    const tripDataResult = await makeGeminiRequest(prompt);
    console.log("Generated enhanced trip options data:", tripDataResult);

    // Basic validation
    if (!tripDataResult || !Array.isArray(tripDataResult.suggestedTrips) || tripDataResult.suggestedTrips.length === 0) {
        throw new Error("Received invalid data structure from Gemini API.");
    }
     
    return tripDataResult as TripData;
  } catch (error) {
    console.error('Error generating trip plan options:', error);
    throw new Error(`Failed to generate trip plan options: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function getTimeOfVisitDescription(timeOfVisit: string): string {
  const timeMap: Record<string, string> = {
    'now': 'traveling immediately/this week',
    '1week': 'traveling in 1 week',
    '2weeks': 'traveling in 2 weeks', 
    '1month': 'traveling in 1 month',
    '2months': 'traveling in 2 months',
    '3months': 'traveling in 3 months',
    '6months': 'traveling in 6 months',
    '1year': 'traveling in 1 year'
  };
  
  return timeMap[timeOfVisit] || 'traveling at an unspecified time';
}

function getCurrencySymbol(currency: string): string {
  const currencySymbols: Record<string, string> = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
    'INR': '₹',
    'CAD': '$',
    'AUD': '$',
    'CHF': 'Fr'
  };
  
  return currencySymbols[currency] || '$';
}
