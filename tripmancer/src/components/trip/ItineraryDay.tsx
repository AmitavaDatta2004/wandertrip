
import React from 'react';
import { Coffee, Soup, Beef } from 'lucide-react';

type ItineraryDayProps = {
  day: {
    day: number;
    activities: string[];
    meals: {
      breakfast: string;
      lunch: string;
      dinner: string;
    };
  };
};

const ItineraryDay = ({ day }: ItineraryDayProps) => {
  return (
    <div className="mb-10 last:mb-0">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-tripmancer-purple-dark dark:bg-purple-600 flex items-center justify-center text-white font-bold text-lg">
          {day.day}
        </div>
        <h3 className="text-xl font-bold dark:text-white">Day {day.day}</h3>
      </div>
      
      <div className="space-y-6 pl-14">
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-700 dark:text-gray-300">Activities</h4>
          {day.activities.map((activity, actIndex) => (
            <div key={actIndex} className="pl-5 border-l-2 border-tripmancer-purple/30 dark:border-purple-700/30 pb-4 last:pb-0">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 relative -left-[21px] mt-1">
                  <div className="w-3.5 h-3.5 rounded-full bg-tripmancer-purple-dark dark:bg-purple-500"></div>
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300">{activity}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {day.meals && (
          <div className="bg-gray-50 dark:bg-gray-700/40 rounded-lg p-4">
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Dining Recommendations</h4>
            <div className="space-y-3">
              {day.meals.breakfast && (
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6">
                    <Coffee className="h-5 w-5 text-tripmancer-blue-dark dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium dark:text-gray-200">Breakfast</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{day.meals.breakfast}</p>
                  </div>
                </div>
              )}
              
              {day.meals.lunch && (
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6">
                    <Soup className="h-5 w-5 text-tripmancer-blue-dark dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium dark:text-gray-200">Lunch</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{day.meals.lunch}</p>
                  </div>
                </div>
              )}
              
              {day.meals.dinner && (
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6">
                    <Beef className="h-5 w-5 text-tripmancer-blue-dark dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium dark:text-gray-200">Dinner</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{day.meals.dinner}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItineraryDay;
