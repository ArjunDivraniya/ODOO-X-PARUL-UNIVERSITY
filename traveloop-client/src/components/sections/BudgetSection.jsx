import React from 'react';
import { motion } from 'framer-motion';

export const BudgetSection = () => {
  return (
    <section className="py-[120px] px-6 bg-[#050B11] text-secondary-bg">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left: Budget Charts Mockup */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-[450px] bg-[#0A1622] rounded-[32px] p-8 border border-white/5 shadow-2xl flex flex-col justify-between"
        >
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="text-neutral-text text-sm font-medium mb-1">Total Trip Budget</div>
              <div className="text-4xl font-heading font-bold tracking-tight">₹45,000</div>
            </div>
            <div className="bg-white/10 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-md">
              On track
            </div>
          </div>

          {/* Simple Donut Chart Representation */}
          <div className="relative flex justify-center items-center mb-8">
            <div className="w-48 h-48 rounded-full border-[16px] border-white/5 relative flex justify-center items-center">
              <div className="absolute inset-[-16px] rounded-full border-[16px] border-accent-blue" style={{ clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 50%)' }}></div>
              <div className="absolute inset-[-16px] rounded-full border-[16px] border-accent-mint" style={{ clipPath: 'polygon(50% 50%, 0% 50%, 0% 0%, 50% 0%)' }}></div>
              <div className="text-center">
                <div className="text-sm text-neutral-text">Spent</div>
                <div className="text-xl font-bold">₹32k</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-[16px] p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-accent-blue"></div>
                <span className="text-xs text-neutral-text font-medium">Flights & Stays</span>
              </div>
              <div className="font-semibold text-lg">₹25,000</div>
            </div>
            <div className="bg-white/5 rounded-[16px] p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-accent-mint"></div>
                <span className="text-xs text-neutral-text font-medium">Activities</span>
              </div>
              <div className="font-semibold text-lg">₹7,000</div>
            </div>
          </div>
        </motion.div>

        {/* Right: Copy */}
        <div className="flex flex-col items-start lg:pl-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-[40px] md:text-[56px] font-heading font-bold leading-[1.1] tracking-[-0.02em] mb-6"
          >
            Know your trip cost before you travel.
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg text-neutral-text mb-10 leading-relaxed"
          >
            Say goodbye to post-trip Venmo requests. Auto-calculate split costs, track group expenses in real-time, and get smart budget alerts.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {[
              { title: 'Hotel Estimates', desc: 'Live pricing integration' },
              { title: 'Split Costs', desc: 'Fair share calculation' },
              { title: 'Activity Pricing', desc: 'Upfront cost visibility' },
              { title: 'Budget Alerts', desc: 'Never overspend' },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 + (i * 0.1), ease: [0.22, 1, 0.36, 1] }}
                className="flex items-start gap-4"
              >
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 mt-1">
                  <svg className="w-4 h-4 text-accent-mint" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-lg mb-1">{feature.title}</h4>
                  <p className="text-sm text-neutral-text">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
