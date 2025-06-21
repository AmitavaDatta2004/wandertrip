
import React from 'react';
import { Button } from '@/components/ui/button';
import { Share } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from '@/components/ui/motion';

type TripActionsProps = {
  onSave: () => Promise<void>;
  loading: boolean;
  mood: string;
};

const TripActions = ({ onSave, loading, mood }: TripActionsProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSaveTrip = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to save your trip",
      });
      navigate('/login');
      return;
    }
    await onSave();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
    >
      <Button
        onClick={handleSaveTrip}
        className="w-full sm:w-auto relative overflow-hidden group transition-all duration-300 ease-out hover:scale-105"
        variant="outline"
        disabled={loading}
      >
        <span className="absolute inset-0 bg-gradient-to-r from-tripmancer-purple/20 via-tripmancer-blue/20 to-tripmancer-pink/20 group-hover:scale-150 transition-transform duration-500 ease-out -z-10"></span>
        {loading ? "Saving..." : "Save Trip to Profile"}
      </Button>
      
      <Button
        onClick={() => navigate('/poster')}
        className="w-full sm:w-auto relative overflow-hidden group transition-all duration-300 ease-out hover:scale-105 bg-tripmancer-purple-dark hover:bg-tripmancer-purple-dark/90 dark:bg-purple-700 dark:hover:bg-purple-800"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 group-hover:scale-150 transition-transform duration-500 ease-out -z-10"></span>
        <Share className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
        Create Shareable Poster
      </Button>
    </motion.div>
  );
};

export default TripActions;
