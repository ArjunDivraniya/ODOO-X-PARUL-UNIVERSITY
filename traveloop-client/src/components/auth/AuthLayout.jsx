import React from 'react';
import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center relative overflow-hidden font-sans">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600 blur-[120px]" />
      </div>
      
      {/* Floating particles animation */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white/20 rounded-full"
            style={{
              width: Math.random() * 4 + 1 + 'px',
              height: Math.random() * 4 + 1 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%'
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.2, 0.8, 0.2]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[1000px] z-10 flex flex-col md:flex-row bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl m-4"
      >
        {/* Left Side - Image/Branding */}
        <div className="md:w-5/12 bg-gradient-to-br from-indigo-900/80 to-purple-900/80 p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-12">
              <Compass className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-bold tracking-tight">Traveloop</span>
            </div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                {title}
              </h1>
              <p className="text-indigo-200 text-lg">
                {subtitle}
              </p>
            </motion.div>
          </div>
          
          <div className="relative z-10 mt-12 md:mt-0">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`w-10 h-10 rounded-full border-2 border-indigo-900 bg-indigo-200 flex items-center justify-center overflow-hidden`}>
                  <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="avatar" className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-indigo-900 bg-white/10 backdrop-blur flex items-center justify-center text-xs font-medium">
                +2k
              </div>
            </div>
            <p className="text-sm text-indigo-300 mt-3">Join thousands of travelers planning their next adventure.</p>
          </div>
        </div>

        {/* Right Side - Form Container */}
        <div className="md:w-7/12 p-8 md:p-12 relative bg-[#0a0a0f]/50">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
