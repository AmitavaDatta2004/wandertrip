
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { useTrip } from '@/contexts/TripContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Calendar, Heart, Trash, Globe } from 'lucide-react';

const Dashboard = () => {
  const { user, getUserName } = useAuth();
  const { savedTrips, fetchSavedTrips, deleteTrip, loading, setCurrentTrip } = useTrip();
  const { toast } = useToast();
  
  useEffect(() => {
    if (user) {
      fetchSavedTrips();
    }
  }, [user]);

  const handleDeleteTrip = async (id: number) => {
    try {
      await deleteTrip(id);
      toast({
        title: "Success",
        description: "Trip deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete trip",
        variant: "destructive",
      });
    }
  };

  const handleViewTrip = (tripData: any) => {
    setCurrentTrip(tripData.trip_data);
  };
  
  const userName = getUserName();
  
  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold dark:text-white">Your Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Welcome back, {userName}! View and manage your saved trips.
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin-slow w-16 h-16 border-4 border-tripmancer-purple-dark rounded-full border-t-transparent"></div>
            </div>
          ) : savedTrips.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <Globe className="h-16 w-16 text-gray-400 dark:text-gray-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-4">No trips saved yet</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Share your mood and create your first trip plan!</p>
              <Button asChild>
                <Link to="/generate">Create Trip Plan</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedTrips.map((trip: any) => (
                <Card key={trip.id} className="overflow-hidden card-hover dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader className="bg-tripmancer-gray dark:bg-gray-800/50 pb-2">
                    <CardTitle className="dark:text-white">{trip.trip_data.moodTitle || "Trip Plan"}</CardTitle>
                    <CardDescription className="flex items-center dark:text-gray-400">
                      <Heart className="h-4 w-4 mr-1 text-red-500" />
                      <span>Based on: "{trip.mood}"</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Destinations:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {trip.trip_data.destinations ? (
                            trip.trip_data.destinations.map((dest: any, i: number) => (
                              <span key={i} className="bg-tripmancer-blue/30 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-0.5 rounded-full text-xs">
                                {dest.name}
                              </span>
                            ))
                          ) : trip.trip_data.suggestedTrips ? (
                            trip.trip_data.suggestedTrips.map((trip: any, i: number) => (
                              <span key={i} className="bg-tripmancer-blue/30 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-0.5 rounded-full text-xs">
                                {trip.destination.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400">No destinations available</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Quote:</span>
                        <p className="text-sm italic dark:text-gray-300">{trip.trip_data.moodQuote || "No quote available"}</p>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(trip.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-0">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewTrip(trip)}
                      asChild
                    >
                      <Link to="/results" state={{ mood: trip.mood }}>View Details</Link>
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-red-500">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this trip?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this trip plan.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteTrip(trip.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
