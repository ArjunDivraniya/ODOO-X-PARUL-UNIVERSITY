import React from 'react';
import { motion } from 'framer-motion';

export const PremiumCard = ({ children, className = '', delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5 }}
      className={`bg-[#0d1b2a] rounded-[24px] md:rounded-[32px] p-8 md:p-10 border border-white/5 shadow-2xl overflow-hidden relative ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};
