
import makeGeminiRequest from '../api/geminiAPI';

export async function fetchBudgetEstimate(
  destination: string, 
  budget: string = 'moderate', 
  days: number = 7,
  currency: string = 'USD',
  timeOfVisit: string = 'now'
) {
  console.log(`Fetching budget estimates for ${destination} with ${budget} budget for ${days} days in ${currency}, traveling ${timeOfVisit}`);
  
  const currencySymbol = getCurrencySymbol(currency);
  const timeInfo = getTimeOfVisitDescription(timeOfVisit);
  const seasonalNote = getSeasonalPricing(timeOfVisit);
  
  const budgetPrompt = `Generate a detailed travel budget estimate for ${destination} with a ${budget} budget level for ${days} days in ${currency} currency. 
  
  Travel timing: ${timeInfo}
  ${seasonalNote}
  
  Consider current exchange rates and local pricing. Format the response as a JSON object with the following structure:
  {
    "summary": "Brief overview of the budget for ${destination} considering ${timeInfo} and seasonal factors",
    "accommodation": {
      "average": 120,
      "options": [
        {"type": "Budget hostel/guesthouse", "costPerNight": 30},
        {"type": "Mid-range hotel", "costPerNight": 120},
        {"type": "Luxury resort/hotel", "costPerNight": 300}
      ]
    },
    "food": {
      "average": 40,
      "options": [
        {"type": "Street food/Local eateries", "costPerDay": 15},
        {"type": "Mid-range restaurants", "costPerDay": 40},
        {"type": "Fine dining/Upscale venues", "costPerDay": 100}
      ]
    },
    "transportation": {
      "average": 20,
      "options": [
        {"type": "Public transport/Walking", "costPerDay": 10},
        {"type": "Taxis/Ride-sharing", "costPerDay": 25},
        {"type": "Car rental/Private transport", "costPerDay": 50}
      ]
    },
    "activities": {
      "average": 30,
      "examples": [
        {"name": "Free walking tours/Parks", "cost": 0},
        {"name": "Museum entries/Cultural sites", "cost": 15},
        {"name": "Guided tours/Experiences", "cost": 40},
        {"name": "Adventure activities/Special experiences", "cost": 80}
      ]
    },
    "totalEstimate": {
      "low": 500,
      "average": 1000,
      "high": 2000
    },
    "seasonalFact": "Note about pricing during ${timeInfo}",
    "currencyNotes": "Exchange rate considerations and local payment methods"
  }
  
  All amounts must be in ${currency} (${currencySymbol}). Consider seasonal price variations, local economic conditions, and current exchange rates.`;
  
  try {
    const budgetData = await makeGeminiRequest(budgetPrompt);
    console.log("Received enhanced budget data:", budgetData);
    return budgetData;
  } catch (error) {
    console.error('Error fetching budget data:', error);
    
    // Return enhanced fallback data
    const baseRates = getBaseCurrencyRates(currency);
    
    return {
      summary: `Budget estimate for ${destination} (${budget} level) in ${currency} considering ${timeInfo}`,
      accommodation: {
        average: Math.round(100 * baseRates.multiplier),
        options: [
          {type: "Budget hostel/guesthouse", costPerNight: Math.round(40 * baseRates.multiplier)},
          {type: "Mid-range hotel", costPerNight: Math.round(100 * baseRates.multiplier)},
          {type: "Luxury accommodation", costPerNight: Math.round(250 * baseRates.multiplier)}
        ]
      },
      food: {
        average: Math.round(30 * baseRates.multiplier),
        options: [
          {type: "Street food/Local eateries", costPerDay: Math.round(15 * baseRates.multiplier)},
          {type: "Mid-range restaurants", costPerDay: Math.round(35 * baseRates.multiplier)},
          {type: "Fine dining", costPerDay: Math.round(80 * baseRates.multiplier)}
        ]
      },
      transportation: {
        average: Math.round(15 * baseRates.multiplier),
        options: [
          {type: "Public transportation", costPerDay: Math.round(8 * baseRates.multiplier)},
          {type: "Taxis/Ride-sharing", costPerDay: Math.round(20 * baseRates.multiplier)},
          {type: "Car rental", costPerDay: Math.round(40 * baseRates.multiplier)}
        ]
      },
      activities: {
        average: Math.round(25 * baseRates.multiplier),
        examples: [
          {name: "Free attractions/Parks", cost: 0},
          {name: "Museum/attraction entry", cost: Math.round(15 * baseRates.multiplier)},
          {name: "Guided tour", cost: Math.round(30 * baseRates.multiplier)},
          {name: "Special experience", cost: Math.round(60 * baseRates.multiplier)}
        ]
      },
      totalEstimate: {
        low: Math.round(days * 100 * baseRates.multiplier),
        average: Math.round(days * 170 * baseRates.multiplier),
        high: Math.round(days * 350 * baseRates.multiplier)
      },
      seasonalFact: getSeasonalNote(timeOfVisit),
      currencyNotes: `Prices shown in ${currency} (${currencySymbol}). ${baseRates.note}`
    };
  }
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

function getTimeOfVisitDescription(timeOfVisit: string): string {
  const timeMap: Record<string, string> = {
    'now': 'traveling immediately',
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

function getSeasonalPricing(timeOfVisit: string): string {
  if (timeOfVisit === 'now' || timeOfVisit === '1week' || timeOfVisit === '2weeks') {
    return "Consider current season pricing and availability.";
  } else if (timeOfVisit === '6months' || timeOfVisit === '1year') {
    return "Consider seasonal price variations and peak/off-peak periods.";
  }
  return "Factor in upcoming seasonal pricing changes.";
}

function getSeasonalNote(timeOfVisit: string): string {
  const seasonalNotes: Record<string, string> = {
    'now': 'Current season pricing applies. Book soon for better rates.',
    '1week': 'Last-minute pricing may apply. Limited availability expected.',
    '2weeks': 'Short-term pricing. Some advance booking discounts available.',
    '1month': 'Good balance of planning time and pricing.',
    '2months': 'Advance booking discounts typically available.',
    '3months': 'Seasonal pricing patterns should be considered.',
    '6months': 'Significant seasonal price variations possible.',
    '1year': 'Plan around peak and off-peak seasons for best value.'
  };
  
  return seasonalNotes[timeOfVisit] || 'Consider seasonal pricing variations.';
}

function getBaseCurrencyRates(currency: string): { multiplier: number; note: string } {
  // Rough conversion multipliers for fallback (should be updated with real rates)
  const rates: Record<string, { multiplier: number; note: string }> = {
    'USD': { multiplier: 1, note: 'Base currency for calculations.' },
    'EUR': { multiplier: 0.85, note: 'Converted from USD at approximate rate.' },
    'GBP': { multiplier: 0.75, note: 'Converted from USD at approximate rate.' },
    'JPY': { multiplier: 110, note: 'Converted from USD at approximate rate.' },
    'INR': { multiplier: 75, note: 'Converted from USD at approximate rate.' },
    'CAD': { multiplier: 1.25, note: 'Converted from USD at approximate rate.' },
    'AUD': { multiplier: 1.35, note: 'Converted from USD at approximate rate.' },
    'CHF': { multiplier: 0.92, note: 'Converted from USD at approximate rate.' }
  };
  
  return rates[currency] || rates['USD'];
}
