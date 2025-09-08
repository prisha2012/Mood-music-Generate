import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoodSelector } from '../components/MoodSelector';
import { LanguageSelector } from '../components/LanguageSelector';
import { QuoteGenerator } from '../components/QuoteGenerator';
import { MusicPlayer } from '../components/MusicPlayer';
import { Mood } from '../types';
import { Language, useLanguage } from '../hooks/useLanguage';

export const Home: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const { selectedLanguage, setSelectedLanguage } = useLanguage();

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood);
    setShowLanguageSelector(true);
    setShowContent(false);
  };

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
    setShowLanguageSelector(false);
    setShowContent(true);
  };

  const handleBackToMoods = () => {
    setSelectedMood(null);
    setShowLanguageSelector(false);
    setShowContent(false);
  };

  const handleBackToLanguages = () => {
    setShowLanguageSelector(true);
    setShowContent(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Mood Vibes
        </h1>
        <p className="text-xl text-white/80 max-w-3xl mx-auto">
          Discover music and quotes that match your emotional journey
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {!selectedMood && (
          <motion.div
            key="mood-selector"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <MoodSelector
              selectedMood={selectedMood}
              onMoodSelect={handleMoodSelect}
              isLoading={false}
            />
          </motion.div>
        )}

        {showLanguageSelector && selectedMood && (
          <motion.div
            key="language-selector"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">
                Perfect! You're feeling {selectedMood.emoji} {selectedMood.name}
              </h2>
              <p className="text-white/80">
                Now choose your preferred music language:
              </p>
            </div>
            
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageChange={handleLanguageSelect}
            />
            
            <div className="text-center">
              <button
                onClick={handleBackToMoods}
                className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-colors"
              >
                ← Back to Moods
              </button>
            </div>
          </motion.div>
        )}

        {showContent && selectedMood && (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">
                {selectedMood.emoji} {selectedMood.name} • {selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)} Music
              </h2>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleBackToLanguages}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors text-sm"
                >
                  Change Language
                </button>
                <button
                  onClick={handleBackToMoods}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors text-sm"
                >
                  Change Mood
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <div>
                <QuoteGenerator mood={selectedMood} />
              </div>
              <div>
                <MusicPlayer mood={selectedMood} language={selectedLanguage} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};