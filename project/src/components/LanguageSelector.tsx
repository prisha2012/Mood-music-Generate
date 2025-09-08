import React from 'react';
import { motion } from 'framer-motion';
import { Language } from '../hooks/useLanguage';
import { LANGUAGE_OPTIONS } from '../utils/constants';

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange,
}) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
        Choose Your Music Language
      </h3>
      <div className="grid grid-cols-1 gap-3">
        {LANGUAGE_OPTIONS.map((language) => (
          <motion.button
            key={language.id}
            onClick={() => onLanguageChange(language.id)}
            className={`p-4 rounded-xl border-2 transition-all duration-300 ${
              selectedLanguage === language.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-blue-300 hover:bg-blue-25 dark:hover:bg-blue-900/10'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{language.flag}</span>
                <div className="text-left">
                  <div className="font-medium">{language.name}</div>
                  <div className="text-sm opacity-70">{language.description}</div>
                </div>
              </div>
              {selectedLanguage === language.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </motion.div>
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};