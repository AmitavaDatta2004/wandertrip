
import React from 'react';
import { Heart, Map, Luggage } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: <Heart className="w-12 h-12 text-tripmancer-pink-dark dark:text-pink-400" />,
      title: "Share Your Mood",
      description: "Tell us how you're feeling or what kind of experience you're craving."
    },
    {
      icon: <Map className="w-12 h-12 text-tripmancer-purple-dark dark:text-purple-400" />,
      title: "AI Creates Your Plan",
      description: "Our AI analyzes your mood and crafts personalized destinations and activities."
    },
    {
      icon: <Luggage className="w-12 h-12 text-tripmancer-blue-dark dark:text-blue-400" />,
      title: "Explore Your Journey",
      description: "Get a complete itinerary, packing list, and inspiration for your perfect trip."
    }
  ];

  return (
    <section id="features" className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold dark:text-white">How TripMancer Works</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
            Our AI-powered platform transforms your emotions into the perfect travel experience
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white dark:bg-gray-700 rounded-xl p-8 text-center shadow-lg border-none transform transition duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
