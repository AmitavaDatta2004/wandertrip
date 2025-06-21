import makeGeminiRequest from '../api/geminiAPI';
import { TripData } from '../types/trip'; // Make sure this path is correct

export async function generateTripPlan(
  mood: string,
  description: string = "",
  days: number = 3,
  budget: string = "moderate",
  people: number = 1,
  location: string = ""
): Promise<TripData> {
  const locationInfo = location ? `in or near ${location}` : "";
  // Construct user input clearly stating all parameters
  const userInput = `Plan a ${days}-day ${mood} vacation ${locationInfo} for ${people} traveler(s) with a ${budget} budget. ${description ? `Specific requests: ${description}` : ''}`;

  console.log("Generating trip options with mood:", mood);
  console.log("Full request parameters:", {
    mood,
    description,
    days,
    budget,
    people,
    location,
    userInput
  });

  const prompt = `
    Based on the user's input: "${userInput}", create **three distinct personalized travel plan options**.
    Respond with JSON format only, no additional text, no markdown formatting, no backticks, in the following structure.
    Each destination within a trip option MUST include exact coordinates (latitude and longitude) and 3-5 points of interest nearby with their coordinates.
    For **each** of the three suggested trip options, provide a detailed **${days}-day itinerary** specific to that destination.

    {
      "suggestedTrips": [ // Array containing 3 distinct trip options
        {
          "destination": { // Details for the first destination option
            "name": "Destination Name 1",
            "description": "Detailed description of why this destination matches their mood (3-4 sentences)",
            "image": "A search query that would find a good representative image for Destination 1",
            "coordinates": { // Coordinates for the main destination area
              "lat": 12.3456,
              "lng": 78.9012
            },
            "pointsOfInterest": [ // 3-5 POIs for Destination 1
              {
                "name": "Point of Interest Name 1.1",
                "description": "Brief description of this location",
                "coordinates": { // Coordinates for POI 1.1
                  "lat": 12.3456,
                  "lng": 78.9012
                }
              },
              // ... more POIs for Destination 1
            ],
            "howToReach": "Transportation options for Destination 1",
            "accommodationOptions": ["Budget option 1", "Mid-range option 1", "Luxury option 1"],
            "localCuisine": ["Famous dish 1.1", "Famous dish 1.2", "Famous dish 1.3"],
            "bestTimeToVisit": "Best season information for Destination 1",
            "estimatedCosts": "Cost breakdown estimate for this Destination 1 trip option (consider budget: ${budget})"
          },
          "itinerary": [ // Itinerary SPECIFICALLY for Destination 1, covering ${days} days
            {
              "day": 1,
              "activities": ["Morning activity detail for Day 1 at Dest 1", "Afternoon activity detail for Day 1 at Dest 1", "Evening activity detail for Day 1 at Dest 1"],
              "meals": {
                "breakfast": "Breakfast recommendation for Day 1 at Dest 1",
                "lunch": "Lunch recommendation for Day 1 at Dest 1",
                "dinner": "Dinner recommendation for Day 1 at Dest 1"
              }
            },
            // ... (Repeat structure for Day 2, Day 3, ..., up to Day ${days} for Destination 1)
            {
              "day": ${days},
              "activities": ["Morning activity detail for Day ${days} at Dest 1", "Afternoon activity detail for Day ${days} at Dest 1", "Evening activity detail for Day ${days} at Dest 1"],
              "meals": {
                "breakfast": "Breakfast recommendation for Day ${days} at Dest 1",
                "lunch": "Lunch recommendation for Day ${days} at Dest 1",
                "dinner": "Dinner recommendation for Day ${days} at Dest 1"
              }
            }
          ]
        },
        { // Start of the second trip option
          "destination": {
             // ... (Details for Destination 2, same structure as above)
             "name": "Destination Name 2",
             "image": "A search query for Destination 2",
             "coordinates": { /* ... */ },
             "pointsOfInterest": [ /* ... */ ],
             // ... etc.
             "estimatedCosts": "Cost breakdown estimate for Destination 2 trip option (consider budget: ${budget})"
          },
          "itinerary": [ // Itinerary SPECIFICALLY for Destination 2, covering ${days} days
            {
              "day": 1,
               // ... (Activities/Meals for Day 1 at Dest 2)
            },
            // ... (Repeat structure for Day 2, Day 3, ..., up to Day ${days} for Destination 2)
            {
              "day": ${days},
              // ... (Activities/Meals for Day ${days} at Dest 2)
            }
          ]
        },
        { // Start of the third trip option
          "destination": {
             // ... (Details for Destination 3, same structure as above)
             "name": "Destination Name 3",
             "image": "A search query for Destination 3",
             "coordinates": { /* ... */ },
             "pointsOfInterest": [ /* ... */ ],
             // ... etc.
             "estimatedCosts": "Cost breakdown estimate for Destination 3 trip option (consider budget: ${budget})"
          },
          "itinerary": [ // Itinerary SPECIFICALLY for Destination 3, covering ${days} days
            {
              "day": 1,
               // ... (Activities/Meals for Day 1 at Dest 3)
            },
            // ... (Repeat structure for Day 2, Day 3, ..., up to Day ${days} for Destination 3)
            {
              "day": ${days},
              // ... (Activities/Meals for Day ${days} at Dest 3)
            }
          ]
        }
      ],
      // General information applicable potentially to any chosen trip
      "packingList": ["Essential item 1", "Essential item 2", /* ... (8-10 items total) */ "Item 8", "Item 9", "Item 10" ],
      "moodTitle": "A short title that encapsulates the mood (3-5 words)",
      "moodQuote": "A short inspirational quote related to the mood (1 sentence)",
      "travelTips": ["General practical tip 1", "General safety tip", "Cultural awareness tip", "Money-saving tip applicable generally"]
    }

    Provide **exactly three** distinct trip options that match the mood (${mood}).
    Ensure each itinerary spans exactly ${days} days and is detailed and tailored to its specific destination.
    Provide 8-10 packing items in the general list.
    Make sure all content is appropriate to the number of travelers (${people}) and the specified budget level (${budget}).
    Give very detailed, specific recommendations for each day's activities and meals within each itinerary.
    Ensure all coordinates (for main destination areas and points of interest) are provided accurately.
    Do not include any introductory or concluding text outside the JSON structure. Ensure the entire output is valid JSON.
  `;

  try {
    // Assuming makeGeminiRequest returns the parsed JSON object directly
    const tripDataResult = await makeGeminiRequest(prompt);
    console.log("Generated trip options data:", tripDataResult);

    // Basic validation (can be expanded)
    if (!tripDataResult || !Array.isArray(tripDataResult.suggestedTrips) || tripDataResult.suggestedTrips.length === 0) {
        throw new Error("Received invalid data structure from Gemini API.");
    }
     // Ensure the returned type matches the expected TripData structure
    return tripDataResult as TripData;
  } catch (error) {
    console.error('Error generating trip plan options:', error);
    // Consider more specific error handling or fallback mechanisms
    throw new Error(`Failed to generate trip plan options: ${error instanceof Error ? error.message : String(error)}`);
  }
}