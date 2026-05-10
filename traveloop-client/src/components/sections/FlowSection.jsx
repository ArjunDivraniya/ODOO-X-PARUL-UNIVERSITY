import React from 'react';
import { motion } from 'framer-motion';

export const FlowSection = () => {
  const steps = [
    { num: '01', title: 'Create Trip', desc: 'Set your dates and invite friends.', color: 'accent-blue' },
    { num: '02', title: 'Add Cities', desc: 'Map out your destinations.', color: 'accent-mint' },
    { num: '03', title: 'Plan Activities', desc: 'Discover and drag-and-drop spots.', color: 'accent-orange' },
    { num: '04', title: 'Track Budget', desc: 'Auto-calculate split costs.', color: 'accent-blue' },
    { num: '05', title: 'Share Itinerary', desc: 'Publish a beautiful public link.', color: 'accent-mint' },
  ];

  return (
    <section className="py-[120px] px-6 bg-primary-bg text-secondary-bg overflow-hidden relative">
      <div className="max-w-[1280px] mx-auto text-center mb-16 relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-[40px] md:text-[56px] font-heading font-bold leading-[1.1] tracking-[-0.02em] mb-6"
        >
          From idea to boarding pass.
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-lg text-neutral-text max-w-[600px] mx-auto"
        >
          A seamless flow designed to remove friction from group travel planning.
        </motion.p>
      </div>

      <div className="max-w-[1280px] mx-auto relative z-10">
        {/* Horizontal scroll container on mobile, flex wrap on desktop isn't ideal. Let's do a flex container with overflow-x-auto for mobile and flex-wrap/grid for desktop, or a staggered horizontal layout. */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-4 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="min-w-[280px] flex-1 bg-[#0d1b2a] rounded-[24px] p-8 border border-white/5 relative group hover:-translate-y-2 transition-transform duration-500 snap-center"
            >
              <div className={`text-4xl font-heading font-bold text-white/5 mb-6 group-hover:text-${step.color}/20 transition-colors duration-500`}>
                {step.num}
              </div>
              <h3 className="text-xl font-heading font-bold mb-3">{step.title}</h3>
              <p className="text-neutral-text text-sm leading-relaxed">{step.desc}</p>
              
              {/* Connector line for desktop */}
              {index !== steps.length - 1 && (
                <div className="hidden lg:block absolute right-[-16px] top-1/2 -translate-y-1/2 w-8 h-[2px] bg-white/5 z-0" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-accent-blue/5 blur-[120px] pointer-events-none rounded-full" />
    </section>
  );
};
