
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { motion } from '@/components/ui/motion';

const HeroSection = () => {
  return (
    <section className="relative py-20 px-4 bg-gradient-2 dark:bg-gradient-to-b dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h1 className="text-4xl md:text-6xl font-bold leading-tight dark:text-white">
              Travel Based on <span className="text-tripmancer-purple-dark dark:text-purple-400">How You Feel</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
              Share your mood, and we'll craft the perfect getaway experience tailored just for you.
            </p>
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
              <Button size="lg" className="rounded-full px-8" asChild>
                <Link to="/generate">Find My Trip</Link>
              </Button>
              <Button variant="outline" size="lg" className="rounded-full px-8 dark:text-white dark:border-white" asChild>
                <Link to="/dashboard">My Trips</Link>
              </Button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative h-80 md:h-96"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-tripmancer-pink rounded-full opacity-30 animate-float dark:bg-pink-700 dark:opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-tripmancer-blue rounded-full opacity-30 animate-float dark:bg-blue-700 dark:opacity-20" style={{ animationDelay: '2s' }}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Globe className="w-40 h-40 text-tripmancer-purple-dark animate-spin-slow dark:text-purple-400" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
