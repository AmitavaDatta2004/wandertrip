
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Newspaper } from 'lucide-react';
import { NewsItem } from '@/lib/tripPlanner';

type DestinationNewsProps = {
  news: NewsItem[];
  destination: string;
};

const DestinationNews = ({ news, destination }: DestinationNewsProps) => {
  // Ensure news is always an array
  const newsItems = Array.isArray(news) ? news : [
    {
      title: `Latest updates from ${destination}`,
      description: "No news available at the moment.",
      url: "#",
      source: "Local News"
    }
  ];

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border-none">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-tripmancer-blue-dark dark:text-blue-400" />
          <CardTitle className="text-2xl dark:text-white">Latest News from {destination}</CardTitle>
        </div>
        <CardDescription className="dark:text-gray-300">
          Stay updated with the latest news and events
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {newsItems.map((item, index) => (
            <a
              key={index}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-gray-50 dark:bg-gray-700/40 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/60 transition-colors"
            >
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {item.description}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Source: {item.source}
              </p>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DestinationNews;
