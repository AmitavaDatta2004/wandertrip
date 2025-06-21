import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { useTrip } from '@/contexts/TripContext';
import { getImageForQuery, fetchDestinationNews, NewsItem } from '@/lib/tripPlanner'; // Assuming fetchDestinationNews exists
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DestinationCard from '@/components/trip/DestinationCard';
import ItineraryDay from '@/components/trip/ItineraryDay';
import PackingList from '@/components/trip/PackingList';
import TravelTips from '@/components/trip/TravelTips';
import MapView from '@/components/trip/MapView';
import DestinationNews from '@/components/trip/DestinationNews'; // Assuming this component exists
import TripHeader from '@/components/trip/TripHeader';
import TripActions from '@/components/trip/TripActions';
import MoodJournal from '@/components/trip/MoodJournal';
import BudgetEstimator from '@/components/trip/BudgetEstimator'; // Assuming this component exists
import CulturalTips from '@/components/trip/CulturalTips'; // Assuming this component exists
import TripPdfExport from '@/components/trip/TripPdfExport';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SuggestedTrip } from '@/lib/types/trip'; // Import the SuggestedTrip type if needed elsewhere

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentTrip, saveTrip, loading } = useTrip();
  const [destinationImages, setDestinationImages] = useState<Record<string, string>>({});
  const [destinationNews, setDestinationNews] = useState<Record<string, NewsItem[]>>({});
  const mood = location.state?.mood || '';
  const [activeTab, setActiveTab] = useState('destinations');
  const [selectedTripIndex, setSelectedTripIndex] = useState(0); // State to track which suggested trip is viewed

  useEffect(() => {
    // Redirect if no trip data is available
    if (!loading && !currentTrip) {
      console.log("No current trip data, navigating to /generate");
      navigate('/generate');
      return;
    }

    // Fetch images and news only if currentTrip and suggestedTrips exist
    if (currentTrip?.suggestedTrips && currentTrip.suggestedTrips.length > 0) {

      // --- Image Loading ---
      const loadImages = async () => {
        const images: Record<string, string> = {};
        // Use Promise.all for potentially faster loading
        await Promise.all(currentTrip.suggestedTrips.map(async (trip) => {
          const destName = trip.destination.name;
          const imageQuery = trip.destination.image;
          if (!destinationImages[destName]) { // Fetch only if not already fetched
             try {
               const imageUrl = await getImageForQuery(imageQuery);
               images[destName] = imageUrl;
             } catch (error) {
               console.error(`Error fetching image for ${destName}:`, error);
               images[destName] = "https://images.unsplash.com/photo-1500375592092-40eb2168fd21"; // Default fallback
             }
          } else {
             images[destName] = destinationImages[destName]; // Keep existing image
          }
        }));
        setDestinationImages(prevImages => ({...prevImages, ...images})); // Merge new images
      };

      // Prevent refetching images on every render if they already exist
      const unloadedDestinations = currentTrip.suggestedTrips.filter(trip => !destinationImages[trip.destination.name]);
      if (unloadedDestinations.length > 0) {
        loadImages();
      }


      // --- News Fetching ---
      const fetchNews = async () => {
         const newsUpdates: Record<string, NewsItem[]> = {};
         await Promise.all(currentTrip.suggestedTrips.map(async (trip) => {
             const destName = trip.destination.name;
             if (!destinationNews[destName]) { // Fetch only if not already fetched
                 try {
                     const newsData = await fetchDestinationNews(destName);
                     newsUpdates[destName] = newsData;
                 } catch (error) {
                     console.error(`Error fetching news for ${destName}:`, error);
                     newsUpdates[destName] = [{ // Provide fallback news item
                         title: `Latest updates from ${destName}`,
                         description: "Unable to fetch news at the moment.",
                         url: "#",
                         source: "Local News"
                     }];
                 }
             } else {
                 newsUpdates[destName] = destinationNews[destName]; // Keep existing news
             }
         }));
         setDestinationNews(prevNews => ({...prevNews, ...newsUpdates})); // Merge news updates
     };

     const unFetchedNewsDestinations = currentTrip.suggestedTrips.filter(trip => !destinationNews[trip.destination.name]);
     if (unFetchedNewsDestinations.length > 0) {
       fetchNews();
     }

    }
  }, [currentTrip, loading, navigate, destinationImages, destinationNews]); // Added dependencies


  // --- Loading State ---
  // Show loading if the context is loading OR if currentTrip exists but suggestedTrips doesn't yet
  if (loading || !currentTrip?.suggestedTrips) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p>Loading your personalized trip options...</p>
            {/* Optional: Add a spinner here */}
          </div>
        </div>
      </AppLayout>
    );
  }

  // --- Handle potential empty or invalid data after loading ---
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


  // Ensure selectedTripIndex is valid
  const safeSelectedTripIndex = Math.min(selectedTripIndex, currentTrip.suggestedTrips.length - 1);
  const activeSuggestedTrip = currentTrip.suggestedTrips[safeSelectedTripIndex];

  // Check if activeSuggestedTrip is valid before trying to access its properties
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
      <div className="min-h-screen bg-gradient-2 dark:bg-gray-900 py-12 px-4 transition-colors">
        <div className="container max-w-6xl mx-auto">
          {/* Header remains the same */}
          <TripHeader
            title={currentTrip.moodTitle}
            quote={currentTrip.moodQuote}
          />

          {/* Dropdown to select the trip suggestion */}
          <div className="mb-6">
            <Select
              value={safeSelectedTripIndex.toString()}
              onValueChange={(value) => setSelectedTripIndex(parseInt(value))}
            >
              <SelectTrigger className="w-full sm:w-[320px] mx-auto mb-4">
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
            {/* TabsList remains similar */}
            <div className="flex justify-center mb-6">
              <TabsList className="grid w-full max-w-3xl grid-cols-7">
                <TabsTrigger value="destinations">Destination</TabsTrigger> {/* Renamed slightly */}
                <TabsTrigger value="map">Map</TabsTrigger>
                <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                <TabsTrigger value="budget">Budget</TabsTrigger>
                <TabsTrigger value="culture">Culture</TabsTrigger>
                <TabsTrigger value="journal">Journal</TabsTrigger>
                <TabsTrigger value="packing">Packing</TabsTrigger>
              </TabsList>
            </div>

            {/* --- Destinations Tab: Shows the SELECTED destination --- */}
            <TabsContent value="destinations" className="animate-fade-in space-y-6 pdf-section">
              {/* No loop needed here, show the active one */}
              <div className="space-y-6">
                <DestinationCard
                  destination={activeDestination}
                  index={safeSelectedTripIndex} // Pass index if needed
                  imageUrl={destinationImages[activeDestination.name]}
                />
                <DestinationNews
                  news={destinationNews[activeDestination.name] || []}
                  destination={activeDestination.name}
                />
              </div>
            </TabsContent>

            {/* --- Map Tab: Shows the SELECTED destination and its POIs --- */}
            <TabsContent value="map" className="animate-fade-in pdf-section">
              <MapView
                // Pass only the selected destination info, wrapped in an array
                // Modify MapView component if it strictly needs multiple destinations
                destinations={[{
                  name: activeDestination.name,
                  coordinates: activeDestination.coordinates,
                  pointsOfInterest: activeDestination.pointsOfInterest
                }]}
                activeDestinationIndex={0} // Since we pass only one, index is 0
              />
            </TabsContent>

            {/* --- Itinerary Tab: Shows the itinerary for the SELECTED trip --- */}
            <TabsContent value="itinerary" className="animate-fade-in pdf-section">
              {/* Removed the complex splitting logic and inner Select */}
              <div>
                <h2 className="text-2xl font-bold mt-6 mb-4 dark:text-white">
                  Itinerary for: {activeDestination.name}
                </h2>
                <div className="space-y-6">
                  {/* Use the itinerary directly from the selected trip */}
                  {activeItinerary.map((day) => (
                    <ItineraryDay key={`${safeSelectedTripIndex}-${day.day}`} day={day} />
                  ))}
                </div>
              </div>
            </TabsContent>

             {/* --- Budget Tab: Shows estimate for the SELECTED trip --- */}
            <TabsContent value="budget" className="animate-fade-in pdf-section">
              {/* Pass only the selected destination to BudgetEstimator */}
              {/* Adjust BudgetEstimator props if needed */}
              <BudgetEstimator destinations={[activeDestination]} />
              {/* You might want to display activeDestination.estimatedCosts directly too */}
              <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                 <h3 className="font-semibold dark:text-white">Estimated Costs for {activeDestination.name}:</h3>
                 <p className="dark:text-gray-300">{activeDestination.estimatedCosts || "Not specified"}</p>
              </div>
            </TabsContent>

             {/* --- Culture Tab: Shows tips for the SELECTED destination --- */}
            <TabsContent value="culture" className="animate-fade-in pdf-section">
              <CulturalTips destination={activeDestination.name} />
            </TabsContent>

             {/* --- Journal Tab: Remains the same (likely not destination-specific) --- */}
            <TabsContent value="journal" className="animate-fade-in">
              <MoodJournal />
            </TabsContent>

            {/* --- Packing Tab: Shows GENERAL packing list and tips --- */}
            <TabsContent value="packing" className="animate-fade-in pdf-section">
              {/* These use the top-level arrays from currentTrip */}
              <PackingList items={currentTrip.packingList || []} />
              <TravelTips tips={currentTrip.travelTips || []} />
            </TabsContent>
          </Tabs>

          {/* --- PDF Export: Might need adjustment --- */}
          {/* Pass the selected trip data and general info */}
          {/* Ensure TripPdfExport component is updated to handle this structure */}
          <TripPdfExport
             selectedTrip={activeSuggestedTrip}
             generalInfo={{
               packingList: currentTrip.packingList || [],
               moodTitle: currentTrip.moodTitle || 'Trip Plan',
               moodQuote: currentTrip.moodQuote || '',
               travelTips: currentTrip.travelTips || [],
             }}
           />

          {/* --- Trip Actions: Save likely saves the whole currentTrip object --- */}
          <TripActions
            onSave={() => saveTrip(mood)} // Assumes saveTrip saves the whole object received from API
            loading={loading}
            mood={mood}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default Results;