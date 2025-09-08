import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Home, Info, HelpCircle } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
  backgroundGradient?: string;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentPage, 
  onPageChange, 
  backgroundGradient = 'from-purple-400 via-pink-500 to-red-500' 
}) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'about', label: 'About', icon: Info },
    { id: 'how-it-works', label: 'How It Works', icon: HelpCircle },
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${backgroundGradient} transition-all duration-1000`}>
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-black/10 dark:bg-black/30" />
      <div className="fixed inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />
      
      {/* Navigation */}
      <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
        <motion.div 
          className="flex items-center space-x-2 bg-white/15 dark:bg-black/25 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 px-4 py-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-xl transition-all
                  ${isActive 
                    ? 'bg-white/25 text-gray-900 dark:text-white shadow-lg' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white/15 hover:text-gray-900 dark:hover:text-white'
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:block">
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </motion.div>
      </nav>
      
      {/* Main Content */}
      <main className="relative z-10 pt-8 pb-24 px-4">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};