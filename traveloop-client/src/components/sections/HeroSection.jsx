import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HeroText } from '../ui/HeroText';
import { Button } from '../ui/Button';

export const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-[200px] md:pb-[120px] px-6 max-w-[1280px] mx-auto min-h-screen flex items-center">
      {/* Background Shapes */}
      <div className="absolute top-20 right-10 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-accent-blue/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-accent-mint/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left: Typography & CTA */}
        <div className="flex flex-col items-start text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm"
          >
            <span className="w-2 h-2 rounded-full bg-accent-mint animate-pulse" />
            <span className="text-sm font-medium text-secondary-bg/80">TripLoop 1.0 is Live</span>
          </motion.div>

          <HeroText className="mb-6 text-secondary-bg">
            Travel Beyond <br />
            <span className="text-accent-blue">The Tourist Map.</span>
          </HeroText>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg md:text-xl text-neutral-text max-w-[500px] mb-10 leading-relaxed"
          >
            Build multi-city itineraries, organize activities, track budgets, and share trips — all in one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Link to="/register" className="w-full sm:w-auto">
              <Button variant="primary" className="w-full">Start Planning</Button>
            </Link>
            <Button variant="outline" className="w-full sm:w-auto gap-2">
              See Demo
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </Button>
          </motion.div>
        </div>

        {/* Right: Floating UI Mockup */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full h-[500px] hidden lg:block"
        >
          {/* Main App Card Mockup */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-0 top-10 w-[85%] bg-[#0A1622] rounded-[32px] p-6 border border-white/10 shadow-2xl backdrop-blur-md"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-heading font-semibold text-secondary-bg text-xl">Gujarat Trip'26</h3>
              <span className="bg-accent-blue/20 text-accent-blue px-3 py-1 rounded-full text-xs font-medium">14 Days</span>
            </div>
            <div className="space-y-4">
              {[
                { time: '09:00', title: 'Dwarkadhish Temple Visit', type: 'Activity', color: 'accent-mint' },
                { time: '13:00', title: 'Lunch at Govinda Multi Cuisine Restaurant', type: 'Dining', color: 'accent-orange' },
                { time: '15:30', title: 'Bet Dwarka Ferry & Sightseeing', type: 'Activity', color: 'accent-mint' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start p-4 rounded-[16px] bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="text-neutral-text text-sm font-medium pt-1">{item.time}</div>
                  <div>
                    <div className="text-secondary-bg font-medium">{item.title}</div>
                    <div className={`text-xs text-${item.color} mt-1`}>{item.type}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Floating Collaborator Card */}
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute left-0 bottom-20 bg-[#0d1b2a] p-4 rounded-[24px] border border-white/10 shadow-xl flex items-center gap-3 backdrop-blur-md"
          >
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-accent-blue flex items-center justify-center text-primary-bg font-bold text-xs">J</div>
              <div className="w-8 h-8 rounded-full bg-accent-orange flex items-center justify-center text-primary-bg font-bold text-xs">S</div>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-secondary-bg text-xs backdrop-blur">+2</div>
            </div>
            <div className="text-sm font-medium text-secondary-bg pr-2">Collaborating</div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};
