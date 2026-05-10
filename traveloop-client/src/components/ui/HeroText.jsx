import React from 'react';
import { motion } from 'framer-motion';

export const HeroText = ({ children, className = '' }) => {
  return (
    <motion.h1 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`text-5xl md:text-[80px] lg:text-[96px] leading-[1.1] tracking-[-0.03em] font-heading font-bold text-balance ${className}`}
    >
      {children}
    </motion.h1>
  );
};
