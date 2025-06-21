
import React from 'react';
import AppLayout from '@/components/AppLayout';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import CustomizationSection from '@/components/home/CustomizationSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CtaSection from '@/components/home/CtaSection';

const Index = () => {
  return (
    <AppLayout>
      <div className="min-h-screen dark:bg-gray-900 transition-colors">
        <HeroSection />
        <FeaturesSection />
        <CustomizationSection />
        <TestimonialsSection />
        <CtaSection />
      </div>
    </AppLayout>
  );
};

export default Index;
