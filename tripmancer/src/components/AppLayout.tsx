
import React from 'react';
import { Header } from './layout/Header';
import { Footer } from './layout/Footer';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900 transition-colors">
      <Header />
      
      <main className="flex-1">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default AppLayout;
