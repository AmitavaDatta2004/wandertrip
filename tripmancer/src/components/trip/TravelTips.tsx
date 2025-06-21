
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';

type TravelTipsProps = {
  tips: string[];
};

const TravelTips = ({ tips }: TravelTipsProps) => {
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border-none">
      <CardHeader>
        <CardTitle className="text-2xl dark:text-white">Travel Tips</CardTitle>
        <CardDescription className="dark:text-gray-300">
          Practical advice to make your trip smoother
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tips?.map((tip, index) => (
            <div key={index} className="flex items-start gap-3 bg-gray-50 dark:bg-gray-700/40 p-4 rounded-lg">
              <div className="flex-shrink-0 mt-1">
                <ShieldCheck className="h-5 w-5 text-tripmancer-purple-dark dark:text-purple-400" />
              </div>
              <p className="text-gray-700 dark:text-gray-300">{tip}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TravelTips;
