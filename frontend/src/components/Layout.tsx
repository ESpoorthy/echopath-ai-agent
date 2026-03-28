import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import NotificationCenter from './NotificationCenter.tsx';
import { Bell } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showNavigation = true }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Mock notifications
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'achievement' as const,
      title: 'New Badge Earned!',
      message: 'You earned the "Consistency Champion" badge for practicing 7 days in a row!',
      timestamp: new Date().toISOString(),
      read: false,
      icon: '🏆'
    },
    {
      id: '2',
      type: 'progress' as const,
      title: 'Great Progress!',
      message: 'Your accuracy improved by 15% this week. Keep up the excellent work!',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      read: false
    },
    {
      id: '3',
      type: 'reminder' as const,
      title: 'Practice Reminder',
      message: "Don't forget to practice today to maintain your streak!",
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      read: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };
  return (
    <div className="min-h-screen bg-warm-gradient">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-orange-100/30 to-yellow-100/30 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-beige-200/20 to-cream-200/20 rounded-full blur-lg"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-cream-200/25 to-orange-100/25 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-gradient-to-br from-yellow-100/20 to-beige-200/20 rounded-full blur-xl"></div>
      </div>

      {showNavigation && (
        <nav className="relative z-10 bg-white/85 backdrop-blur-md border-b border-pink-200/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <motion.div 
                className="flex items-center space-x-3 cursor-pointer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                onClick={() => navigate('/')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-pink-300 to-orange-300 rounded-lg flex items-center justify-center">
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
                <div className="relative">
                  <motion.button 
                    onClick={() => setShowNotifications(true)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Bell size={20} className="text-gray-600" />
                    {unreadCount > 0 && (
                      <motion.div
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      >
                        <span className="text-xs text-white font-bold">{unreadCount}</span>
                      </motion.div>
                    )}
                  </motion.button>
                </div>
                <button 
                  onClick={() => window.location.href = '/therapist'}
                  className="text-gray-600 hover:text-orange-600 transition-colors text-sm font-medium"
                >
                  Therapist View
                </button>
                <button className="text-gray-600 hover:text-orange-600 transition-colors">
                  <span className="sr-only">Settings</span>
                  ⚙️
                </button>
                <button className="text-gray-600 hover:text-orange-600 transition-colors">
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

      {/* Footer */}
      <footer className="relative z-10 bg-white/60 backdrop-blur-md border-t border-pink-200/30 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-2"
          >
            <p className="text-gray-600 text-sm">
              EchoPath AI - Where technology meets compassionate care.
            </p>
            <p className="text-gray-700 font-medium">
              Built with ❤️ for children, families, and speech-language pathologists worldwide.
            </p>
          </motion.div>
        </div>
      </footer>

      {/* Notification Center */}
      <NotificationCenter
        show={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
      />
    </div>
  );
};

export default Layout;