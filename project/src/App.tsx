import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Layout } from './components/Layout';
import { ThemeToggle } from './components/ThemeToggle';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { HowItWorks } from './pages/HowItWorks';
import { Favorites } from './components/Favorites';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const getBackgroundGradient = () => {
    switch (currentPage) {
      case 'home':
        return 'from-indigo-500 via-purple-600 to-pink-600';
      case 'favorites':
        return 'from-rose-500 via-pink-600 to-purple-600';
      case 'about':
        return 'from-blue-600 via-indigo-600 to-purple-700';
      case 'how-it-works':
        return 'from-teal-500 via-cyan-600 to-blue-600';
      default:
        return 'from-indigo-500 via-purple-600 to-pink-600';
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'favorites':
        return <Favorites />;
      case 'about':
        return <About />;
      case 'how-it-works':
        return <HowItWorks />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="relative">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <Layout
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        backgroundGradient={getBackgroundGradient()}
      >
        <AnimatePresence mode="wait">
          {renderCurrentPage()}
        </AnimatePresence>
      </Layout>
    </div>
  );
}

export default App;