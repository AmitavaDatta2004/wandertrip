
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sun, Cloud, CloudRain, Wind, Thermometer, Eye } from 'lucide-react';
import { fetchDestinationWeather, WeatherData } from '@/lib/services/newsService';

type WeatherWidgetProps = {
  destination: string;
  travelTime?: string;
};

const WeatherWidget = ({ destination, travelTime = 'now' }: WeatherWidgetProps) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWeather = async () => {
      try {
        console.log('Loading weather for:', destination, travelTime);
        const weatherData = await fetchDestinationWeather(destination, travelTime);
        console.log('Received weather data:', weatherData);
        
        // Validate the weather data structure
        if (!weatherData || !weatherData.current || !weatherData.forecast) {
          throw new Error('Invalid weather data structure');
        }
        
        setWeather(weatherData);
        setError(null);
      } catch (error) {
        console.error('Error loading weather:', error);
        setError('Failed to load weather data');
        setWeather(null);
      } finally {
        setLoading(false);
      }
    };

    if (destination) {
      loadWeather();
    }
  }, [destination, travelTime]);

  const getWeatherIcon = (iconName?: string) => {
    if (!iconName) return <Sun className="h-8 w-8 text-yellow-500" />;
    
    switch (iconName) {
      case 'sun': return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'cloud': return <Cloud className="h-8 w-8 text-gray-500" />;
      case 'cloud-sun': return <Sun className="h-8 w-8 text-yellow-400" />;
      case 'cloud-rain': return <CloudRain className="h-8 w-8 text-blue-500" />;
      case 'wind': return <Wind className="h-8 w-8 text-gray-600" />;
      default: return <Sun className="h-8 w-8 text-yellow-500" />;
    }
  };

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-none shadow-lg">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !weather || !weather.current || !weather.forecast) {
    return (
      <Card className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-none shadow-lg">
        <CardContent className="p-6">
          <div className="text-center">
            <Thermometer className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {error || 'Weather data unavailable'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-none shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <Thermometer className="h-5 w-5 text-blue-600" />
          Weather in {destination}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Weather */}
        <div className="flex items-center justify-between p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg backdrop-blur-sm">
          <div className="flex items-center gap-3">
            {getWeatherIcon(weather.current?.icon)}
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {weather.current?.temperature || 'N/A'}°C
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {weather.current?.condition || 'Unknown'}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Current
          </Badge>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 p-3 bg-white/40 dark:bg-gray-800/40 rounded-lg">
            <Eye className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Humidity</p>
              <p className="font-semibold text-gray-800 dark:text-white">
                {weather.current?.humidity || 'N/A'}%
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-white/40 dark:bg-gray-800/40 rounded-lg">
            <Wind className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Wind</p>
              <p className="font-semibold text-gray-800 dark:text-white">
                {weather.current?.windSpeed || 'N/A'} km/h
              </p>
            </div>
          </div>
        </div>

        {/* Forecast */}
        <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getWeatherIcon(weather.forecast?.icon)}
              <div>
                <p className="font-semibold text-gray-800 dark:text-white">
                  Expected: {weather.forecast?.temperature || 'N/A'}°C
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {weather.forecast?.condition || 'Unknown'}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="border-purple-300 text-purple-700 dark:border-purple-600 dark:text-purple-300">
              Travel Time
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
