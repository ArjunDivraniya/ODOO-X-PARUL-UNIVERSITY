import React from 'react';
import { motion } from 'framer-motion';
import { LuBackpack, LuBook, LuMap, LuBuilding2, LuClock, LuGlobe } from 'react-icons/lu';

export const FeaturesGridSection = () => {
  const features = [
    { title: 'Packing Checklist', desc: 'Never forget essentials with smart, auto-generated packing lists based on destination weather.', icon: <LuBackpack className="w-8 h-8 text-accent-blue" /> },
    { title: 'Travel Journal', desc: 'Document your daily adventures with notes, photos, and location tags securely.', icon: <LuBook className="w-8 h-8 text-accent-mint" /> },
    { title: 'Activity Discovery', desc: 'Find top-rated local experiences curated by the community.', icon: <LuMap className="w-8 h-8 text-accent-orange" /> },
    { title: 'City Search', desc: 'Deep dive into neighborhoods, transport, and local tips before you arrive.', icon: <LuBuilding2 className="w-8 h-8 text-accent-blue" /> },
    { title: 'Timeline View', desc: 'Your entire trip organized hour-by-hour in a beautiful visual timeline.', icon: <LuClock className="w-8 h-8 text-accent-mint" /> },
    { title: 'Public Trips', desc: 'Publish your master itineraries to help other travelers plan their next escape.', icon: <LuGlobe className="w-8 h-8 text-accent-orange" /> },
  ];

  return (
    <section className="py-[120px] px-6 bg-primary-bg text-secondary-bg">
      <div className="max-w-[1280px] mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-[40px] md:text-[56px] font-heading font-bold leading-[1.1] tracking-[-0.02em] mb-16 max-w-[600px]"
        >
          Everything you need, nothing you don't.
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="bg-[#0A1622] rounded-[24px] p-8 border border-white/5 hover:border-white/10 transition-colors flex flex-col items-start group"
            >
              <div className="text-4xl mb-6 bg-white/5 w-16 h-16 rounded-[16px] flex items-center justify-center group-hover:scale-110 transition-transform duration-500 ease-out">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-heading font-bold mb-3">{feature.title}</h3>
              <p className="text-neutral-text leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
