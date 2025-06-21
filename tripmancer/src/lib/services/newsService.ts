
import makeGeminiRequest from '../api/geminiAPI';
import { NewsItem } from '../types/trip';

export async function fetchDestinationNews(destinationName: string): Promise<NewsItem[]> {
  console.log("Fetching news for destination:", destinationName);
  
  const newsPrompt = `Generate 3 recent news articles about ${destinationName} in JSON format with the following structure for each article:
  {
    "title": "Article title",
    "description": "Brief description of the news (2-3 sentences)",
    "url": "#",
    "source": "Source name"
  }`;
  
  try {
    const newsData = await makeGeminiRequest(newsPrompt);
    let parsedNews = Array.isArray(newsData) ? newsData : [newsData];
    console.log("Parsed news data:", parsedNews);
    return parsedNews;
  } catch (error) {
    console.error('Error generating news:', error);
    return [{
      title: `Latest updates from ${destinationName}`,
      description: "Unable to fetch news at the moment.",
      url: "#",
      source: "Local News"
    }];
  }
}
