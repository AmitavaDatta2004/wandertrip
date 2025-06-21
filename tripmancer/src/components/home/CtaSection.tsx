
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CtaSection = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-tripmancer-purple to-tripmancer-blue-dark dark:from-purple-900 dark:to-blue-900 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Turn Your Feelings Into Adventures?</h2>
        <p className="text-lg mb-8 opacity-90">
          Your perfect trip is just a mood away. Let TripMancer guide you to destinations that resonate with your emotions.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button variant="secondary" size="lg" className="rounded-full" asChild>
            <Link to="/generate">Find My Trip</Link>
          </Button>
          <Button variant="outline" size="lg" className="rounded-full bg-transparent text-white border-white hover:bg-white/20" asChild>
            <Link to="/signup">Create Account</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
