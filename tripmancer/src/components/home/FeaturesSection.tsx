
import React from 'react';
import { MapPin, Calendar, Users, Package, Star, Globe, Hotel } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const FeaturesSection = () => {
  const features = [
    {
      icon: <MapPin className="h-8 w-8 text-tripmancer-purple-dark" />,
      title: "AI Trip Planning",
      description: "Get personalized itineraries tailored to your preferences, budget, and travel style using advanced AI technology.",
      gradient: "from-purple-500/10 to-blue-500/10",
    },
    {
      icon: <Package className="h-8 w-8 text-tripmancer-blue-dark" />,
      title: "Curated Packages",
      description: "Browse our handpicked travel packages featuring the best destinations, accommodations, and experiences worldwide.",
      gradient: "from-blue-500/10 to-cyan-500/10",
    },
    {
      icon: <Hotel className="h-8 w-8 text-tripmancer-pink-dark" />,
      title: "Premium Hotels",
      description: "Discover exceptional accommodations from luxury resorts to boutique hotels with world-class amenities and service.",
      gradient: "from-pink-500/10 to-rose-500/10",
    },
    {
      icon: <Calendar className="h-8 w-8 text-tripmancer-purple-dark" />,
      title: "Smart Scheduling",
      description: "Optimize your travel time with intelligent scheduling that considers weather, crowds, and local events.",
      gradient: "from-violet-500/10 to-purple-500/10",
    },
    {
      icon: <Users className="h-8 w-8 text-tripmancer-blue-dark" />,
      title: "Group Planning",
      description: "Coordinate trips with friends and family seamlessly with our collaborative planning tools.",
      gradient: "from-teal-500/10 to-green-500/10",
    },
    {
      icon: <Star className="h-8 w-8 text-tripmancer-pink-dark" />,
      title: "Expert Recommendations",
      description: "Discover hidden gems and local favorites with recommendations from travel experts and locals.",
      gradient: "from-orange-500/10 to-yellow-500/10",
    },
  ];

  return (
    <section className="py-16 md:py-24 px-4 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10 transition-colors">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-tripmancer-purple-dark via-tripmancer-blue-dark to-tripmancer-pink-dark bg-clip-text text-transparent">
            Why Choose TripMancer?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Experience the future of travel planning with our comprehensive suite of tools and services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group p-6 rounded-2xl bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 hover:border-tripmancer-purple/30 dark:hover:border-tripmancer-purple/50`}
            >
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.gradient} dark:from-tripmancer-purple/20 dark:to-tripmancer-blue/20 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/generate">
              <Button size="lg" className="px-8 py-3 rounded-full bg-gradient-to-r from-tripmancer-purple-dark to-tripmancer-blue-dark hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl">
                Start Planning Now
              </Button>
            </Link>
            <Link to="/packages">
              <Button variant="outline" size="lg" className="px-8 py-3 rounded-full border-2 border-tripmancer-purple-dark text-tripmancer-purple-dark hover:bg-tripmancer-purple-dark hover:text-white dark:border-tripmancer-purple dark:text-tripmancer-purple dark:hover:bg-tripmancer-purple shadow-lg hover:shadow-xl">
                Browse Packages
              </Button>
            </Link>
            <Link to="/hotels">
              <Button variant="outline" size="lg" className="px-8 py-3 rounded-full border-2 border-tripmancer-pink-dark text-tripmancer-pink-dark hover:bg-tripmancer-pink-dark hover:text-white dark:border-tripmancer-pink dark:text-tripmancer-pink dark:hover:bg-tripmancer-pink shadow-lg hover:shadow-xl">
                Find Hotels
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
