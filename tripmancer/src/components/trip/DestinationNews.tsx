
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Newspaper, Calendar, Flag, Sun, Info } from 'lucide-react';
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
      source: "Local News",
      category: "general"
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'tourism': return <Sun className="h-4 w-4" />;
      case 'events': return <Calendar className="h-4 w-4" />;
      case 'travel-advisory': return <Flag className="h-4 w-4" />;
      case 'culture': return <Info className="h-4 w-4" />;
      default: return <Newspaper className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'tourism': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'events': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'travel-advisory': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'culture': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 shadow-lg rounded-xl border-none hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Newspaper className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Travel News: {destination}
          </CardTitle>
        </div>
        <CardDescription className="dark:text-gray-300 text-gray-600">
          Stay informed with the latest travel updates, events, and local insights
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
              className="block p-5 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg border border-white/50 dark:border-gray-700/50"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getCategoryIcon(item.category || 'general')}
                    <Badge className={`text-xs font-medium ${getCategoryColor(item.category || 'general')} border-none`}>
                      {item.category || 'General'}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      Source: {item.source}
                    </p>
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400"></div>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DestinationNews;
