
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Utensils, FileText, Loader2 } from 'lucide-react';
import { fetchDestinationCulturalInfo } from '@/lib/tripPlanner';

type CulturalTipsProps = {
  destination: string;
};

type CulturalData = {
  phrases: Array<{ phrase: string; meaning: string }>;
  etiquette: string[];
  cuisine: string[];
};

const CulturalTips = ({ destination }: CulturalTipsProps) => {
  const [culturalData, setCulturalData] = useState<CulturalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use a ref to track the current destination to avoid stale closures
  const currentDestinationRef = React.useRef(destination);
  
  useEffect(() => {
    // Update the ref when destination changes
    currentDestinationRef.current = destination;
    
    // Reset state when destination changes
    setLoading(true);
    setError(null);
    setCulturalData(null);
    
    const loadCulturalData = async () => {
      try {
        // Check if this is still the current destination request
        // This helps prevent race conditions with multiple API calls
        const destName = currentDestinationRef.current;
        const data = await fetchDestinationCulturalInfo(destName);
        
        // Only update state if this is still the current destination
        if (destName === currentDestinationRef.current) {
          setCulturalData(data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading cultural data:', error);
        if (destination === currentDestinationRef.current) {
          setError('Failed to load cultural information');
          setLoading(false);
        }
      }
    };
    
    // Add a small delay to avoid overwhelming the API with rapid changes
    const timer = setTimeout(() => {
      loadCulturalData();
    }, 300);
    
    return () => {
      clearTimeout(timer);
    };
  }, [destination]);

  if (loading) {
    return (
      <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border-none mb-8">
        <CardHeader>
          <CardTitle className="text-2xl dark:text-white">Cultural Tips for {destination}</CardTitle>
          <CardDescription className="dark:text-gray-300">
            Loading cultural information...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-tripmancer-purple-dark" />
        </CardContent>
      </Card>
    );
  }

  if (error || !culturalData) {
    return (
      <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border-none mb-8">
        <CardHeader>
          <CardTitle className="text-2xl dark:text-white">Cultural Tips for {destination}</CardTitle>
          <CardDescription className="dark:text-gray-300">
            Could not load cultural information
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-gray-500 dark:text-gray-400">
            We couldn't retrieve cultural information for this destination. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border-none mb-8">
      <CardHeader>
        <CardTitle className="text-2xl dark:text-white">Cultural Tips for {destination}</CardTitle>
        <CardDescription className="dark:text-gray-300">
          Enhance your experience with local knowledge
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="phrases" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
            <TabsTrigger value="phrases">
              <BookOpen className="h-4 w-4 mr-2" /> Key Phrases
            </TabsTrigger>
            <TabsTrigger value="etiquette">
              <FileText className="h-4 w-4 mr-2" /> Do's & Don'ts
            </TabsTrigger>
            <TabsTrigger value="cuisine">
              <Utensils className="h-4 w-4 mr-2" /> Local Cuisine
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="phrases" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {culturalData.phrases.map((item, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700/40 p-4 rounded-lg">
                  <div className="font-bold text-gray-900 dark:text-white">
                    {item.phrase}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300 text-sm">
                    {item.meaning}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="etiquette" className="space-y-4">
            <ul className="space-y-3">
              {culturalData.etiquette.map((tip, index) => (
                <li key={index} className="flex items-start gap-3 bg-gray-50 dark:bg-gray-700/40 p-4 rounded-lg">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-5 h-5 rounded-full bg-tripmancer-blue-dark dark:bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{tip}</p>
                </li>
              ))}
            </ul>
          </TabsContent>
          
          <TabsContent value="cuisine" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {culturalData.cuisine.map((food, index) => (
                <div key={index} className="flex items-start gap-3 bg-gray-50 dark:bg-gray-700/40 p-4 rounded-lg">
                  <div className="flex-shrink-0 mt-1">
                    <Utensils className="h-5 w-5 text-tripmancer-blue-dark dark:text-blue-400" />
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{food}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CulturalTips;
