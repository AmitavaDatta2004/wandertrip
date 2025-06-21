
import React from 'react';
import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';
import { Navigation } from './Navigation';
import { ThemeToggle } from './ThemeToggle';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:bg-gray-900/95 dark:border-gray-800/40">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link to="/" className="flex items-center space-x-2 mr-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-tripmancer-purple to-tripmancer-blue-dark flex items-center justify-center">
            <Globe className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-xl font-poppins bg-gradient-to-r from-tripmancer-purple-dark to-tripmancer-blue-dark bg-clip-text text-transparent">TripMancer</span>
        </Link>
        
        <div className="flex-1"></div>
        
        <div className="flex items-center space-x-4">
          <Navigation />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
