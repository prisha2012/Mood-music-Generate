import React from 'react';
import { motion } from 'framer-motion';
import { MousePointer, Music, Quote, Heart, Share2, RefreshCw } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: MousePointer,
      title: 'Select Your Mood',
      description: 'Choose from six different mood options: Happy, Sad, Calm, Energetic, Romantic, or Motivated.',
      details: 'Each mood is represented by an expressive emoji and triggers a unique color theme throughout the app.'
    },
    {
      icon: Music,
      title: 'Discover Music',
      description: 'Get a curated YouTube music playlist that matches your selected mood.',
      details: 'Watch embedded videos directly in the app or open them in YouTube Music for a full listening experience.'
    },
    {
      icon: Quote,
      title: 'Get Inspired',
      description: 'Receive a motivational quote that aligns with your current emotional state.',
      details: 'Quotes are sourced from the Quotable API and filtered by mood-specific tags for relevance.'
    },
    {
      icon: RefreshCw,
      title: 'Explore More',
      description: 'Use the "New Quote" button to discover additional inspiring quotes for your mood.',
      details: 'Each mood has access to hundreds of relevant quotes from famous authors, philosophers, and thought leaders.'
    },
    {
      icon: Heart,
      title: 'Save Favorites',
      description: 'Click the heart icon to save your favorite quotes and music tracks.',
      details: 'Your favorites are stored locally and can be accessed anytime from the Favorites page.'
    },
    {
      icon: Share2,
      title: 'Share & Connect',
      description: 'Share meaningful quotes with friends via Twitter or WhatsApp.',
      details: 'Spread positivity and inspiration by sharing quotes that resonate with you on social media.'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          How It Works
        </h1>
        <p className="text-xl text-white/80 max-w-3xl mx-auto">
          Discover how Mood Vibes creates a personalized experience based on your emotions
        </p>
      </motion.div>

      {/* Steps */}
      <div className="max-w-4xl mx-auto space-y-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.title}
              className="bg-white/15 dark:bg-black/25 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 p-6"
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start space-x-4">
                {/* Step Number & Icon */}
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 bg-white/25 dark:bg-black/30 rounded-full mb-2 shadow-md">
                    <span className="text-white font-bold text-lg">{index + 1}</span>
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-lg">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-white/90 text-lg mb-3">
                    {step.description}
                  </p>
                  <p className="text-white/75">
                    {step.details}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Features Highlight */}
      <motion.div 
        className="bg-white/15 dark:bg-black/25 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 p-8 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <h2 className="text-2xl font-bold text-white mb-4 text-center">
          Additional Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-3xl mb-2">🌙</div>
            <h4 className="text-white font-semibold mb-1">Dark/Light Mode</h4>
            <p className="text-white/80 text-sm">
              Toggle between themes for comfortable viewing anytime
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">📱</div>
            <h4 className="text-white font-semibold mb-1">Responsive Design</h4>
            <p className="text-white/80 text-sm">
              Perfect experience on mobile, tablet, and desktop
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">✨</div>
            <h4 className="text-white font-semibold mb-1">Smooth Animations</h4>
            <p className="text-white/80 text-sm">
              Beautiful transitions and interactions throughout
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🎨</div>
            <h4 className="text-white font-semibold mb-1">Dynamic Themes</h4>
            <p className="text-white/80 text-sm">
              Background changes based on your selected mood
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};