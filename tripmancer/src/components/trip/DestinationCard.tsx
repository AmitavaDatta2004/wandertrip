
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Hotel, Plane, Sun, Utensils, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from '@/components/ui/motion';
import { getImageForQuery } from '@/lib/services/imageService';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

type DestinationProps = {
  destination: {
    name: string;
    description: string;
    image: string;
    howToReach: string;
    accommodationOptions: string[];
    localCuisine: string[];
    bestTimeToVisit: string;
    estimatedCosts: string;
    pointsOfInterest: Array<{
      name: string;
      description: string;
      coordinates: { lat: number; lng: number };
    }>;
  };
  index: number;
  imageUrl: string;
};

const DestinationCard = ({ destination, index, imageUrl }: DestinationProps) => {
  const [images, setImages] = useState<string[]>([imageUrl]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadAdditionalImages = async () => {
      if (images.length > 1) return; // Don't fetch if we already have multiple images
      
      setLoading(true);
      try {
        const imagePromises = [
          // Image for the destination name itself is already loaded as imageUrl
          ...destination.pointsOfInterest.slice(0, 4).map(poi => 
            getImageForQuery(`${poi.name} ${destination.name} landmark`)
          )
        ];
        
        const additionalImages = await Promise.all(imagePromises);
        setImages([imageUrl, ...additionalImages]);
      } catch (error) {
        console.error('Error loading additional images:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadAdditionalImages();
  }, [destination, imageUrl]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg mb-8 border-none hover:shadow-2xl transition-all duration-500 ease-out transform hover:-translate-y-1">
        <div className="lg:flex">
          <div className="lg:w-2/5 h-64 lg:h-auto overflow-hidden relative">
            <Carousel className="w-full h-full">
              <CarouselContent className="h-full">
                {images.map((img, i) => (
                  <CarouselItem key={i} className="h-full">
                    <div className="relative w-full h-full group">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                      <img 
                        src={img} 
                        alt={i === 0 ? destination.name : `${destination.name} - Image ${i}`}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              
              <div className="absolute z-10 bottom-4 left-0 right-0 flex justify-center gap-1">
                {images.map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/50'}`}
                  ></div>
                ))}
              </div>
              
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>
          <div className="lg:w-3/5 p-6 lg:p-8">
            <div className="flex justify-between items-center mb-4">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-tripmancer-purple-dark to-tripmancer-blue-dark bg-clip-text text-transparent"
              >
                {destination.name}
              </motion.div>
              <Badge variant="outline" className="bg-tripmancer-purple-dark/10 text-tripmancer-purple-dark dark:bg-purple-900/20 dark:text-purple-300 border-none">
                {index === 0 ? "Top Pick" : `Option ${index + 1}`}
              </Badge>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">{destination.description}</p>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="best-time" className="border-b border-gray-200 dark:border-gray-700">
                <AccordionTrigger className="py-4">
                  <div className="flex items-center gap-2">
                    <Sun className="h-5 w-5 text-tripmancer-blue-dark dark:text-blue-400" />
                    <span className="font-medium">Best Time to Visit</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-gray-600 dark:text-gray-300">
                  {destination.bestTimeToVisit}
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="how-to-reach" className="border-b border-gray-200 dark:border-gray-700">
                <AccordionTrigger className="py-4">
                  <div className="flex items-center gap-2">
                    <Plane className="h-5 w-5 text-tripmancer-blue-dark dark:text-blue-400" />
                    <span className="font-medium">How to Get There</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-gray-600 dark:text-gray-300">
                  {destination.howToReach}
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="accommodations" className="border-b border-gray-200 dark:border-gray-700">
                <AccordionTrigger className="py-4">
                  <div className="flex items-center gap-2">
                    <Hotel className="h-5 w-5 text-tripmancer-blue-dark dark:text-blue-400" />
                    <span className="font-medium">Where to Stay</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <ul className="space-y-2">
                    {destination.accommodationOptions?.map((option, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                        <div className="mt-1 min-w-4">
                          <div className="w-1.5 h-1.5 rounded-full bg-tripmancer-blue-dark dark:bg-blue-500"></div>
                        </div>
                        {option}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="cuisine" className="border-b border-gray-200 dark:border-gray-700">
                <AccordionTrigger className="py-4">
                  <div className="flex items-center gap-2">
                    <Utensils className="h-5 w-5 text-tripmancer-blue-dark dark:text-blue-400" />
                    <span className="font-medium">Local Cuisine</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <ul className="space-y-2">
                    {destination.localCuisine?.map((dish, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                        <div className="mt-1 min-w-4">
                          <div className="w-1.5 h-1.5 rounded-full bg-tripmancer-blue-dark dark:bg-blue-500"></div>
                        </div>
                        {dish}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="costs" className="border-b-0">
                <AccordionTrigger className="py-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-tripmancer-blue-dark dark:text-blue-400" />
                    <span className="font-medium">Budget Breakdown</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-gray-600 dark:text-gray-300">
                  {destination.estimatedCosts}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default DestinationCard;
