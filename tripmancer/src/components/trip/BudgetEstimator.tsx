
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { fetchBudgetEstimate } from '@/lib/services/budgetService';
import { DestinationDetails } from '@/lib/types/trip';
import { Badge } from '@/components/ui/badge';

type BudgetEstimatorProps = {
  destinations: DestinationDetails[];
  currency?: string;
  timeOfVisit?: string;
  days?: number;
};

type EnhancedBudgetData = {
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
  seasonalFact?: string;
  currencyNotes?: string;
};

const BudgetEstimator = ({ destinations, currency = 'USD', timeOfVisit = 'now', days = 7 }: BudgetEstimatorProps) => {
  const [activeDest, setActiveDest] = useState<number>(0);
  const [budgetData, setBudgetData] = useState<EnhancedBudgetData | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchBudget = async () => {
      if (destinations && destinations.length > 0) {
        setLoading(true);
        try {
          const data = await fetchBudgetEstimate(
            destinations[activeDest].name, 
            'moderate', 
            days,
            currency,
            timeOfVisit
          );
          setBudgetData(data);
        } catch (error) {
          console.error("Error fetching budget data:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchBudget();
  }, [destinations, activeDest, currency, timeOfVisit, days]);
  
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

  const getCurrencySymbol = (curr: string): string => {
    const symbols: Record<string, string> = {
      'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 
      'INR': '₹', 'CAD': '$', 'AUD': '$', 'CHF': 'Fr'
    };
    return symbols[curr] || '$';
  };

  const currencySymbol = getCurrencySymbol(currency);

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border-none mb-8">
      <CardHeader>
        <CardTitle className="text-2xl dark:text-white flex items-center gap-2">
          Budget Estimate: {destinations[activeDest].name}
          <Badge variant="secondary">{currency}</Badge>
        </CardTitle>
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
              <p className="text-gray-700 dark:text-gray-200 mb-2">{budgetData.summary}</p>
              {budgetData.seasonalFact && (
                <p className="text-sm text-blue-600 dark:text-blue-400 italic">
                  💡 {budgetData.seasonalFact}
                </p>
              )}
              {budgetData.currencyNotes && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {budgetData.currencyNotes}
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 dark:text-white flex items-center">
                  🏨 Accommodation 
                  <span className="ml-2 text-sm text-gray-500">
                    (avg: {currencySymbol}{budgetData.accommodation.average}/night)
                  </span>
                </h3>
                <div className="space-y-2">
                  {budgetData.accommodation.options.map((option, idx) => (
                    <div key={`acc-${idx}`} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">{option.type}</span>
                      <span className="font-medium">{currencySymbol}{option.costPerNight}/night</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 dark:text-white flex items-center">
                  🍽️ Food 
                  <span className="ml-2 text-sm text-gray-500">
                    (avg: {currencySymbol}{budgetData.food.average}/day)
                  </span>
                </h3>
                <div className="space-y-2">
                  {budgetData.food.options.map((option, idx) => (
                    <div key={`food-${idx}`} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">{option.type}</span>
                      <span className="font-medium">{currencySymbol}{option.costPerDay}/day</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 dark:text-white flex items-center">
                  🚗 Transportation 
                  <span className="ml-2 text-sm text-gray-500">
                    (avg: {currencySymbol}{budgetData.transportation.average}/day)
                  </span>
                </h3>
                <div className="space-y-2">
                  {budgetData.transportation.options.map((option, idx) => (
                    <div key={`trans-${idx}`} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">{option.type}</span>
                      <span className="font-medium">{currencySymbol}{option.costPerDay}/day</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 dark:text-white flex items-center">
                  🎯 Activities 
                  <span className="ml-2 text-sm text-gray-500">
                    (avg: {currencySymbol}{budgetData.activities.average}/day)
                  </span>
                </h3>
                <div className="space-y-2">
                  {budgetData.activities.examples.map((example, idx) => (
                    <div key={`act-${idx}`} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">{example.name}</span>
                      <span className="font-medium">
                        {example.cost === 0 ? 'Free' : `${currencySymbol}${example.cost}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
                Total Estimate ({days} days)
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-300">Budget</div>
                  <div className="text-xl font-bold text-green-600 dark:text-green-400">
                    {currencySymbol}{budgetData.totalEstimate.low.toLocaleString()}
                  </div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-300">Mid-range</div>
                  <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {currencySymbol}{budgetData.totalEstimate.average.toLocaleString()}
                  </div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-300">Luxury</div>
                  <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                    {currencySymbol}{budgetData.totalEstimate.high.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
              
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-4 p-3 bg-gray-50 dark:bg-gray-700/40 rounded">
              💡 All prices are estimates and may vary based on season, availability, and personal preferences. 
              Exchange rates and local prices fluctuate regularly.
            </div>
          </>
        ) : (
          <p>Unable to load budget data at this time.</p>
        )}
        
        {/* Original estimated costs from the trip data */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">From AI Itinerary</h3>
          <p className="text-gray-700 dark:text-gray-300 text-sm bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
            {destinations[activeDest].estimatedCosts}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetEstimator;
