import React from 'react';
import { motion } from 'framer-motion';

export const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "We planned our entire Europe trip in one weekend. TripLoop eliminated all the chaos of WhatsApp groups.",
      author: "Sarah Jenkins",
      dest: "Planned Paris & Rome",
      img: "https://i.pravatar.cc/150?img=47"
    },
    {
      quote: "The smart budgeting feature literally saved our friend group. No more awkward conversations about who owes who.",
      author: "David Chen",
      dest: "Planned Tokyo '23",
      img: "https://i.pravatar.cc/150?img=11"
    },
    {
      quote: "I publish all my solo backpacking itineraries here. The community is incredible and the interface is just beautiful.",
      author: "Elena Rodriguez",
      dest: "Planned South America",
      img: "https://i.pravatar.cc/150?img=5"
    }
  ];

  return (
    <section className="py-[120px] px-6 bg-secondary-bg text-primary-bg rounded-t-[40px] md:rounded-t-[80px]">
      <div className="max-w-[1280px] mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-[40px] md:text-[56px] font-heading font-bold leading-[1.1] tracking-[-0.02em] mb-16 text-center"
        >
          Stories from the loop.
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((test, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-[32px] p-8 shadow-xl border border-black/5 flex flex-col justify-between"
            >
              <p className="text-lg font-medium leading-relaxed mb-8">"{test.quote}"</p>
              
              <div className="flex items-center gap-4">
                <img src={test.img} alt={test.author} className="w-12 h-12 rounded-full object-cover bg-gray-100" />
                <div>
                  <div className="font-bold text-sm">{test.author}</div>
                  <div className="text-xs text-gray-500 font-medium">{test.dest}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
