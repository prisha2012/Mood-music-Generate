import React from 'react';
import { motion } from 'framer-motion';
import { Mood } from '../types';
import { MOODS } from '../utils/constants';

interface MoodSelectorProps {
  selectedMood: Mood | null;
  onMoodSelect: (mood: Mood) => void;
  isLoading: boolean;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({ 
  selectedMood, 
  onMoodSelect, 
  isLoading 
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <motion.h2 
        className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        How are you feeling today?
      </motion.h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {MOODS.map((mood, index) => (
          <motion.button
            key={mood.id}
            onClick={() => !isLoading && onMoodSelect(mood)}
            className={`
              relative p-6 md:p-8 rounded-2xl shadow-xl backdrop-blur-md border border-white/30 
              transition-all duration-300 group overflow-hidden
              ${selectedMood?.id === mood.id 
                ? `bg-gradient-to-br ${mood.gradient} text-white` 
                : 'bg-white/10 dark:bg-white/5 text-gray-900 dark:text-white hover:bg-white/20 dark:hover:bg-white/10 border-white/20 dark:border-white/10'
              }
              ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
            `}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={!isLoading ? { scale: 1.05 } : {}}
            whileTap={!isLoading ? { scale: 0.98 } : {}}
            disabled={isLoading}
          >
            {/* Gradient overlay for hover effect */}
            <div className={`
              absolute inset-0 bg-gradient-to-br ${mood.gradient} opacity-0 
              group-hover:opacity-30 transition-opacity duration-300
            `} />
            
            <div className="relative z-10 text-center">
              <div className="text-4xl md:text-5xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                {mood.emoji}
              </div>
              <div className="text-lg md:text-xl font-semibold">
                {mood.name}
              </div>
            </div>
            
            {selectedMood?.id === mood.id && (
              <motion.div
                className="absolute inset-0 border-2 border-white/60 rounded-2xl shadow-lg"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};