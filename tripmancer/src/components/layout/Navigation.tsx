
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Globe, User, LogOut, PlusCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const Navigation = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="flex items-center space-x-6">
      <Link 
        to="/" 
        className="text-sm font-medium transition-colors hover:text-primary dark:text-gray-200"
      >
        Home
      </Link>
      <Link 
        to="/generate" 
        className="text-sm font-medium transition-colors hover:text-primary dark:text-gray-200"
      >
        Generate Trip
      </Link>
      
      {user ? (
        <>
          <Link 
            to="/dashboard" 
            className="text-sm font-medium transition-colors hover:text-primary dark:text-gray-200"
          >
            My Trips
          </Link>
          <div className="flex items-center space-x-3">
            <Link 
              to="/dashboard" 
              className="flex items-center gap-2 text-sm font-medium dark:text-gray-200"
            >
              <div className="w-8 h-8 rounded-full bg-tripmancer-purple/20 dark:bg-purple-900/20 flex items-center justify-center">
                <User size={16} className="text-tripmancer-purple-dark dark:text-purple-400" />
              </div>
              <span className="hidden md:inline">{user.email?.split('@')[0]}</span>
            </Link>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleSignOut}
              aria-label="Sign out"
              className="hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
            >
              <LogOut className="h-4 w-4 dark:text-gray-300" />
            </Button>
          </div>
        </>
      ) : (
        <>
          <Link 
            to="/login" 
            className="text-sm font-medium transition-colors hover:text-primary dark:text-gray-200"
          >
            Log in
          </Link>
          <Link to="/signup">
            <Button size="sm" className="rounded-full px-6 bg-gradient-to-r from-tripmancer-purple-dark to-tripmancer-blue-dark hover:opacity-90 dark:from-purple-700 dark:to-blue-700">Sign Up</Button>
          </Link>
        </>
      )}
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate('/generate')}
        className="hidden md:flex items-center space-x-1 rounded-full dark:text-gray-200 dark:border-gray-600"
      >
        <PlusCircle className="h-4 w-4 mr-1" />
        New Trip
      </Button>
    </nav>
  );
};
