import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { useTrip } from '@/contexts/TripContext';
import { getDestinationImages } from '@/lib/services/imageService';
import { fetchDestinationNews, NewsItem } from '@/lib/tripPlanner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DestinationCard from '@/components/trip/DestinationCard';
import ItineraryDay from '@/components/trip/ItineraryDay';
import PackingList from '@/components/trip/PackingList';
import TravelTips from '@/components/trip/TravelTips';
import MapView from '@/components/trip/MapView';
import DestinationNews from '@/components/trip/DestinationNews';
import WeatherWidget from '@/components/trip/WeatherWidget';
import TripHeader from '@/components/trip/TripHeader';
import TripActions from '@/components/trip/TripActions';
import MoodJournal from '@/components/trip/MoodJournal';
import BudgetEstimator from '@/components/trip/BudgetEstimator';
import CulturalTips from '@/components/trip/CulturalTips';
import TripPdfExport from '@/components/trip/TripPdfExport';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SuggestedTrip } from '@/lib/types/trip';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentTrip, saveTrip, loading } = useTrip();
  const [destinationImages, setDestinationImages] = useState<Record<string, string[]>>({});
  const [destinationNews, setDestinationNews] = useState<Record<string, NewsItem[]>>({});
  const mood = location.state?.mood || '';
  const [activeTab, setActiveTab] = useState('destinations');
  const [selectedTripIndex, setSelectedTripIndex] = useState(0);
  const [tripParams, setTripParams] = useState({
    currency: 'USD',
    timeOfVisit: 'now',
    days: 7
  });

  useEffect(() => {
    if (currentTrip?.suggestedTrips?.[0]?.destination?.estimatedCosts) {
      const costs = currentTrip.suggestedTrips[0].destination.estimatedCosts;
      
      if (costs.includes('€')) setTripParams(prev => ({ ...prev, currency: 'EUR' }));
      else if (costs.includes('£')) setTripParams(prev => ({ ...prev, currency: 'GBP' }));
      else if (costs.includes('¥')) setTripParams(prev => ({ ...prev, currency: 'JPY' }));
      else if (costs.includes('₹')) setTripParams(prev => ({ ...prev, currency: 'INR' }));
      else if (costs.includes('$')) setTripParams(prev => ({ ...prev, currency: 'USD' }));
      
      if (currentTrip.suggestedTrips[0].itinerary) {
        setTripParams(prev => ({ 
          ...prev, 
          days: currentTrip.suggestedTrips[0].itinerary.length 
        }));
      }
    }
  }, [currentTrip]);

  useEffect(() => {
    if (!loading && !currentTrip) {
      console.log("No current trip data, navigating to /generate");
      navigate('/generate');
      return;
    }

    if (currentTrip?.suggestedTrips && currentTrip.suggestedTrips.length > 0) {
      const loadImages = async () => {
        const images: Record<string, string[]> = {};
        await Promise.all(currentTrip.suggestedTrips.map(async (trip, index) => {
          const destName = trip.destination.name;
          if (!destinationImages[destName]) {
             try {
               const imageUrls = await getDestinationImages(destName, 5);
               images[destName] = imageUrls;
             } catch (error) {
               console.error(`Error fetching images for ${destName}:`, error);
               images[destName] = Array(5).fill("https://images.unsplash.com/photo-1500375592092-40eb2168fd21");
             }
          } else {
             images[destName] = destinationImages[destName];
          }
        }));
        setDestinationImages(prevImages => ({...prevImages, ...images}));
      };

      const unloadedDestinations = currentTrip.suggestedTrips.filter(trip => !destinationImages[trip.destination.name]);
      if (unloadedDestinations.length > 0) {
        loadImages();
      }

      const fetchNews = async () => {
         const newsUpdates: Record<string, NewsItem[]> = {};
         await Promise.all(currentTrip.suggestedTrips.map(async (trip) => {
             const destName = trip.destination.name;
             if (!destinationNews[destName]) {
                 try {
                     const newsData = await fetchDestinationNews(destName);
                     newsUpdates[destName] = newsData;
                 } catch (error) {
                     console.error(`Error fetching news for ${destName}:`, error);
                     newsUpdates[destName] = [{
                         title: `Latest updates from ${destName}`,
                         description: "Unable to fetch news at the moment.",
                         url: "#",
                         source: "Local News",
                         category: "general"
                     }];
                 }
             } else {
                 newsUpdates[destName] = destinationNews[destName];
             }
         }));
         setDestinationNews(prevNews => ({...prevNews, ...newsUpdates}));
     };

     const unFetchedNewsDestinations = currentTrip.suggestedTrips.filter(trip => !destinationNews[trip.destination.name]);
     if (unFetchedNewsDestinations.length > 0) {
       fetchNews();
     }
    }
  }, [currentTrip, loading, navigate, destinationImages, destinationNews]);

  if (loading || !currentTrip?.suggestedTrips) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p>Loading your personalized trip options...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!currentTrip.suggestedTrips || currentTrip.suggestedTrips.length === 0) {
     return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p>Sorry, we couldn't generate trip options. Please try again.</p>
            <button onClick={() => navigate('/generate')} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Generate New Trip
            </button>
          </div>
        </div>
      </AppLayout>
     )
  }

  const safeSelectedTripIndex = Math.min(selectedTripIndex, currentTrip.suggestedTrips.length - 1);
  const activeSuggestedTrip = currentTrip.suggestedTrips[safeSelectedTripIndex];

  if (!activeSuggestedTrip || !activeSuggestedTrip.destination || !activeSuggestedTrip.itinerary) {
     console.error("Selected trip data is incomplete:", activeSuggestedTrip);
      return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p>Error displaying the selected trip option. Data might be corrupted.</p>
             <button onClick={() => navigate('/generate')} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Generate New Trip
            </button>
          </div>
        </div>
      </AppLayout>
     )
  }

  const activeDestination = activeSuggestedTrip.destination;
  const activeItinerary = activeSuggestedTrip.itinerary;

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 py-12 px-4 transition-colors">
        <div className="container max-w-6xl mx-auto">
          <TripHeader
            title={currentTrip.moodTitle}
            quote={currentTrip.moodQuote}
          />

          <div className="mb-8">
            <Select
              value={safeSelectedTripIndex.toString()}
              onValueChange={(value) => setSelectedTripIndex(parseInt(value))}
            >
              <SelectTrigger className="w-full sm:w-[320px] mx-auto mb-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-purple-200 dark:border-purple-600">
                <SelectValue placeholder="Select a Trip Option" />
              </SelectTrigger>
              <SelectContent>
                {currentTrip.suggestedTrips.map((trip, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    Option {index + 1}: {trip.destination.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="destinations" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-center mb-8">
              <TabsList className="grid w-full max-w-4xl grid-cols-7 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-purple-200 dark:border-purple-600">
                <TabsTrigger value="destinations" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white">Destination</TabsTrigger>
                <TabsTrigger value="map" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white">Map</TabsTrigger>
                <TabsTrigger value="itinerary" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-teal-500 data-[state=active]:text-white">Itinerary</TabsTrigger>
                <TabsTrigger value="budget" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-green-500 data-[state=active]:text-white">Budget</TabsTrigger>
                <TabsTrigger value="culture" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-yellow-500 data-[state=active]:text-white">Culture</TabsTrigger>
                <TabsTrigger value="journal" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white">Journal</TabsTrigger>
                <TabsTrigger value="packing" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white">Packing</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="destinations" className="animate-fade-in space-y-8 pdf-section">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <DestinationCard
                    destination={activeDestination}
                    index={safeSelectedTripIndex}
                    imageUrl={destinationImages[activeDestination.name]?.[0] || "https://images.unsplash.com/photo-1500375592092-40eb2168fd21"}
                  />
                </div>
                <div className="space-y-6">
                  <WeatherWidget 
                    destination={activeDestination.name}
                    travelTime={tripParams.timeOfVisit}
                  />
                </div>
              </div>
              <DestinationNews
                news={destinationNews[activeDestination.name] || []}
                destination={activeDestination.name}
              />
            </TabsContent>

            <TabsContent value="map" className="animate-fade-in pdf-section">
              <MapView
                destinations={[{
                  name: activeDestination.name,
                  coordinates: activeDestination.coordinates,
                  pointsOfInterest: activeDestination.pointsOfInterest
                }]}
                activeDestinationIndex={0}
              />
            </TabsContent>

            <TabsContent value="itinerary" className="animate-fade-in pdf-section">
              <div>
                <h2 className="text-2xl font-bold mt-6 mb-4 dark:text-white">
                  Detailed Itinerary for: {activeDestination.name}
                </h2>
                <div className="space-y-6">
                  {activeItinerary.map((day) => (
                    <ItineraryDay key={`${safeSelectedTripIndex}-${day.day}`} day={day} />
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="budget" className="animate-fade-in pdf-section">
              <BudgetEstimator 
                destinations={[activeDestination]} 
                currency={tripParams.currency}
                timeOfVisit={tripParams.timeOfVisit}
                days={tripParams.days}
              />
            </TabsContent>

            <TabsContent value="culture" className="animate-fade-in pdf-section">
              <CulturalTips destination={activeDestination.name} />
            </TabsContent>

            <TabsContent value="journal" className="animate-fade-in">
              <MoodJournal />
            </TabsContent>

            <TabsContent value="packing" className="animate-fade-in pdf-section">
              <PackingList items={currentTrip.packingList || []} />
              <TravelTips tips={currentTrip.travelTips || []} />
            </TabsContent>
          </Tabs>

          <TripPdfExport
             selectedTrip={activeSuggestedTrip}
             generalInfo={{
               packingList: currentTrip.packingList || [],
               moodTitle: currentTrip.moodTitle || 'Trip Plan',
               moodQuote: currentTrip.moodQuote || '',
               travelTips: currentTrip.travelTips || [],
             }}
           />

          <TripActions
            onSave={() => saveTrip(mood)}
            loading={loading}
            mood={mood}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default Results;
