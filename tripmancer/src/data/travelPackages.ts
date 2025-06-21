
export interface TravelPackage {
  id: string;
  title: string;
  destination: string;
  country: string;
  duration: number; // in days
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  description: string;
  highlights: string[];
  includes: string[];
  category: 'adventure' | 'luxury' | 'budget' | 'family' | 'romantic' | 'cultural';
  difficulty: 'easy' | 'moderate' | 'challenging';
  bestTime: string;
  groupSize: {
    min: number;
    max: number;
  };
  image: string;
  gallery: string[];
  detailedDescription?: string;
  itinerary?: string[];
  exclusions?: string[];
}

export const travelPackages: TravelPackage[] = [
  {
    id: '1',
    title: 'Tropical Paradise Escape',
    destination: 'Maldives',
    country: 'Maldives',
    duration: 7,
    price: 199900,
    currency: 'INR',
    rating: 4.8,
    reviewCount: 324,
    description: 'Experience the ultimate luxury in overwater villas with crystal clear waters and pristine beaches.',
    detailedDescription: 'Immerse yourself in the ultimate tropical paradise with our exclusive Maldives package. Stay in luxurious overwater villas with direct access to crystal-clear lagoons, enjoy world-class spa treatments, and indulge in gourmet dining experiences. Perfect for honeymooners and luxury seekers.',
    highlights: ['Overwater Villa', 'Snorkeling & Diving', 'Spa Treatments', 'Private Beach Access'],
    includes: ['Accommodation', 'All Meals', 'Water Sports', 'Airport Transfers', 'Seaplane Transfers'],
    exclusions: ['International Flights', 'Visa Fees', 'Personal Expenses'],
    itinerary: ['Day 1: Arrival & Villa Check-in', 'Day 2-3: Water Sports & Snorkeling', 'Day 4-5: Spa & Relaxation', 'Day 6: Island Hopping', 'Day 7: Departure'],
    category: 'luxury',
    difficulty: 'easy',
    bestTime: 'November to April',
    groupSize: { min: 2, max: 4 },
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
    gallery: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5'
    ]
  },
  {
    id: '2',
    title: 'Himalayan Adventure Trek',
    destination: 'Nepal',
    country: 'Nepal',
    duration: 14,
    price: 152000,
    currency: 'INR',
    rating: 4.6,
    reviewCount: 156,
    description: 'Challenge yourself with breathtaking mountain views and cultural immersion in the Himalayas.',
    detailedDescription: 'Embark on the adventure of a lifetime with our comprehensive Everest Base Camp trek. Experience the raw beauty of the Himalayas, interact with Sherpa communities, and witness stunning sunrise views over the world\'s tallest peaks.',
    highlights: ['Everest Base Camp', 'Mountain Views', 'Local Culture', 'Teahouse Experience'],
    includes: ['Accommodation', 'Meals', 'Professional Guide', 'Permits', 'Porter Service'],
    exclusions: ['International Flights', 'Travel Insurance', 'Personal Gear'],
    itinerary: ['Day 1-2: Kathmandu to Lukla', 'Day 3-5: Trek to Namche', 'Day 6-8: Acclimatization', 'Day 9-12: Trek to Base Camp', 'Day 13-14: Return Journey'],
    category: 'adventure',
    difficulty: 'challenging',
    bestTime: 'March to May, September to November',
    groupSize: { min: 4, max: 12 },
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
    gallery: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
      'https://images.unsplash.com/photo-1464822759844-d150ad6cad7c',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4'
    ]
  },
  {
    id: '3',
    title: 'European Cultural Journey',
    destination: 'Italy, France, Spain',
    country: 'Europe',
    duration: 12,
    price: 264000,
    currency: 'INR',
    rating: 4.7,
    reviewCount: 289,
    description: 'Discover the rich history, art, and cuisine across three magnificent European countries.',
    detailedDescription: 'Journey through Europe\'s most culturally rich destinations. From the ancient ruins of Rome to the artistic treasures of Paris and the vibrant culture of Barcelona, experience the best of European heritage, art, and cuisine.',
    highlights: ['Historic Cities', 'Art Museums', 'Local Cuisine', 'Guided Tours'],
    includes: ['Accommodation', 'Inter-city Transportation', 'Breakfast', 'City Tours', 'Museum Entries'],
    exclusions: ['International Flights', 'Lunch & Dinner', 'Visa Fees'],
    itinerary: ['Day 1-4: Rome & Vatican', 'Day 5-8: Paris & Louvre', 'Day 9-12: Barcelona & Sagrada Familia'],
    category: 'cultural',
    difficulty: 'easy',
    bestTime: 'April to October',
    groupSize: { min: 6, max: 20 },
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
    gallery: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
      'https://images.unsplash.com/photo-1499856871958-5b9627545d1a',
      'https://images.unsplash.com/photo-1520637836862-4d197d17c53a'
    ]
  },
  {
    id: '4',
    title: 'Safari Adventure',
    destination: 'Kenya & Tanzania',
    country: 'East Africa',
    duration: 10,
    price: 224000,
    currency: 'INR',
    rating: 4.9,
    reviewCount: 198,
    description: 'Witness the Great Migration and explore the stunning wildlife of East Africa.',
    detailedDescription: 'Experience the ultimate African safari adventure across Kenya and Tanzania. Witness the Great Migration, spot the Big Five, interact with Maasai communities, and enjoy breathtaking landscapes from the Serengeti to Ngorongoro Crater.',
    highlights: ['Big Five Safari', 'Great Migration', 'Maasai Culture', 'Hot Air Balloon'],
    includes: ['Accommodation', 'All Meals', 'Game Drives', 'Park Fees', 'Professional Guide'],
    exclusions: ['International Flights', 'Visa Fees', 'Tips'],
    itinerary: ['Day 1-2: Nairobi to Masai Mara', 'Day 3-4: Serengeti National Park', 'Day 5-6: Ngorongoro Crater', 'Day 7-8: Tarangire National Park', 'Day 9-10: Return to Nairobi'],
    category: 'adventure',
    difficulty: 'moderate',
    bestTime: 'June to October',
    groupSize: { min: 4, max: 8 },
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
    gallery: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa',
      'https://images.unsplash.com/photo-1564760055775-d63b17a55c44'
    ]
  },
  {
    id: '5',
    title: 'Budget Backpacker Thailand',
    destination: 'Thailand',
    country: 'Thailand',
    duration: 15,
    price: 72000,
    currency: 'INR',
    rating: 4.4,
    reviewCount: 412,
    description: 'Explore the best of Thailand on a budget with temples, beaches, and street food.',
    detailedDescription: 'Perfect for budget-conscious travelers who want to experience the best of Thailand. Explore ancient temples in Bangkok, relax on pristine beaches in the south, and indulge in world-famous Thai street food.',
    highlights: ['Bangkok Temples', 'Island Hopping', 'Street Food', 'Beach Relaxation'],
    includes: ['Hostel Accommodation', 'Transportation', 'Some Meals', 'Activities', 'Local Guide'],
    exclusions: ['International Flights', 'Most Meals', 'Personal Expenses'],
    itinerary: ['Day 1-3: Bangkok Temples', 'Day 4-6: Chiang Mai', 'Day 7-9: Phuket Beaches', 'Day 10-12: Koh Phi Phi', 'Day 13-15: Bangkok & Departure'],
    category: 'budget',
    difficulty: 'easy',
    bestTime: 'November to March',
    groupSize: { min: 1, max: 15 },
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
    gallery: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828',
      'https://images.unsplash.com/photo-1539650116574-75c0c6d73d0e'
    ]
  },
  {
    id: '6',
    title: 'Family Fun Disney World',
    destination: 'Orlando, Florida',
    country: 'USA',
    duration: 6,
    price: 128000,
    currency: 'INR',
    rating: 4.5,
    reviewCount: 567,
    description: 'Magical family vacation with theme parks, characters, and unforgettable memories.',
    detailedDescription: 'Create magical memories with your family at Walt Disney World. Enjoy thrilling rides, meet beloved Disney characters, watch spectacular shows, and stay in Disney-themed hotels for the complete experience.',
    highlights: ['Disney Parks', 'Character Meets', 'Family Shows', 'Theme Park Access'],
    includes: ['Disney Hotel', 'Park Tickets', 'Breakfast', 'Airport Transportation', 'FastPass+'],
    exclusions: ['International Flights', 'Lunch & Dinner', 'Souvenirs'],
    itinerary: ['Day 1: Magic Kingdom', 'Day 2: EPCOT', 'Day 3: Hollywood Studios', 'Day 4: Animal Kingdom', 'Day 5: Water Parks', 'Day 6: Shopping & Departure'],
    category: 'family',
    difficulty: 'easy',
    bestTime: 'Year Round',
    groupSize: { min: 2, max: 8 },
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
    gallery: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
      'https://images.unsplash.com/photo-1596988062954-4a734d1b7de8',
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0'
    ]
  }
];
