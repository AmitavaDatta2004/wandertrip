
export { generateTripPlan } from './services/tripService';
export { fetchDestinationNews } from './services/newsService';
export { getImageForQuery } from './services/imageService';
export { fetchDestinationCulturalInfo } from './services/culturalService';
export type { TripData } from '../contexts/TripContext';
// Remove the duplicate import of NewsItem since it's already defined in this file

export interface SuggestedTrip {
  destination: {
    name: string;
    description: string;
    image: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    pointsOfInterest: Array<{
      name: string;
      description: string;
      coordinates: {
        lat: number;
        lng: number;
      };
    }>;
    howToReach: string;
    accommodationOptions: string[];
    localCuisine: string[];
    bestTimeToVisit: string;
    estimatedCosts: string;
  };
  itinerary: Array<{
    day: number;
    activities: string[];
    meals: {
      breakfast: string;
      lunch: string;
      dinner: string;
    };
  }>;
}

export interface NewsItem {
  title: string;
  description: string;
  url: string;
  source: string;
  category?: string;
}

export interface DestinationDetails {
  name: string;
  description: string;
  image: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  pointsOfInterest: Array<{
    name: string;
    description: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  }>;
  howToReach: string;
  accommodationOptions: string[];
  localCuisine: string[];
  bestTimeToVisit: string;
  estimatedCosts: string;
}
