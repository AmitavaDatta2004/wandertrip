
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import AppLayout from '@/components/AppLayout';
import { generateTripPlan } from '@/lib/tripPlanner';
import { useTrip } from '@/contexts/TripContext';
import { Wand2, Sparkles, Users, CalendarDays, DollarSign, Map, MapPin, Clock, Banknote } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  mood: z.string().min(1, { message: "Please enter a mood" }),
  description: z.string().optional(),
  days: z.number().min(1).max(14),
  people: z.number().min(1).max(10),
  budget: z.string(),
  location: z.string().optional(),
  currency: z.string(),
  timeOfVisit: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

const GenerateTrip = () => {
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<string>('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setCurrentTrip } = useTrip();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mood: "",
      description: "",
      days: 3,
      people: 1,
      budget: "moderate",
      location: "",
      currency: "USD",
      timeOfVisit: "now",
    },
  });

  // Get user's current location
  const getCurrentLocation = async () => {
    setLocationLoading(true);
    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser');
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Use reverse geocoding to get location name
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      
      if (response.ok) {
        const data = await response.json();
        const locationString = `${data.city || data.locality || ''}, ${data.principalSubdivision || ''}, ${data.countryName || ''}`.replace(/^,\s*|,\s*$/g, '');
        setCurrentLocation(locationString);
        form.setValue('location', locationString);
        toast({
          title: "Location detected",
          description: `Current location: ${locationString}`,
        });
      }
    } catch (error: any) {
      console.error('Error getting location:', error);
      toast({
        title: "Location access failed",
        description: "Please enter your location manually or enable location services.",
        variant: "destructive",
      });
    } finally {
      setLocationLoading(false);
    }
  };
  
  const handleSubmit = async (values: FormValues) => {
    if (!values.mood.trim()) {
      toast({
        title: "Please enter a mood",
        description: "We need a mood to generate a trip!",
      });
      return;
    }
    
    setLoading(true);
    try {
      const data = await generateTripPlan(
        values.mood, 
        values.description, 
        values.days, 
        values.budget, 
        values.people,
        values.location || currentLocation,
        values.currency,
        values.timeOfVisit
      );
      
      setCurrentTrip(data);
      toast({
        title: "Trip plan generated!",
        description: "Your personalized trip is ready to explore.",
      });
      navigate('/results', { state: { mood: values.mood } });
    } catch (error: any) {
      toast({
        title: "Error generating trip",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-2 dark:bg-gradient-to-b dark:from-gray-800 dark:to-gray-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 dark:text-white">Create Your Perfect Trip</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Tell us your preferences, and our AI will craft the perfect travel experience just for you.
            </p>
          </div>
          
          <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-tripmancer-purple/20 to-tripmancer-blue/20 dark:from-purple-900/20 dark:to-blue-900/20 pb-8">
              <CardTitle className="text-2xl dark:text-white">Generate Trip Plan</CardTitle>
              <CardDescription className="dark:text-gray-300">Tell us about your dream vacation</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="mood"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-medium text-gray-700 dark:text-gray-200">
                          How are you feeling?
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., adventurous, relaxed, romantic, energetic, peaceful"
                            {...field}
                            className="text-lg py-6 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        </FormControl>
                        <FormDescription>
                          This helps us understand the kind of experience you're looking for
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="days"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-medium text-gray-700 dark:text-gray-200">
                            <div className="flex items-center gap-2">
                              <CalendarDays className="h-5 w-5" /> 
                              <span>Trip Duration</span>
                            </div>
                          </FormLabel>
                          <FormControl>
                            <div className="space-y-4">
                              <Slider
                                min={1}
                                max={14}
                                step={1}
                                value={[field.value]}
                                onValueChange={(value) => field.onChange(value[0])}
                                className="pt-4"
                              />
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500 dark:text-gray-400">1 day</span>
                                <span className="text-lg font-semibold dark:text-white">{field.value} days</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">14 days</span>
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="people"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-medium text-gray-700 dark:text-gray-200">
                            <div className="flex items-center gap-2">
                              <Users className="h-5 w-5" /> 
                              <span>Number of Travelers</span>
                            </div>
                          </FormLabel>
                          <FormControl>
                            <div className="space-y-4">
                              <Slider
                                min={1}
                                max={10}
                                step={1}
                                value={[field.value]}
                                onValueChange={(value) => field.onChange(value[0])}
                                className="pt-4"
                              />
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500 dark:text-gray-400">1 person</span>
                                <span className="text-lg font-semibold dark:text-white">{field.value} {field.value === 1 ? "person" : "people"}</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">10 people</span>
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="budget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-medium text-gray-700 dark:text-gray-200">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-5 w-5" /> 
                              <span>Budget Level</span>
                            </div>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                <SelectValue placeholder="Select your budget" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="budget">Budget-friendly</SelectItem>
                              <SelectItem value="moderate">Moderate</SelectItem>
                              <SelectItem value="luxury">Luxury</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Help us suggest appropriate accommodations and activities
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-medium text-gray-700 dark:text-gray-200">
                            <div className="flex items-center gap-2">
                              <Banknote className="h-5 w-5" /> 
                              <span>Preferred Currency</span>
                            </div>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                <SelectValue placeholder="Select currency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="USD">USD ($)</SelectItem>
                              <SelectItem value="EUR">EUR (€)</SelectItem>
                              <SelectItem value="GBP">GBP (£)</SelectItem>
                              <SelectItem value="JPY">JPY (¥)</SelectItem>
                              <SelectItem value="INR">INR (₹)</SelectItem>
                              <SelectItem value="CAD">CAD ($)</SelectItem>
                              <SelectItem value="AUD">AUD ($)</SelectItem>
                              <SelectItem value="CHF">CHF (Fr)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            All budget estimates will be shown in this currency
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-medium text-gray-700 dark:text-gray-200">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-5 w-5" /> 
                              <span>Starting Location</span>
                            </div>
                          </FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              <Input
                                placeholder="e.g., New York, USA or leave blank for anywhere"
                                {...field}
                                className="h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              />
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                                onClick={getCurrentLocation}
                                disabled={locationLoading}
                                className="w-full"
                              >
                                {locationLoading ? "Detecting..." : "Use Current Location"}
                              </Button>
                            </div>
                          </FormControl>
                          <FormDescription>
                            We'll suggest destinations and calculate travel distances from here
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="timeOfVisit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-medium text-gray-700 dark:text-gray-200">
                            <div className="flex items-center gap-2">
                              <Clock className="h-5 w-5" /> 
                              <span>When do you want to travel?</span>
                            </div>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                <SelectValue placeholder="Select travel time" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="now">Right now</SelectItem>
                              <SelectItem value="1week">In 1 week</SelectItem>
                              <SelectItem value="2weeks">In 2 weeks</SelectItem>
                              <SelectItem value="1month">In 1 month</SelectItem>
                              <SelectItem value="2months">In 2 months</SelectItem>
                              <SelectItem value="3months">In 3 months</SelectItem>
                              <SelectItem value="6months">In 6 months</SelectItem>
                              <SelectItem value="1year">In 1 year</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            This helps us consider weather, seasonal events, and pricing
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-medium text-gray-700 dark:text-gray-200">
                          Any specific preferences? (Optional)
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            rows={4}
                            placeholder="Add any specific preferences or details for your trip (e.g., activities you enjoy, dietary restrictions, accessibility needs)"
                            {...field}
                            className="resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        </FormControl>
                        <FormDescription>
                          The more details you provide, the better we can personalize your trip
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      className="w-full text-lg py-7 rounded-xl flex items-center justify-center gap-2 bg-gradient-to-r from-tripmancer-purple-dark to-tripmancer-blue-dark hover:opacity-90 dark:from-purple-700 dark:to-blue-700"
                      disabled={loading}
                      size="lg"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin-slow rounded-full border-2 border-white border-t-transparent h-5 w-5"></div>
                          <span>Creating Your Journey...</span>
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-5 w-5" />
                          <span>Generate My Perfect Trip</span>
                          <Sparkles className="h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold mb-4 dark:text-white">How It Works</h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our AI analyzes your mood, preferences, location, and travel parameters to create a truly personalized travel experience. 
              The more you share, the better we can match destinations and activities to your current needs.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default GenerateTrip;
