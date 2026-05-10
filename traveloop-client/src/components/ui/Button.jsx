import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = "px-8 py-4 rounded-[16px] font-semibold text-lg inline-flex items-center justify-center transition-colors duration-300";
  
  const variants = {
    primary: "bg-accent-blue text-primary-bg hover:bg-[#5bc0ff]",
    secondary: "bg-secondary-bg text-primary-bg hover:bg-white",
    outline: "border-2 border-neutral-text text-secondary-bg hover:border-secondary-bg"
  };

  return (
    <motion.button 
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ ease: [0.22, 1, 0.36, 1] }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};
