
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Route } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet - TypeScript compatible approach
const defaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

// This component sets the view when the map is ready
function SetViewOnLoad({ coords }: { coords: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(coords, 5);
  }, [map, coords]);
  
  return null;
}

type MapViewProps = {
  destinations: Array<{
    name: string;
    coordinates?: { lat: number; lng: number };
    pointsOfInterest?: Array<{
      name: string;
      coordinates: { lat: number; lng: number };
    }>;
  }>;
  activeDestinationIndex: number;
};

const MapView = ({ destinations, activeDestinationIndex }: MapViewProps) => {
  const validDestinations = destinations.filter(dest => dest.coordinates);
  const activeDestination = destinations[activeDestinationIndex];
  
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return Math.round(d);
  };
  
  const deg2rad = (deg: number) => {
    return deg * (Math.PI/180);
  };

  // Create route lines between points of interest
  const routeLines = [];
  
  // If we have an active destination with coordinates and points of interest
  if (activeDestination?.coordinates && activeDestination?.pointsOfInterest?.length > 0) {
    const origin = activeDestination.coordinates;
    
    // Create routes from the main destination to each point of interest
    for (let i = 0; i < activeDestination.pointsOfInterest.length; i++) {
      const poi = activeDestination.pointsOfInterest[i];
      const distance = calculateDistance(origin.lat, origin.lng, poi.coordinates.lat, poi.coordinates.lng);
      
      routeLines.push({
        points: [[origin.lat, origin.lng], [poi.coordinates.lat, poi.coordinates.lng]],
        distance: distance
      });
    }
  }

  // Get default center coordinates for the map
  const defaultPosition: [number, number] = activeDestination?.coordinates
    ? [activeDestination.coordinates.lat, activeDestination.coordinates.lng]
    : validDestinations.length > 0
      ? [validDestinations[0].coordinates!.lat, validDestinations[0].coordinates!.lng]
      : [0, 0];

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border-none mb-8">
      <CardHeader>
        <CardTitle className="text-2xl dark:text-white">
          {activeDestination ? `Map of ${activeDestination.name}` : 'Interactive Itinerary Map'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-[500px] w-full rounded-lg overflow-hidden">
          <MapContainer 
            style={{ height: '100%', width: '100%' }}
          >
            <SetViewOnLoad coords={defaultPosition} />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {activeDestination?.coordinates && (
              <Marker 
                position={[activeDestination.coordinates.lat, activeDestination.coordinates.lng] as [number, number]}
              >
                <Popup>
                  <b>{activeDestination.name}</b>
                </Popup>
              </Marker>
            )}
            
            {activeDestination?.pointsOfInterest?.map((poi, poiIdx) => (
              <Marker 
                key={`poi-${poiIdx}`}
                position={[poi.coordinates.lat, poi.coordinates.lng] as [number, number]}
              >
                <Popup>
                  <b>{poi.name}</b>
                </Popup>
              </Marker>
            ))}
            
            {routeLines.map((route, idx) => (
              <React.Fragment key={`route-${idx}`}>
                <Polyline 
                  positions={route.points as L.LatLngExpression[]} 
                  pathOptions={{ color: '#DC2626', weight: 3, dashArray: '5, 10' }}
                />
              </React.Fragment>
            ))}
          </MapContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/40 p-3 rounded-lg">
            <MapPin className="h-5 w-5 text-red-600" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Destination</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/40 p-3 rounded-lg">
            <Route className="h-5 w-5 text-red-600" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Travel Route</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapView;
