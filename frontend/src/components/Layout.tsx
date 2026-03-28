import React from 'react';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showNavigation = true }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-beige-50">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-beige-200/30 to-cream-300/30 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-sage-200/20 to-beige-200/20 rounded-full blur-lg"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-cream-200/25 to-beige-200/25 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-gradient-to-br from-beige-300/20 to-sage-200/20 rounded-full blur-xl"></div>
      </div>

      {showNavigation && (
        <nav className="relative z-10 bg-white/80 backdrop-blur-sm border-b border-cream-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <motion.div 
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-beige-400 to-beige-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">E</span>
                </div>
                <span className="font-display font-semibold text-xl text-gray-800">EchoPath</span>
              </motion.div>
              
              <motion.div 
                className="flex items-center space-x-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <button className="text-gray-600 hover:text-beige-600 transition-colors">
                  <span className="sr-only">Settings</span>
                  ⚙️
                </button>
                <button className="text-gray-600 hover:text-beige-600 transition-colors">
                  <span className="sr-only">Help</span>
                  ❓
                </button>
              </motion.div>
            </div>
          </div>
        </nav>
      )}

      <main className="relative z-10">
        {children}
      </main>
    </div>
  );
};

export default Layout;