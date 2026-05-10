import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-primary-bg text-secondary-bg flex items-center justify-center relative overflow-hidden font-body">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent-blue/10 blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent-mint/10 blur-[150px]" />
      </div>
      
      {/* Floating particles animation */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white/10 rounded-full"
            style={{
              width: Math.random() * 4 + 1 + 'px',
              height: Math.random() * 4 + 1 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%'
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.1, 0.5, 0.1]
            }}
            transition={{
              duration: Math.random() * 10 + 15,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[1100px] z-10 flex flex-col md:flex-row bg-[#0A1622] backdrop-blur-xl border border-white/5 rounded-[32px] overflow-hidden shadow-2xl m-4 my-12"
      >
        {/* Left Side - Image/Branding */}
        <div className="md:w-5/12 p-10 flex flex-col justify-between relative overflow-hidden hidden md:flex">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#07111A] via-[#07111A]/60 to-transparent mix-blend-multiply"></div>
          
          <div className="relative z-10">
            <Link to="/" className="text-secondary-bg text-2xl font-heading font-bold tracking-tight inline-block mb-12">
              TripLoop.
            </Link>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="text-4xl lg:text-5xl font-heading font-bold leading-[1.1] tracking-[-0.02em] mb-4 text-white">
                {title}
              </h1>
              <p className="text-white/70 text-lg leading-relaxed">
                {subtitle}
              </p>
            </motion.div>
          </div>
          
          <div className="relative z-10 mt-12 md:mt-0">
            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md p-4 rounded-[20px] border border-white/10">
              <div className="flex -space-x-3">
                {[11, 47, 5].map((img, i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0A1622] bg-gray-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${img}`} alt="avatar" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="text-sm font-medium text-white/90">
                Join 50k+ active nomads.
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form Container */}
        <div className="w-full md:w-7/12 p-8 md:p-12 lg:p-16 relative bg-[#0A1622]">
          {/* Mobile Logo */}
          <div className="md:hidden mb-8">
             <Link to="/" className="text-secondary-bg text-2xl font-heading font-bold tracking-tight inline-block">
              TripLoop.
            </Link>
          </div>
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
