import React from 'react';
import { motion } from 'framer-motion';

export const SocialProofSection = () => {
  return (
    <section className="py-20 px-6 bg-secondary-bg text-primary-bg rounded-t-[40px] md:rounded-t-[80px]">
      <div className="max-w-[1280px] mx-auto text-center">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-lg font-medium text-[#333] opacity-80 mb-12"
        >
          Trusted by modern travelers worldwide.
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x divide-primary-bg/10">
          {[
            { label: 'Trips Planned', value: '10K+' },
            { label: 'Cities', value: '120+' },
            { label: 'Countries', value: '35+' },
            { label: 'Active Nomads', value: '50K' },
          ].map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center justify-center"
            >
              <div className="text-4xl md:text-5xl font-heading font-bold mb-2 tracking-tight">
                {stat.value}
              </div>
              <div className="text-sm font-medium opacity-70 uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
