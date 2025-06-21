
import React from 'react';
import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t py-12 dark:border-gray-800 dark:bg-gray-900">
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-8 max-w-screen-xl">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-tripmancer-purple to-tripmancer-blue-dark flex items-center justify-center">
              <Globe className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg font-poppins dark:text-white">TripMancer</span>
          </div>
          <p className="text-sm text-muted-foreground dark:text-gray-400">
            Your Feelings. Your Destination. Let your mood guide your next adventure.
          </p>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4 dark:text-white">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-gray-200">Home</Link></li>
            <li><Link to="/generate" className="text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-gray-200">Generate Trip</Link></li>
            <li><Link to="/dashboard" className="text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-gray-200">My Trips</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4 dark:text-white">Account</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/login" className="text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-gray-200">Login</Link></li>
            <li><Link to="/signup" className="text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-gray-200">Sign Up</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4 dark:text-white">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-gray-200">Privacy Policy</a></li>
            <li><a href="#" className="text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-gray-200">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      
      <div className="container mt-8 pt-8 border-t max-w-screen-xl dark:border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground dark:text-gray-400">
            &copy; {new Date().getFullYear()} TripMancer. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
