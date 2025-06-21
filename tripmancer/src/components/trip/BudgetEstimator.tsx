
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { fetchBudgetEstimate } from '@/lib/services/budgetService';
import { DestinationDetails } from '@/lib/types/trip';

type BudgetEstimatorProps = {
  destinations: DestinationDetails[];
};

type BudgetData = {
  summary: string;
  accommodation: {
    average: number;
    options: Array<{type: string; costPerNight: number}>;
  };
  food: {
    average: number;
    options: Array<{type: string; costPerDay: number}>;
  };
  transportation: {
    average: number;
    options: Array<{type: string; costPerDay: number}>;
  };
  activities: {
    average: number;
    examples: Array<{name: string; cost: number}>;
  };
  totalEstimate: {
    low: number;
    average: number;
    high: number;
  };
};

const BudgetEstimator = ({ destinations }: BudgetEstimatorProps) => {
  const [activeDest, setActiveDest] = useState<number>(0);
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchBudget = async () => {
      if (destinations && destinations.length > 0) {
        setLoading(true);
        try {
          const data = await fetchBudgetEstimate(destinations[activeDest].name, 'moderate', 7);
          setBudgetData(data);
        } catch (error) {
          console.error("Error fetching budget data:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchBudget();
  }, [destinations, activeDest]);
  
  if (!destinations || destinations.length === 0) {
    return (
      <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border-none mb-8">
        <CardHeader>
          <CardTitle className="text-2xl dark:text-white">Budget Estimate</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300">No destination selected.</p>
        </CardContent>
      </Card>
    );
  }
  
  if (loading) {
    return (
      <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border-none mb-8">
        <CardHeader>
          <CardTitle className="text-2xl dark:text-white">Budget Estimate</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300 mb-4">Loading budget information...</p>
          <Progress value={45} className="h-2" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border-none mb-8">
      <CardHeader>
        <CardTitle className="text-2xl dark:text-white">Budget Estimate: {destinations[activeDest].name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {destinations.length > 1 && (
          <div className="flex mb-4 overflow-x-auto pb-2 gap-2">
            {destinations.map((dest, idx) => (
              <button
                key={`dest-${idx}`}
                className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm ${
                  idx === activeDest 
                    ? 'bg-tripmancer-purple text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                }`}
                onClick={() => setActiveDest(idx)}
              >
                {dest.name}
              </button>
            ))}
          </div>
        )}
        
        {budgetData ? (
          <>
            <div className="bg-gray-50 dark:bg-gray-700/40 p-4 rounded-lg">
              <p className="text-gray-700 dark:text-gray-200">{budgetData.summary}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 dark:text-white">Accommodation</h3>
                <div className="space-y-2">
                  {budgetData.accommodation.options.map((option, idx) => (
                    <div key={`acc-${idx}`} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">{option.type}</span>
                      <span className="font-medium">${option.costPerNight}/night</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 dark:text-white">Food</h3>
                <div className="space-y-2">
                  {budgetData.food.options.map((option, idx) => (
                    <div key={`food-${idx}`} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">{option.type}</span>
                      <span className="font-medium">${option.costPerDay}/day</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 dark:text-white">Transportation</h3>
                <div className="space-y-2">
                  {budgetData.transportation.options.map((option, idx) => (
                    <div key={`trans-${idx}`} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">{option.type}</span>
                      <span className="font-medium">${option.costPerDay}/day</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 dark:text-white">Activities</h3>
                <div className="space-y-2">
                  {budgetData.activities.examples.map((example, idx) => (
                    <div key={`act-${idx}`} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">{example.name}</span>
                      <span className="font-medium">${example.cost}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Total Estimate (7 days)</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Budget option</span>
                  <span className="font-medium">${budgetData.totalEstimate.low}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Mid-range option</span>
                  <span className="font-medium">${budgetData.totalEstimate.average}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Luxury option</span>
                  <span className="font-medium">${budgetData.totalEstimate.high}</span>
                </div>
              </div>
            </div>
              
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              *All prices are estimates and may vary based on season, availability, and personal preferences.
            </div>
          </>
        ) : (
          <p>Unable to load budget data at this time.</p>
        )}
        
        {/* Original estimated costs from the trip data */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">From Itinerary</h3>
          <p className="text-gray-700 dark:text-gray-300">{destinations[activeDest].estimatedCosts}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetEstimator;
