
import makeGeminiRequest from '../api/geminiAPI';
import { NewsItem } from '../types/trip';

export interface WeatherData {
  current: {
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    icon: string;
  };
  forecast: {
    temperature: number;
    condition: string;
    icon: string;
  };
}

export async function fetchDestinationNews(destinationName: string): Promise<NewsItem[]> {
  console.log("Fetching news for destination:", destinationName);
  
  const newsPrompt = `Generate 4 recent and relevant news articles about ${destinationName} focusing on tourism, travel updates, local events, cultural happenings, and travel advisories. Format in JSON with the following structure for each article:
  {
    "title": "Engaging article title related to travel/tourism",
    "description": "Brief description focusing on how this affects travelers and tourists (2-3 sentences)",
    "url": "#",
    "source": "Credible news source name",
    "category": "one of: tourism, events, weather, culture, travel-advisory"
  }
  
  Make the news relevant to travelers and include diverse categories.`;
  
  try {
    const newsData = await makeGeminiRequest(newsPrompt);
    let parsedNews = Array.isArray(newsData) ? newsData : [newsData];
    console.log("Parsed news data:", parsedNews);
    return parsedNews;
  } catch (error) {
    console.error('Error generating news:', error);
    return [
      {
        title: `Tourism Updates from ${destinationName}`,
        description: "Stay updated with the latest travel information and tourist attractions.",
        url: "#",
        source: "Travel News",
        category: "tourism"
      },
      {
        title: `Cultural Events in ${destinationName}`,
        description: "Discover upcoming festivals and cultural celebrations during your visit.",
        url: "#",
        source: "Culture Today",
        category: "events"
      }
    ];
  }
}

export async function fetchDestinationWeather(destinationName: string, travelTime: string = 'now'): Promise<WeatherData> {
  console.log("Fetching weather for destination:", destinationName, "travel time:", travelTime);
  
  const weatherPrompt = `Provide current weather and forecast information for ${destinationName} considering travel time: ${travelTime}. 
  
  Format as JSON:
  {
    "current": {
      "temperature": 25,
      "condition": "Sunny",
      "humidity": 65,
      "windSpeed": 12,
      "icon": "sun"
    },
    "forecast": {
      "temperature": 23,
      "condition": "Partly Cloudy", 
      "icon": "cloud-sun"
    }
  }
  
  Use realistic weather data and appropriate weather condition names. Icons should be one of: sun, cloud, cloud-rain, cloud-snow, wind, thermometer`;
  
  try {
    const weatherData = await makeGeminiRequest(weatherPrompt);
    console.log("Received weather data:", weatherData);
    return weatherData;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return {
      current: {
        temperature: 22,
        condition: "Pleasant",
        humidity: 60,
        windSpeed: 8,
        icon: "sun"
      },
      forecast: {
        temperature: 20,
        condition: "Mild",
        icon: "cloud-sun"
      }
    };
  }
}
