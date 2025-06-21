
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Download } from 'lucide-react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { TripData } from '@/lib/types/trip';

type TripPdfExportProps = {
  selectedTrip: {
    destination: {
      name: string;
      description: string;
      image: string;
      coordinates: { lat: number; lng: number };
      pointsOfInterest: Array<{ 
        name: string;
        description: string;
        coordinates: { lat: number; lng: number };
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
  };
  generalInfo: {
    packingList: string[];
    moodTitle: string;
    moodQuote: string;
    travelTips: string[];
  };
};

const TripPdfExport = ({ selectedTrip, generalInfo }: TripPdfExportProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  
  const generatePDF = async () => {
    setLoading(true);
    toast({
      title: "Preparing download",
      description: "Creating your trip PDF..."
    });
    
    try {
      // Get all the elements to convert to images for the PDF
      const contentElements = document.querySelectorAll('.pdf-section');
      
      if (contentElements.length === 0) {
        throw new Error("No content found to include in PDF");
      }
      
      // Create a new PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      
      // Add title
      pdf.setFontSize(24);
      pdf.setTextColor(44, 62, 80);
      pdf.text(generalInfo.moodTitle, pageWidth / 2, 20, { align: 'center' });
      
      // Add quote
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`"${generalInfo.moodQuote}"`, pageWidth / 2, 30, { align: 'center' });
      
      let currentY = 40;
      
      // Process each element to add to the PDF
      for (let i = 0; i < contentElements.length; i++) {
        const element = contentElements[i] as HTMLElement;
        
        try {
          // Convert element to image
          const dataUrl = await toPng(element, { 
            quality: 0.95,
            backgroundColor: '#FFFFFF',
            canvasWidth: element.offsetWidth,
            canvasHeight: element.offsetHeight
          });
          
          // Calculate image dimensions to fit on page
          const imgWidth = pageWidth - (margin * 2);
          const imgHeight = (element.offsetHeight * imgWidth) / element.offsetWidth;
          
          // Check if image fits on current page, otherwise add new page
          if (currentY + imgHeight > pageHeight - margin) {
            pdf.addPage();
            currentY = margin;
          }
          
          // Add image to PDF
          pdf.addImage(dataUrl, 'PNG', margin, currentY, imgWidth, imgHeight);
          
          // Update Y position for next element
          currentY += imgHeight + 10;
        } catch (error) {
          console.error("Error converting section to image:", error);
        }
      }
      
      // Save the PDF
      pdf.save(`${generalInfo.moodTitle.replace(/\s+/g, '_')}_itinerary.pdf`);
      
      toast({
        title: "Download complete",
        description: "Your trip PDF has been generated successfully.",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error generating PDF",
        description: "There was a problem creating your PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center my-8">
      <Button
        onClick={generatePDF}
        disabled={loading}
        className="relative overflow-hidden group transition-all duration-300 ease-out"
        size="lg"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-tripmancer-purple/20 via-tripmancer-blue/20 to-tripmancer-pink/20 group-hover:scale-150 transition-transform duration-500 ease-out -z-10"></span>
        <Download className="mr-2 h-4 w-4" />
        {loading ? "Generating PDF..." : "Download Trip Itinerary (PDF)"}
      </Button>
    </div>
  );
};

export default TripPdfExport;
