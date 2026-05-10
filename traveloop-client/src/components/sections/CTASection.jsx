import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export const CTASection = () => {
  return (
    <section className="py-[160px] px-6 bg-primary-bg text-secondary-bg relative overflow-hidden flex items-center justify-center min-h-[70vh]">
      {/* Background Cinematic Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-blue/10 blur-[150px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-primary-bg/80 to-primary-bg" />
      </div>

      <div className="max-w-[800px] mx-auto text-center relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-[56px] md:text-[80px] lg:text-[96px] font-heading font-bold leading-[1.05] tracking-[-0.03em] mb-10"
        >
          Your next journey <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue via-accent-mint to-accent-blue bg-300% animate-gradient">
            starts here.
          </span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link to="/register">
            <Button variant="primary" className="!px-10 !py-5 !text-xl !rounded-[24px]">
              Start Planning Free
            </Button>
          </Link>
        </motion.div>
      </div>
      
      {/* Subtle Floating Shapes for depth */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] left-[10%] w-32 h-32 bg-white/5 rounded-[32px] backdrop-blur-sm border border-white/10 hidden md:block"
      />
      <motion.div 
        animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[20%] right-[10%] w-48 h-48 bg-white/5 rounded-full backdrop-blur-sm border border-white/10 hidden md:block"
      />
    </section>
  );
};
