
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Users, DollarSign, MapPin } from 'lucide-react';

const CustomizationSection = () => {
  const options = [
    {
      icon: <Calendar className="w-10 h-10 text-tripmancer-blue-dark dark:text-blue-400" />,
      title: "Trip Duration",
      description: "Whether it's a quick weekend getaway or a long vacation, customize the length of your trip."
    },
    {
      icon: <Users className="w-10 h-10 text-tripmancer-pink-dark dark:text-pink-400" />,
      title: "Group Size",
      description: "Traveling solo, as a couple, or with friends? We'll adapt recommendations accordingly."
    },
    {
      icon: <DollarSign className="w-10 h-10 text-tripmancer-purple-dark dark:text-purple-400" />,
      title: "Budget Level",
      description: "From budget-friendly to luxury experiences, find options that match your spending comfort."
    },
    {
      icon: <MapPin className="w-10 h-10 text-tripmancer-blue-dark dark:text-blue-400" />,
      title: "Preferred Locations",
      description: "Have a specific region in mind? Let us know and we'll focus our recommendations."
    }
  ];

  return (
    <section className="py-20 px-4 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold dark:text-white">Customize Every Aspect of Your Journey</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
            Tell us exactly what you're looking for and we'll tailor the perfect experience
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {options.map((option, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center shadow border-none">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-white dark:bg-gray-700 shadow-sm">
                  {option.icon}
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2 dark:text-white">{option.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{option.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button size="lg" className="rounded-full px-8" asChild>
            <Link to="/generate">Start Planning Now</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CustomizationSection;
