
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

type PackingListProps = {
  items: string[];
};

const PackingList = ({ items }: PackingListProps) => {
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});

  const handleCheckItem = (item: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border-none">
      <CardHeader>
        <CardTitle className="text-2xl dark:text-white">Packing List</CardTitle>
        <CardDescription className="dark:text-gray-300">
          Everything you'll need for your trip
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item, index) => (
            <div key={index} className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-700/40 p-3 rounded-lg">
              <Checkbox 
                id={`packing-item-${index}`}
                checked={checkedItems[item] || false}
                onCheckedChange={() => handleCheckItem(item)}
              />
              <label
                htmlFor={`packing-item-${index}`}
                className={`text-gray-700 dark:text-gray-300 cursor-pointer ${
                  checkedItems[item] ? 'line-through opacity-70' : ''
                }`}
              >
                {item}
              </label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PackingList;
