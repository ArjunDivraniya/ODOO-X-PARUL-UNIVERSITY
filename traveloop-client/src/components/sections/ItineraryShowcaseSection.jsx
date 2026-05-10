import React from 'react';
import { motion } from 'framer-motion';

export const ItineraryShowcaseSection = () => {
  return (
    <section className="py-[120px] px-6 bg-secondary-bg text-primary-bg rounded-t-[40px] md:rounded-t-[80px]">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left: Copy */}
        <div className="flex flex-col items-start">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-[40px] md:text-[56px] font-heading font-bold leading-[1.1] tracking-[-0.02em] mb-6"
          >
            The ultimate timeline view.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg text-[#333] opacity-80 mb-8 max-w-[480px]"
          >
            Visualize your entire journey. Drag and drop activities, coordinate multiple cities, and never wonder "what's next?"
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-4 p-4 bg-white rounded-[16px] shadow-sm border border-black/5"
          >
            <div className="w-10 h-10 rounded-full bg-[#07111A] flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-sm">Smart Sync</div>
              <div className="text-xs opacity-60">Automatically syncs to your Google Calendar</div>
            </div>
          </motion.div>
        </div>

        {/* Right: UI Mockup Showcase */}
        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative bg-white rounded-[32px] p-6 shadow-2xl border border-black/5"
        >
          {/* City Timeline Headers */}
          <div className="flex justify-between items-center mb-8 bg-gray-50 p-2 rounded-[16px]">
            {['Ahmedabad', 'Mumbai', 'Goa'].map((city, i) => (
              <div key={i} className={`px-4 py-2 rounded-[12px] text-sm font-semibold flex items-center gap-2 ${i === 1 ? 'bg-white shadow-sm text-primary-bg' : 'text-gray-400'}`}>
                <div className={`w-2 h-2 rounded-full ${i === 1 ? 'bg-accent-blue' : 'bg-transparent'}`} />
                {city}
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="relative pl-6 space-y-6">
            <div className="absolute left-[11px] top-2 bottom-4 w-[2px] bg-gray-100" />
            
            {/* Item 1 */}
            <div className="relative z-10 group">
              <div className="absolute -left-[30px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-4 border-accent-blue" />
              <div className="bg-white border border-gray-100 rounded-[16px] p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-semibold">Flight to Mumbai</div>
                  <div className="text-xs font-bold text-accent-blue bg-accent-blue/10 px-2 py-1 rounded-md">₹4,500</div>
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-2">
                  <span>08:30 AM - 09:45 AM</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <span>IndiGo 6E-234</span>
                </div>
              </div>
            </div>

            {/* Item 2 */}
            <div className="relative z-10 group">
              <div className="absolute -left-[30px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-4 border-accent-mint" />
              <div className="bg-white border border-gray-100 rounded-[16px] p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-semibold">Check-in at Taj Lands End</div>
                  <div className="text-xs font-bold text-accent-mint bg-accent-mint/10 px-2 py-1 rounded-md">Pre-paid</div>
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-2">
                  <span>11:00 AM</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <span>Bandra West</span>
                </div>
              </div>
            </div>

            {/* Item 3 */}
            <div className="relative z-10 group opacity-50 border-dashed border-2 border-gray-200 rounded-[16px] p-4 text-center cursor-pointer hover:bg-gray-50 hover:opacity-100 transition-all">
              <div className="text-sm font-semibold text-gray-400">+ Add Activity</div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
