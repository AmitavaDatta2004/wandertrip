import React, { useState, useMemo } from 'react';
import { Search, Filter, Star, Users, MapPin, BadgeIndianRupee, ChevronDown, ChevronUp, Wifi, Car, Coffee, Waves } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import { hotels, Hotel } from '@/data/hotels';

const Hotels = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [filterCategory, setFilterCategory] = useState('all');
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const handleBookHotel = (hotelName: string) => {
    toast({
      title: "Booking Confirmed! 🎉",
      description: `Your reservation at ${hotelName} has been booked successfully.`,
    });
  };

  const toggleCardExpansion = (hotelId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(hotelId)) {
      newExpanded.delete(hotelId);
    } else {
      newExpanded.add(hotelId);
    }
    setExpandedCards(newExpanded);
  };

  const filteredAndSortedHotels = useMemo(() => {
    let filtered = hotels.filter(hotel => {
      const matchesSearch = hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           hotel.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           hotel.city.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = filterCategory === 'all' || hotel.category === filterCategory;
      
      return matchesSearch && matchesCategory;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.pricePerNight - b.pricePerNight;
        case 'price-high':
          return b.pricePerNight - a.pricePerNight;
        case 'rating':
          return b.rating - a.rating;
        case 'alphabetical':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, sortBy, filterCategory]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      luxury: 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200 dark:from-purple-900/20 dark:to-pink-900/20 dark:text-purple-300',
      business: 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-blue-200 dark:from-blue-900/20 dark:to-cyan-900/20 dark:text-blue-300',
      budget: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200 dark:from-green-900/20 dark:to-emerald-900/20 dark:text-green-300',
      boutique: 'bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-800 border-orange-200 dark:from-orange-900/20 dark:to-yellow-900/20 dark:text-orange-300',
      resort: 'bg-gradient-to-r from-teal-100 to-green-100 text-teal-800 border-teal-200 dark:from-teal-900/20 dark:to-green-900/20 dark:text-teal-300',
      heritage: 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-amber-200 dark:from-amber-900/20 dark:to-orange-900/20 dark:text-amber-300'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-cyan-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-cyan-900/20 py-8 px-4">
        <div className="container max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-rose-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-4">
              Luxury Hotels & Stays
            </h1>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover exceptional accommodations with world-class amenities and unforgettable experiences
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-4 md:p-6 mb-6 border border-purple-200 dark:border-purple-600 shadow-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search hotels, locations, cities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/90 dark:bg-gray-700/90 border-purple-200 dark:border-purple-600 h-11"
                />
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-white/90 dark:bg-gray-700/90 border-purple-200 dark:border-purple-600 h-11">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rating</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="alphabetical">A-Z</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="bg-white/90 dark:bg-gray-700/90 border-purple-200 dark:border-purple-600 h-11">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="budget">Budget</SelectItem>
                  <SelectItem value="boutique">Boutique</SelectItem>
                  <SelectItem value="resort">Resort</SelectItem>
                  <SelectItem value="heritage">Heritage</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Showing {filteredAndSortedHotels.length} of {hotels.length} hotels
            </p>
          </div>

          {/* Hotel Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
            {filteredAndSortedHotels.map((hotel) => (
              <Card key={hotel.id} className="group hover:shadow-2xl transition-all duration-300 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-2 border-transparent hover:border-purple-300 dark:hover:border-purple-600 overflow-hidden rounded-2xl">
                <div className="relative overflow-hidden">
                  <img 
                    src={hotel.image} 
                    alt={hotel.name}
                    className="w-full h-48 md:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className={getCategoryColor(hotel.category)}>
                      {hotel.category}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/95 dark:bg-gray-800/95 rounded-lg px-2 py-1 backdrop-blur-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{hotel.rating}</span>
                      <span className="text-xs text-gray-500">({hotel.reviewCount})</span>
                    </div>
                  </div>
                  {hotel.originalPrice && (
                    <div className="absolute bottom-4 left-4 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                      Save {Math.round(((hotel.originalPrice - hotel.pricePerNight) / hotel.originalPrice) * 100)}%
                    </div>
                  )}
                </div>

                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-2">
                        {hotel.name}
                      </h3>
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300 mb-2">
                        <MapPin className="h-4 w-4 flex-shrink-0 text-red-500" />
                        <span className="text-sm truncate">{hotel.location}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {hotel.originalPrice && (
                        <div className="text-sm text-gray-500 line-through">
                          {formatPrice(hotel.originalPrice)}
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-xl md:text-2xl font-bold text-purple-600 dark:text-purple-400">
                        <BadgeIndianRupee className="h-5 w-5 md:h-6 w-6" />
                        <span>{formatPrice(hotel.pricePerNight)}</span>
                      </div>
                      <div className="text-xs md:text-sm text-gray-500">per night</div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {hotel.description}
                  </p>
                  
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-800 dark:text-white mb-2 text-sm">Top Amenities:</h4>
                    <div className="flex flex-wrap gap-1">
                      {hotel.amenities.slice(0, 4).map((amenity, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                          {amenity}
                        </Badge>
                      ))}
                      {hotel.amenities.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{hotel.amenities.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-800 dark:text-white mb-2 text-sm">Best For:</h4>
                    <div className="flex flex-wrap gap-1">
                      {hotel.bestFor.slice(0, 3).map((item, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Collapsible open={expandedCards.has(hotel.id)} onOpenChange={() => toggleCardExpansion(hotel.id)}>
                    <CollapsibleContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-800 dark:text-white mb-2 text-sm">Room Types:</h4>
                          <ul className="space-y-1">
                            {hotel.roomTypes.map((room, index) => (
                              <li key={index} className="text-gray-600 dark:text-gray-300 text-sm">
                                <span className="font-medium">{room.name}</span> - {formatPrice(room.price)}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-800 dark:text-white mb-2 text-sm">Nearby Attractions:</h4>
                          <ul className="space-y-1">
                            {hotel.nearbyAttractions.slice(0, 3).map((attraction, index) => (
                              <li key={index} className="text-gray-600 dark:text-gray-300 text-sm flex items-start gap-1">
                                <MapPin className="h-3 w-3 mt-1 text-red-400 flex-shrink-0" />
                                {attraction}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-800 dark:text-white">Check-in:</span>
                            <span className="text-gray-600 dark:text-gray-300 ml-2">{hotel.policies.checkIn}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-800 dark:text-white">Check-out:</span>
                            <span className="text-gray-600 dark:text-gray-300 ml-2">{hotel.policies.checkOut}</span>
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                    
                    <div className="pt-4 space-y-2">
                      <CollapsibleTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full border-purple-300 dark:border-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 transition-colors"
                        >
                          {expandedCards.has(hotel.id) ? (
                            <>
                              Show Less
                              <ChevronUp className="ml-2 h-4 w-4" />
                            </>
                          ) : (
                            <>
                              View Details
                              <ChevronDown className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </CollapsibleTrigger>
                      
                      <Button 
                        onClick={() => handleBookHotel(hotel.name)}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold"
                      >
                        Book Now
                      </Button>
                    </div>
                  </Collapsible>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {filteredAndSortedHotels.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Filter className="h-16 w-16 mx-auto mb-4" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                No hotels found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search criteria or filters
              </p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Hotels;
