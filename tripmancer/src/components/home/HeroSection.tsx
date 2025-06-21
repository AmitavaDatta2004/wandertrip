
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin, Calendar, Package, Hotel } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-16 md:py-24 bg-gradient-to-br from-tripmancer-purple/5 via-tripmancer-blue/5 to-tripmancer-pink/5 dark:from-tripmancer-purple/10 dark:via-tripmancer-blue/10 dark:to-tripmancer-pink/10 overflow-hidden">
      {/* Background Elements with More Color */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-teal-400/20 to-green-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="container max-w-6xl mx-auto text-center relative z-10">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-white/80 to-purple-50/80 dark:from-gray-800/80 dark:to-purple-900/80 backdrop-blur-sm border border-tripmancer-purple/20 dark:border-tripmancer-purple/40 mb-6 shadow-lg">
            <MapPin className="h-4 w-4 text-tripmancer-purple-dark" />
            <span className="text-sm font-medium bg-gradient-to-r from-tripmancer-purple-dark to-tripmancer-blue-dark bg-clip-text text-transparent">AI-Powered Travel Planning</span>
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-tripmancer-purple-dark via-tripmancer-blue-dark to-tripmancer-pink-dark bg-clip-text text-transparent">
            Plan Your Perfect
          </span>
          <br />
          <span className="text-gray-900 dark:text-white">
            Adventure
          </span>
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          Discover amazing destinations, find luxury hotels, create personalized itineraries, and make unforgettable memories with our AI-powered travel companion.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Link to="/generate">
            <Button size="lg" className="px-8 py-4 text-lg rounded-full bg-gradient-to-r from-tripmancer-purple-dark to-tripmancer-blue-dark hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto">
              Start Planning
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          
          <Link to="/packages">
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg rounded-full border-2 border-tripmancer-purple-dark text-tripmancer-purple-dark hover:bg-tripmancer-purple-dark hover:text-white dark:border-tripmancer-purple dark:text-tripmancer-purple dark:hover:bg-tripmancer-purple transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto">
              <Package className="mr-2 h-5 w-5" />
              Browse Packages
            </Button>
          </Link>

          <Link to="/hotels">
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg rounded-full border-2 border-tripmancer-pink-dark text-tripmancer-pink-dark hover:bg-tripmancer-pink-dark hover:text-white dark:border-tripmancer-pink dark:text-tripmancer-pink dark:hover:bg-tripmancer-pink transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto">
              <Hotel className="mr-2 h-5 w-5" />
              Find Hotels
            </Button>
          </Link>
        </div>

        {/* Enhanced Feature Stats with Colors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-2xl mx-auto">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-100/60 to-pink-100/60 dark:from-purple-900/60 dark:to-pink-900/60 backdrop-blur-sm border border-purple-200/50 dark:border-purple-700/50 hover:scale-105 transition-transform duration-300 shadow-lg">
            <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">50K+</div>
            <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Destinations</div>
          </div>
          
          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-100/60 to-cyan-100/60 dark:from-blue-900/60 dark:to-cyan-900/60 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50 hover:scale-105 transition-transform duration-300 shadow-lg">
            <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">100K+</div>
            <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Happy Travelers</div>
          </div>
          
          <div className="p-6 rounded-2xl bg-gradient-to-br from-teal-100/60 to-green-100/60 dark:from-teal-900/60 dark:to-green-900/60 backdrop-blur-sm border border-teal-200/50 dark:border-teal-700/50 hover:scale-105 transition-transform duration-300 shadow-lg">
            <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-teal-600 to-green-600 bg-clip-text text-transparent mb-2">4.9★</div>
            <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Average Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
