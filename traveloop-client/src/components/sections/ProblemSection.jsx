import React from 'react';
import { motion } from 'framer-motion';

export const ProblemSection = () => {
  return (
    <section className="py-[120px] px-6 bg-secondary-bg text-primary-bg relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left: Messy Planning Mockup */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-[400px] md:h-[500px] rounded-[32px] bg-white border border-primary-bg/5 shadow-xl p-6 overflow-hidden flex flex-col justify-center"
        >
          {/* Scattered Elements representing chaos */}
          <motion.div className="absolute top-10 left-10 bg-[#25D366] text-white p-3 rounded-[16px] rounded-tl-none shadow-md max-w-[200px] text-sm transform -rotate-6">
            "Wait, what time is our flight again?"
          </motion.div>
          <motion.div className="absolute top-32 right-10 bg-white p-3 rounded-[12px] shadow-md border border-gray-100 max-w-[220px] text-sm transform rotate-3 flex items-center gap-2">
            <span className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex justify-center items-center font-bold">PDF</span>
            <div className="truncate">Booking_Confirmation_v2_final.pdf</div>
          </motion.div>
          <motion.div className="absolute bottom-20 left-20 bg-yellow-100 p-4 rounded-sm shadow-md max-w-[180px] font-handwriting text-gray-800 transform rotate-12">
            Don't forget to book the airport transfer!!
          </motion.div>
          <motion.div className="absolute bottom-10 right-5 bg-white p-3 rounded-[12px] shadow-md border border-gray-100 text-sm transform -rotate-2">
            Spreadsheet: "Trip Budget copy(1).xlsx"
          </motion.div>
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[150px] h-[150px] bg-red-500/5 rounded-full blur-[40px]"></div>
          </div>
        </motion.div>

        {/* Right: Copy */}
        <div className="flex flex-col items-start">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-[40px] md:text-[56px] font-heading font-bold leading-[1.1] tracking-[-0.02em] mb-6"
          >
            Trip planning is scattered everywhere.
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4 mb-10"
          >
            {['WhatsApp chats', 'Lost screenshots', 'Clunky spreadsheets', 'Random notes', 'Missing bookings'].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-lg opacity-60 line-through decoration-red-500/50">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                {item}
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="p-6 rounded-[24px] bg-[#07111A] text-secondary-bg w-full relative overflow-hidden"
          >
            <div className="absolute right-0 top-0 w-32 h-32 bg-accent-mint/10 blur-[40px] rounded-full"></div>
            <h3 className="text-2xl font-heading font-bold mb-2">TripLoop centralizes everything.</h3>
            <p className="opacity-80">One workspace for your entire journey.</p>
          </motion.div>
        </div>

      </div>
    </section>
  );
};
