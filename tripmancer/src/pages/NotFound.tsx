
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-2 px-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-tripmancer-purple rounded-full flex items-center justify-center animate-float">
            <Globe className="w-14 h-14 text-white" />
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-700 mb-8">Oops! This destination isn't on our map.</p>
        <Button asChild size="lg" className="rounded-lg">
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
