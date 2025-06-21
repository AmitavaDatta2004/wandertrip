
import React from 'react';
import { motion } from '@/components/ui/motion';

type TripHeaderProps = {
  title: string;
  quote: string;
};

const TripHeader = ({ title, quote }: TripHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-12 relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-tripmancer-blue/20 via-tripmancer-purple/20 to-tripmancer-pink/20 blur-3xl -z-10" />
      <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-tripmancer-purple-dark via-tripmancer-blue-dark to-tripmancer-pink-dark bg-clip-text text-transparent animate-fade-in">
        {title}
      </h1>
      <p className="text-gray-700 dark:text-gray-300 mt-6 italic text-lg max-w-3xl mx-auto animate-fade-in delay-100">
        "{quote}"
      </p>
    </motion.div>
  );
};

export default TripHeader;
