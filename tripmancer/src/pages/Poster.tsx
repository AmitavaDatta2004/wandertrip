
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { useTrip } from '@/contexts/TripContext';
import { Button } from '@/components/ui/button';
import { getImageForQuery } from '@/lib/tripPlanner';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import { Share, Download } from 'lucide-react';

const Poster = () => {
  const { currentTrip } = useTrip();
  const navigate = useNavigate();
  const posterRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [bgImage, setBgImage] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Redirect if no trip data
  React.useEffect(() => {
    if (!currentTrip) {
      navigate('/');
      return;
    }
    
    // Get a background image for the poster
    const loadImage = async () => {
      if (currentTrip && currentTrip.suggestedTrips && currentTrip.suggestedTrips.length > 0) {
        try {
          const imageUrl = await getImageForQuery(currentTrip.suggestedTrips[0].destination.image);
          setBgImage(imageUrl);
        } catch (error) {
          // Use a default image if fetch fails
          setBgImage("https://images.unsplash.com/photo-1500375592092-40eb2168fd21");
        }
      }
    };
    
    loadImage();
  }, [currentTrip, navigate]);
  
  const downloadPoster = async () => {
    if (posterRef.current) {
      try {
        setIsGenerating(true);
        const canvas = await html2canvas(posterRef.current);
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `${currentTrip?.moodTitle.replace(/\s+/g, '-')}-tripmancer-poster.png`;
        link.href = image;
        link.click();
        
        toast({
          title: "Poster downloaded!",
          description: "Your travel poster has been saved to your device.",
        });
      } catch (error) {
        toast({
          title: "Download failed",
          description: "There was an error downloading your poster.",
          variant: "destructive",
        });
      } finally {
        setIsGenerating(false);
      }
    }
  };
  
  if (!currentTrip) {
    return null;
  }
  
  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-2 py-12 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold">Your Travel Poster</h1>
            <p className="text-gray-700 mt-2">Share your personalized travel inspiration</p>
          </div>
          
          <div className="flex flex-col items-center justify-center">
            {/* Poster Preview */}
            <div 
              ref={posterRef}
              className="w-full max-w-md relative bg-white rounded-xl overflow-hidden shadow-2xl"
              style={{
                aspectRatio: "3/4",
              }}
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 z-0"
                style={{
                  backgroundImage: `url(${bgImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'brightness(50%)',
                }}
              ></div>
              
              {/* Overlay and Content */}
              <div className="absolute inset-0 z-10 flex flex-col p-6">
                {/* Logo */}
                <div className="flex items-center justify-center mb-auto">
                  <div className="bg-white/90 px-4 py-2 rounded-full">
                    <span className="font-poppins font-bold text-tripmancer-purple-dark">TripMancer</span>
                  </div>
                </div>
                
                {/* Title and Quote */}
                <div className="mb-6 text-center">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 drop-shadow-lg">
                    {currentTrip.moodTitle}
                  </h2>
                  <p className="text-lg text-white italic drop-shadow-lg">{currentTrip.moodQuote}</p>
                </div>
                
                {/* Destinations */}
                <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-center">
                    <span className="text-white font-medium">Destinations</span>
                    <div className="flex flex-wrap justify-center gap-2 mt-2">
                      {currentTrip.suggestedTrips.map((trip, index) => (
                        <div 
                          key={index}
                          className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm"
                        >
                          {trip.destination.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Footer */}
                <div className="mt-auto text-center">
                  <p className="text-white text-sm drop-shadow-lg">Your Feelings. Your Destination.</p>
                </div>
              </div>
            </div>
            
            {/* Download Button */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={downloadPoster} 
                className="bg-tripmancer-purple-dark hover:bg-tripmancer-purple-dark/90"
                disabled={isGenerating}
              >
                <Download className="mr-2 h-4 w-4" />
                {isGenerating ? "Generating..." : "Download Poster"}
              </Button>
              
              {/* Share buttons would go here in a real app */}
              <Button variant="outline">
                <Share className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Poster;
