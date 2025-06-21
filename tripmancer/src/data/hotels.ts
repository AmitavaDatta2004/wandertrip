
export interface Hotel {
  id: string;
  name: string;
  location: string;
  city: string;
  country: string;
  image: string;
  images: string[];
  rating: number;
  reviewCount: number;
  pricePerNight: number;
  originalPrice?: number;
  description: string;
  detailedDescription?: string;
  category: 'luxury' | 'business' | 'budget' | 'boutique' | 'resort' | 'heritage';
  amenities: string[];
  roomTypes: {
    name: string;
    price: number;
    description: string;
    capacity: number;
  }[];
  policies: {
    checkIn: string;
    checkOut: string;
    cancellation: string;
    pets: string;
  };
  highlights: string[];
  nearbyAttractions: string[];
  bestFor: string[];
}

export const hotels: Hotel[] = [
  {
    id: "1",
    name: "The Oberoi Udaivilas",
    location: "Lake Pichola, Udaipur",
    city: "Udaipur",
    country: "India",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop"
    ],
    rating: 4.9,
    reviewCount: 2847,
    pricePerNight: 45000,
    originalPrice: 55000,
    description: "Experience royal luxury at this palace hotel overlooking Lake Pichola with world-class amenities.",
    category: "luxury",
    amenities: ["Spa", "Pool", "Fine Dining", "Butler Service", "Lake View", "Boating", "Wi-Fi", "Airport Transfer"],
    roomTypes: [
      {
        name: "Premier Room with Lake View",
        price: 45000,
        description: "Elegant room with stunning lake views and marble bathroom",
        capacity: 2
      },
      {
        name: "Luxury Suite",
        price: 75000,
        description: "Spacious suite with private terrace and butler service",
        capacity: 4
      }
    ],
    policies: {
      checkIn: "3:00 PM",
      checkOut: "12:00 PM",
      cancellation: "Free cancellation up to 24 hours before check-in",
      pets: "Pets not allowed"
    },
    highlights: ["Lake Pichola Views", "Royal Architecture", "Spa by Oberoi", "Fine Dining"],
    nearbyAttractions: ["City Palace", "Jag Mandir", "Saheliyon Ki Bari", "Jagdish Temple"],
    bestFor: ["Luxury Travel", "Honeymoon", "Royal Experience", "Photography"]
  },
  {
    id: "2",
    name: "Taj Lake Palace",
    location: "Lake Pichola, Udaipur",
    city: "Udaipur",
    country: "India",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop"
    ],
    rating: 4.8,
    reviewCount: 3241,
    pricePerNight: 38000,
    description: "Floating palace hotel in the middle of Lake Pichola offering unparalleled luxury and heritage.",
    category: "heritage",
    amenities: ["Heritage Property", "Lake Views", "Spa", "Fine Dining", "Boat Transfer", "Wi-Fi"],
    roomTypes: [
      {
        name: "Palace Room",
        price: 38000,
        description: "Traditional palace room with lake views",
        capacity: 2
      },
      {
        name: "Royal Suite",
        price: 65000,
        description: "Magnificent suite with panoramic lake views",
        capacity: 3
      }
    ],
    policies: {
      checkIn: "2:00 PM",
      checkOut: "12:00 PM",
      cancellation: "Free cancellation up to 48 hours before check-in",
      pets: "Pets not allowed"
    },
    highlights: ["Floating Palace", "Heritage Property", "Boat Access", "Royal Dining"],
    nearbyAttractions: ["City Palace", "Jagmandir Island", "Crystal Gallery"],
    bestFor: ["Heritage Experience", "Luxury", "Unique Stay", "Cultural Immersion"]
  },
  {
    id: "3",
    name: "The Leela Palace New Delhi",
    location: "Chanakyapuri, New Delhi",
    city: "New Delhi",
    country: "India",
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop"
    ],
    rating: 4.7,
    reviewCount: 1876,
    pricePerNight: 25000,
    originalPrice: 30000,
    description: "Luxurious hotel in the heart of Delhi with world-class amenities and impeccable service.",
    category: "luxury",
    amenities: ["Spa", "Pool", "Multiple Restaurants", "Business Center", "Gym", "Concierge", "Wi-Fi"],
    roomTypes: [
      {
        name: "Deluxe Room",
        price: 25000,
        description: "Elegant room with city views and luxury amenities",
        capacity: 2
      },
      {
        name: "Executive Suite",
        price: 40000,
        description: "Spacious suite with separate living area",
        capacity: 3
      }
    ],
    policies: {
      checkIn: "3:00 PM",
      checkOut: "12:00 PM",
      cancellation: "Free cancellation up to 24 hours before check-in",
      pets: "Service animals only"
    },
    highlights: ["Central Location", "Luxury Spa", "Fine Dining", "Business Facilities"],
    nearbyAttractions: ["India Gate", "Red Fort", "Lotus Temple", "Qutub Minar"],
    bestFor: ["Business Travel", "Luxury", "City Exploration", "Dining"]
  },
  {
    id: "4",
    name: "Backpacker's Haven Goa",
    location: "Anjuna Beach, Goa",
    city: "Goa",
    country: "India",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop"
    ],
    rating: 4.2,
    reviewCount: 892,
    pricePerNight: 1500,
    description: "Budget-friendly hostel near Anjuna Beach, perfect for backpackers and solo travelers.",
    category: "budget",
    amenities: ["Beach Access", "Common Kitchen", "Wi-Fi", "Laundry", "Bike Rental", "Common Area"],
    roomTypes: [
      {
        name: "Dormitory Bed",
        price: 800,
        description: "Shared dormitory with 8 beds",
        capacity: 1
      },
      {
        name: "Private Room",
        price: 1500,
        description: "Private room with shared bathroom",
        capacity: 2
      }
    ],
    policies: {
      checkIn: "2:00 PM",
      checkOut: "11:00 AM",
      cancellation: "Free cancellation up to 24 hours before check-in",
      pets: "Pets allowed with prior notice"
    },
    highlights: ["Beach Location", "Backpacker Friendly", "Social Atmosphere", "Budget Price"],
    nearbyAttractions: ["Anjuna Beach", "Flea Market", "Chapora Fort", "Vagator Beach"],
    bestFor: ["Budget Travel", "Solo Travel", "Beach Activities", "Nightlife"]
  },
  {
    id: "5",
    name: "The Westin Mumbai Garden City",
    location: "Goregaon East, Mumbai",
    city: "Mumbai",
    country: "India",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop"
    ],
    rating: 4.6,
    reviewCount: 2156,
    pricePerNight: 18000,
    description: "Modern business hotel with excellent connectivity and premium amenities in Mumbai.",
    category: "business",
    amenities: ["Business Center", "Spa", "Pool", "Multiple Restaurants", "Gym", "Airport Shuttle", "Wi-Fi"],
    roomTypes: [
      {
        name: "Traditional Room",
        price: 18000,
        description: "Contemporary room with city views",
        capacity: 2
      },
      {
        name: "Suite",
        price: 28000,
        description: "Spacious suite with separate living area",
        capacity: 4
      }
    ],
    policies: {
      checkIn: "3:00 PM",
      checkOut: "12:00 PM",
      cancellation: "Free cancellation up to 24 hours before check-in",
      pets: "Pets allowed with additional fee"
    },
    highlights: ["Business Facilities", "Airport Connectivity", "Spa Services", "Multiple Dining Options"],
    nearbyAttractions: ["Film City", "Sanjay Gandhi National Park", "Powai Lake", "Phoenix Mills"],
    bestFor: ["Business Travel", "Airport Access", "Corporate Events", "City Stay"]
  },
  {
    id: "6",
    name: "Evolve Back Coorg",
    location: "Siddapura, Coorg",
    city: "Coorg",
    country: "India",
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop"
    ],
    rating: 4.8,
    reviewCount: 1234,
    pricePerNight: 22000,
    originalPrice: 26000,
    description: "Luxury resort nestled in coffee plantations offering authentic Coorg experience.",
    category: "resort",
    amenities: ["Spa", "Pool", "Coffee Plantation Tours", "Nature Walks", "Cultural Programs", "Wi-Fi"],
    roomTypes: [
      {
        name: "Villa",
        price: 22000,
        description: "Private villa surrounded by coffee plantations",
        capacity: 2
      },
      {
        name: "Presidential Villa",
        price: 35000,
        description: "Luxury villa with private pool and butler service",
        capacity: 4
      }
    ],
    policies: {
      checkIn: "2:00 PM",
      checkOut: "12:00 PM",
      cancellation: "Free cancellation up to 48 hours before check-in",
      pets: "Pets not allowed"
    },
    highlights: ["Coffee Plantation", "Nature Resort", "Cultural Experience", "Luxury Villas"],
    nearbyAttractions: ["Abbey Falls", "Raja's Seat", "Dubare Elephant Camp", "Golden Temple"],
    bestFor: ["Nature Lovers", "Luxury", "Cultural Experience", "Relaxation"]
  }
];
