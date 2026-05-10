import React from 'react';
import { motion } from 'framer-motion';

export const ShareSection = () => {
  return (
    <section className="py-[120px] px-6 bg-secondary-bg text-primary-bg overflow-hidden relative">
      <div className="max-w-[1280px] mx-auto text-center mb-16 relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-[40px] md:text-[56px] font-heading font-bold leading-[1.1] tracking-[-0.02em] mb-6"
        >
          Share your itinerary in one click.
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-lg text-[#333] opacity-80 max-w-[600px] mx-auto"
        >
          Generate beautiful, mobile-friendly links to share with family or publish for the community. No app required for viewing.
        </motion.p>
      </div>

      <div className="max-w-[800px] mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-[32px] p-4 md:p-8 shadow-2xl border border-black/5"
        >
          {/* Mock URL Bar */}
          <div className="flex items-center gap-4 bg-gray-100 rounded-full px-6 py-4 mb-8">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div className="text-sm font-medium text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap">
              triploop.com/trip/bali-escape-2024
            </div>
            <div className="ml-auto bg-primary-bg text-secondary-bg px-4 py-2 rounded-full text-xs font-semibold cursor-pointer hover:bg-[#1a2530] transition-colors">
              Copy Link
            </div>
          </div>

          {/* Clean Itinerary Card Preview */}
          <div className="rounded-[24px] overflow-hidden border border-gray-100 relative h-[300px] bg-gray-50">
            <img src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=1200&h=400" alt="Bali" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
              <h3 className="text-white text-3xl font-heading font-bold mb-2">Bali Escape '24</h3>
              <div className="flex items-center gap-4 text-white/80 text-sm">
                <span>Aug 12 - Aug 24</span>
                <span className="w-1 h-1 rounded-full bg-white/50" />
                <span>Ubud, Canggu, Uluwatu</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute -bottom-1/2 left-1/2 -translate-x-1/2 w-full h-[800px] bg-accent-orange/5 blur-[150px] pointer-events-none rounded-full" />
    </section>
  );
};
