import React, { useState, useMemo } from 'react';
import { Search, Filter, Star, Clock, Users, MapPin, BadgeIndianRupee, ChevronDown, ChevronUp, Calendar, CheckCircle, XCircle } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import { travelPackages, TravelPackage } from '@/data/travelPackages';

const TravelPackages = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const handleBookPackage = (packageTitle: string) => {
    toast({
      title: "Booking Confirmed! 🎉",
      description: `Your ${packageTitle} package has been booked successfully.`,
    });
  };

  const toggleCardExpansion = (packageId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(packageId)) {
      newExpanded.delete(packageId);
    } else {
      newExpanded.add(packageId);
    }
    setExpandedCards(newExpanded);
  };

  const filteredAndSortedPackages = useMemo(() => {
    let filtered = travelPackages.filter(pkg => {
      const matchesSearch = pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           pkg.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           pkg.country.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = filterCategory === 'all' || pkg.category === filterCategory;
      const matchesDifficulty = filterDifficulty === 'all' || pkg.difficulty === filterDifficulty;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    });

    // Sort packages
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'duration':
          return a.duration - b.duration;
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, sortBy, filterCategory, filterDifficulty]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      adventure: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300',
      luxury: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300',
      budget: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300',
      family: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300',
      romantic: 'bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/20 dark:text-pink-300',
      cultural: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300',
      moderate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300',
      challenging: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300'
    };
    return colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 py-8 px-4">
        <div className="container max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Travel Packages
            </h1>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover amazing destinations with our carefully curated travel packages
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-4 md:p-6 mb-6 border border-purple-200 dark:border-purple-600 shadow-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="lg:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search destinations, countries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/90 dark:bg-gray-700/90 border-purple-200 dark:border-purple-600 h-11"
                />
              </div>

              {/* Sort By */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-white/90 dark:bg-gray-700/90 border-purple-200 dark:border-purple-600 h-11">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rating</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                  <SelectItem value="alphabetical">A-Z</SelectItem>
                </SelectContent>
              </Select>

              {/* Category Filter */}
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="bg-white/90 dark:bg-gray-700/90 border-purple-200 dark:border-purple-600 h-11">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="adventure">Adventure</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                  <SelectItem value="budget">Budget</SelectItem>
                  <SelectItem value="family">Family</SelectItem>
                  <SelectItem value="romantic">Romantic</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                </SelectContent>
              </Select>

              {/* Difficulty Filter */}
              <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                <SelectTrigger className="bg-white/90 dark:bg-gray-700/90 border-purple-200 dark:border-purple-600 h-11">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="challenging">Challenging</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Showing {filteredAndSortedPackages.length} of {travelPackages.length} packages
            </p>
          </div>

          {/* Package Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
            {filteredAndSortedPackages.map((pkg) => (
              <Card key={pkg.id} className="group hover:shadow-2xl transition-all duration-300 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-2 border-transparent hover:border-purple-300 dark:hover:border-purple-600 overflow-hidden rounded-2xl">
                <div className="relative overflow-hidden">
                  <img 
                    src={pkg.image} 
                    alt={pkg.title}
                    className="w-full h-48 md:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <Badge className={getCategoryColor(pkg.category)}>
                      {pkg.category}
                    </Badge>
                    <Badge className={getDifficultyColor(pkg.difficulty)}>
                      {pkg.difficulty}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/95 dark:bg-gray-800/95 rounded-lg px-2 py-1 backdrop-blur-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{pkg.rating}</span>
                      <span className="text-xs text-gray-500">({pkg.reviewCount})</span>
                    </div>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-2">
                        {pkg.title}
                      </h3>
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300 mb-2">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm truncate">{pkg.destination}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center gap-1 text-xl md:text-2xl font-bold text-purple-600 dark:text-purple-400">
                        <BadgeIndianRupee className="h-5 w-5 md:h-6 w-6" />
                        <span>{formatPrice(pkg.price)}</span>
                      </div>
                      <div className="text-xs md:text-sm text-gray-500">per person</div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {pkg.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{pkg.duration} days</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{pkg.groupSize.min}-{pkg.groupSize.max} people</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-800 dark:text-white mb-2 text-sm">Highlights:</h4>
                    <div className="flex flex-wrap gap-1">
                      {pkg.highlights.slice(0, 3).map((highlight, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {highlight}
                        </Badge>
                      ))}
                      {pkg.highlights.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{pkg.highlights.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Expandable Details wrapped in Collapsible */}
                  <Collapsible open={expandedCards.has(pkg.id)} onOpenChange={() => toggleCardExpansion(pkg.id)}>
                    <CollapsibleContent className="space-y-4">
                      {pkg.detailedDescription && (
                        <div>
                          <h4 className="font-medium text-gray-800 dark:text-white mb-2 text-sm">Detailed Description:</h4>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">{pkg.detailedDescription}</p>
                        </div>
                      )}

                      {pkg.itinerary && (
                        <div>
                          <h4 className="font-medium text-gray-800 dark:text-white mb-2 text-sm">Itinerary:</h4>
                          <ul className="space-y-1">
                            {pkg.itinerary.map((item, index) => (
                              <li key={index} className="text-gray-600 dark:text-gray-300 text-sm flex items-start gap-2">
                                <Calendar className="h-3 w-3 mt-1 flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-800 dark:text-white mb-2 text-sm">Includes:</h4>
                          <ul className="space-y-1">
                            {pkg.includes.map((item, index) => (
                              <li key={index} className="text-gray-600 dark:text-gray-300 text-sm flex items-start gap-2">
                                <CheckCircle className="h-3 w-3 mt-1 text-green-500 flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {pkg.exclusions && (
                          <div>
                            <h4 className="font-medium text-gray-800 dark:text-white mb-2 text-sm">Excludes:</h4>
                            <ul className="space-y-1">
                              {pkg.exclusions.map((item, index) => (
                                <li key={index} className="text-gray-600 dark:text-gray-300 text-sm flex items-start gap-2">
                                  <XCircle className="h-3 w-3 mt-1 text-red-500 flex-shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          <span className="font-medium">Best Time to Visit:</span> {pkg.bestTime}
                        </p>
                      </div>
                    </CollapsibleContent>
                    
                    <div className="pt-4 space-y-2">
                      <CollapsibleTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full border-purple-300 dark:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                        >
                          {expandedCards.has(pkg.id) ? (
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
                        onClick={() => handleBookPackage(pkg.title)}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
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
          {filteredAndSortedPackages.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Filter className="h-16 w-16 mx-auto mb-4" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                No packages found
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

export default TravelPackages;
