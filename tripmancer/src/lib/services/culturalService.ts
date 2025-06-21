
import makeGeminiRequest from '../api/geminiAPI';

export async function fetchDestinationCulturalInfo(destinationName: string) {
  console.log("Fetching cultural info for destination:", destinationName);
  
  const culturalPrompt = `Generate cultural information about ${destinationName} in JSON format with the following structure:
  {
    "phrases": [
      { "phrase": "Local phrase 1", "meaning": "Translation/meaning" },
      { "phrase": "Local phrase 2", "meaning": "Translation/meaning" },
      { "phrase": "Local phrase 3", "meaning": "Translation/meaning" },
      { "phrase": "Local phrase 4", "meaning": "Translation/meaning" },
      { "phrase": "Local phrase 5", "meaning": "Translation/meaning" }
    ],
    "etiquette": [
      "Etiquette tip 1",
      "Etiquette tip 2",
      "Etiquette tip 3",
      "Etiquette tip 4",
      "Etiquette tip 5"
    ],
    "cuisine": [
      "Must-try food 1",
      "Must-try food 2",
      "Must-try food 3",
      "Must-try food 4",
      "Must-try food 5"
    ]
  }`;
  
  try {
    const culturalData = await makeGeminiRequest(culturalPrompt);
    console.log("Parsed cultural data:", culturalData);
    return culturalData;
  } catch (error) {
    console.error('Error generating cultural info:', error);
    return {
      phrases: [
        { phrase: "Hello", meaning: "A universal greeting" },
        { phrase: "Thank you", meaning: "Express gratitude" },
        { phrase: "Please", meaning: "Make a polite request" },
        { phrase: "Excuse me", meaning: "Get attention politely" },
        { phrase: "Yes/No", meaning: "Basic affirmation/negation" }
      ],
      etiquette: [
        "Research the dress code requirements for religious sites",
        "Learn about the local customs regarding personal space",
        "Understand tipping customs before you go",
        "Know the local table manners",
        "Learn appropriate greeting gestures"
      ],
      cuisine: [
        "Try the local street food (from reputable vendors)",
        "Visit a local market for fresh produce",
        "Ask locals for restaurant recommendations",
        "Try the national dish",
        "Be adventurous but aware of your dietary restrictions"
      ]
    };
  }
}
