
// This file contains route definitions for the application
// Make sure to add the Hotels route to your App.tsx file:
// 
// import Hotels from '@/pages/Hotels';
// 
// Add this route in your Routes component:
// <Route path="/hotels" element={<Hotels />} />

export const routes = [
  { path: '/', component: 'Index' },
  { path: '/packages', component: 'TravelPackages' },
  { path: '/hotels', component: 'Hotels' },
  { path: '/generate', component: 'GenerateTrip' },
  { path: '/login', component: 'Login' },
  { path: '/signup', component: 'Signup' },
  { path: '/dashboard', component: 'Dashboard' },
  { path: '/results', component: 'Results' },
  { path: '/poster', component: 'Poster' },
  { path: '*', component: 'NotFound' }
];
