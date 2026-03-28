import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: '🎯',
      title: 'Personalized Therapy',
      description: 'AI-powered sessions adapt to each child\'s unique learning pace and preferences'
    },
    {
      icon: '📊',
      title: 'Progress Tracking',
      description: 'Real-time analytics help parents and therapists monitor improvement over time'
    },
    {
      icon: '🤖',
      title: 'Multi-Agent AI',
      description: 'Specialized AI agents work together to optimize therapy outcomes'
    },
    {
      icon: '🏆',
      title: 'Engaging Rewards',
      description: 'Gentle gamification keeps children motivated and excited to practice'
    }
  ];

  return (
    <Layout showNavigation={false}>
      <div className="min-h-screen flex flex-col">
        {/* Hero Section */}
        <section className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="flex items-center justify-center space-x-4 mb-6">
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-br from-beige-400 to-beige-500 rounded-2xl flex items-center justify-center shadow-lg"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className="text-white font-bold text-2xl">E</span>
                </motion.div>
                <h1 className="font-display font-bold text-5xl md:text-6xl text-gray-800">
                  EchoPath
                </h1>
              </div>
              
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Empowering autistic children through AI-powered speech therapy that adapts, 
                encourages, and celebrates every step of their communication journey.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <motion.button
                className="btn-primary text-lg px-8 py-4 shadow-lg"
                onClick={() => navigate('/dashboard')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Your Journey
              </motion.button>
              <motion.button
                className="btn-secondary text-lg px-8 py-4"
                onClick={() => navigate('/demo')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Watch Demo
              </motion.button>
            </motion.div>

            {/* Decorative Elements */}
            <motion.div 
              className="flex justify-center space-x-8 mb-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="text-4xl"
              >
                🌈
              </motion.div>
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="text-4xl"
              >
                ☁️
              </motion.div>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="text-4xl"
              >
                🐘
              </motion.div>
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="text-4xl"
              >
                ⭐
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white/50">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-800 mb-4">
                Why Choose EchoPath?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our platform combines cutting-edge AI technology with compassionate design 
                to create the most effective speech therapy experience for children.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="card text-center hover:shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="font-display font-semibold text-lg mb-3 text-gray-800">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-800 mb-6">
                Ready to Begin?
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands of families who have discovered the joy of personalized, 
                AI-powered speech therapy. Start your child's journey today.
              </p>
              <motion.button
                className="btn-primary text-lg px-10 py-4 shadow-lg"
                onClick={() => navigate('/dashboard')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started Free
              </motion.button>
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default LandingPage;