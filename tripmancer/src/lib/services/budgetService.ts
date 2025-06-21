
import makeGeminiRequest from '../api/geminiAPI';

export async function fetchBudgetEstimate(destination: string, budget: string = 'moderate', days: number = 7) {
  console.log(`Fetching budget estimates for ${destination} with ${budget} budget for ${days} days`);
  
  const budgetPrompt = `Generate a detailed travel budget estimate for ${destination} with a ${budget} budget level for ${days} days. Format the response as a JSON object with the following structure:
  {
    "summary": "Brief overview of the budget for this destination",
    "accommodation": {
      "average": 120,
      "options": [
        {"type": "Budget hostel", "costPerNight": 30},
        {"type": "Mid-range hotel", "costPerNight": 120},
        {"type": "Luxury resort", "costPerNight": 300}
      ]
    },
    "food": {
      "average": 40,
      "options": [
        {"type": "Street food/Self-catering", "costPerDay": 15},
        {"type": "Mid-range restaurants", "costPerDay": 40},
        {"type": "Fine dining", "costPerDay": 100}
      ]
    },
    "transportation": {
      "average": 20,
      "options": [
        {"type": "Public transport", "costPerDay": 10},
        {"type": "Occasional taxis", "costPerDay": 25},
        {"type": "Car rental", "costPerDay": 50}
      ]
    },
    "activities": {
      "average": 30,
      "examples": [
        {"name": "Museum entry", "cost": 15},
        {"name": "Guided tour", "cost": 30},
        {"name": "Special experience", "cost": 70}
      ]
    },
    "totalEstimate": {
      "low": 500,
      "average": 1000,
      "high": 2000
    }
  }`;
  
  try {
    const budgetData = await makeGeminiRequest(budgetPrompt);
    console.log("Received budget data:", budgetData);
    return budgetData;
  } catch (error) {
    console.error('Error fetching budget data:', error);
    
    // Return fallback data
    return {
      summary: `Budget estimate for ${destination} (${budget} level)`,
      accommodation: {
        average: 100,
        options: [
          {type: "Budget hostel/guesthouse", costPerNight: 40},
          {type: "Mid-range hotel", costPerNight: 100},
          {type: "Luxury accommodation", costPerNight: 250}
        ]
      },
      food: {
        average: 30,
        options: [
          {type: "Self-catering/Street food", costPerDay: 15},
          {type: "Mid-range restaurants", costPerDay: 35},
          {type: "Fine dining", costPerDay: 80}
        ]
      },
      transportation: {
        average: 15,
        options: [
          {type: "Public transportation", costPerDay: 8},
          {type: "Occasional taxis/ride-shares", costPerDay: 20},
          {type: "Car rental", costPerDay: 40}
        ]
      },
      activities: {
        average: 25,
        examples: [
          {name: "Museum/attraction entry", cost: 15},
          {name: "Guided tour", cost: 30},
          {name: "Special experience", cost: 60}
        ]
      },
      totalEstimate: {
        low: days * 100,
        average: days * 170,
        high: days * 350
      }
    };
  }
}
