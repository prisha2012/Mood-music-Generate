import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Music, Quote, Sparkles } from 'lucide-react';

export const About: React.FC = () => {
  const features = [
    {
      icon: Heart,
      title: 'Mood-Based Experience',
      description: 'Select your current mood and discover content that resonates with your feelings.'
    },
    {
      icon: Music,
      title: 'Curated Music',
      description: 'Enjoy carefully selected YouTube music playlists that match your emotional state.'
    },
    {
      icon: Quote,
      title: 'Inspirational Quotes',
      description: 'Get motivated with quotes that align with your mood from renowned authors and thinkers.'
    },
    {
      icon: Sparkles,
      title: 'Save Favorites',
      description: 'Keep track of your favorite quotes and music tracks for easy access anytime.'
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
          About Mood Vibes
        </h1>
        <p className="text-xl text-white/80 max-w-3xl mx-auto">
          Your personal companion for discovering music and wisdom that matches your emotional journey
        </p>
      </motion.div>

      {/* Mission Statement */}
      <motion.div 
        className="bg-white/15 dark:bg-black/25 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 p-8 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
        <p className="text-white/90 text-lg leading-relaxed">
          We believe that music and words have the power to transform our emotional state and inspire positive change. 
          Mood Vibes was created to help you connect with content that not only matches how you feel but also 
          supports your emotional well-being and personal growth.
        </p>
      </motion.div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              className="bg-white/15 dark:bg-black/25 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-white/20 dark:bg-black/30 rounded-xl shadow-md">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {feature.title}
                </h3>
              </div>
              <p className="text-white/85">
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Call to Action */}
      <motion.div 
        className="text-center py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p className="text-lg text-white/85 mb-6 font-medium">
          Ready to explore your emotional landscape through music and wisdom?
        </p>
        <motion.div
          className="inline-block px-8 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-lg rounded-2xl border border-white/25 transition-all duration-200 cursor-pointer shadow-xl hover:shadow-2xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-white font-bold">
            Start Your Journey
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
};