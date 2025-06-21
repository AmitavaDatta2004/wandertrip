
import React from 'react';
import { Heart } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "TripMancer knew exactly what I needed when I said I was feeling burnt out. My relaxing beach getaway was perfect!",
      name: "Sarah J.",
      mood: "Burnt out"
    },
    {
      quote: "I told TripMancer I was feeling adventurous and it suggested hiking in Patagonia - the trip of a lifetime!",
      name: "Michael T.",
      mood: "Adventurous"
    },
    {
      quote: "Our anniversary trip was magical thanks to TripMancer's romantic suggestions. The AI understood exactly what we wanted.",
      name: "Emily & David",
      mood: "Romantic"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold dark:text-white">What Our Travelers Say</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Discover how TripMancer has transformed travel experiences
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white dark:bg-gray-700 rounded-xl shadow-lg border-none p-8">
              <div className="flex justify-center mb-6">
                <div className="rounded-full bg-tripmancer-purple/10 dark:bg-purple-900/30 p-3">
                  <Heart className="w-6 h-6 text-tripmancer-purple-dark dark:text-purple-400" />
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic mb-6">"{testimonial.quote}"</p>
              <div>
                <p className="font-semibold dark:text-white">{testimonial.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Mood: {testimonial.mood}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
