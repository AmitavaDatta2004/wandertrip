
import React, { createContext, useContext, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';

// Define the TripData interface based on the actual structure in the database
export type TripData = {
  moodTitle: string;
  moodQuote: string;
  suggestedTrips?: any[];
  destinations?: any[];
  packingList?: string[];
  travelTips?: string[];
  budget?: {
    accommodation: number;
    food: number;
    activities: number;
    transportation: number;
  };
  culturalInfo?: {
    phrases: Array<{ phrase: string; meaning: string }>;
    etiquette: string[];
    cuisine: string[];
  };
};

type TripContextType = {
  currentTrip: TripData | null;
  savedTrips: any[];
  setCurrentTrip: (trip: TripData) => void;
  loading: boolean;
  saveTrip: (mood: string) => Promise<void>;
  fetchSavedTrips: () => Promise<void>;
  deleteTrip: (id: number) => Promise<void>;
};

const TripContext = createContext<TripContextType | undefined>(undefined);

export function TripProvider({ children }: { children: React.ReactNode }) {
  const [currentTrip, setCurrentTrip] = useState<TripData | null>(null);
  const [savedTrips, setSavedTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const saveTrip = async (mood: string) => {
    if (!user || !currentTrip) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('trips')
        .insert({
          user_id: user.id,
          mood: mood,
          trip_data: currentTrip,
        });
        
      if (error) {
        toast({
          title: "Error saving trip",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Trip saved!",
        description: "Your trip has been saved to your profile.",
      });
      
      fetchSavedTrips();
    } catch (error: any) {
      toast({
        title: "Error saving trip",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedTrips = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        toast({
          title: "Error fetching trips",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      setSavedTrips(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching trips",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteTrip = async (id: number) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', id);
        
      if (error) {
        toast({
          title: "Error deleting trip",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Trip deleted",
        description: "Your trip has been removed.",
      });
      
      setSavedTrips(savedTrips.filter((trip) => trip.id !== id));
    } catch (error: any) {
      toast({
        title: "Error deleting trip",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentTrip,
    savedTrips,
    setCurrentTrip,
    loading,
    saveTrip,
    fetchSavedTrips,
    deleteTrip,
  };

  return (
    <TripContext.Provider value={value}>
      {children}
    </TripContext.Provider>
  );
}

export const useTrip = () => {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};
