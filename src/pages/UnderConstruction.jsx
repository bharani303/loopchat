import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Hammer, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function UnderConstruction() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -40, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-purple-600/10 blur-[140px] rounded-full mix-blend-screen" 
        />
        <motion.div 
          animate={{ scale: [1, 1.1, 1], x: [0, -40, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[10%] right-[20%] w-[600px] h-[600px] bg-fuchsia-600/10 blur-[140px] rounded-full mix-blend-screen" 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg relative z-10 text-center"
      >
        <div className="mb-12 relative flex items-center justify-center">
           {/* Pure CSS Neon Upgrade Loader */}
           <div className="relative w-48 h-48 flex items-center justify-center">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 border-dashed border-purple-500/30 rounded-full"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 border-2 border-dashed border-fuchsia-500/20 rounded-full"
              />
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-24 h-24 bg-gradient-to-tr from-purple-600 to-fuchsia-600 rounded-2xl blur-[30px]"
              />
              <Hammer className="absolute w-12 h-12 text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
           </div>
        </div>

        <motion.div
           animate={{ scale: [1, 1.05, 1] }}
           transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
           className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-sm text-purple-300 text-sm font-medium mb-6"
        >
          <Hammer className="w-4 h-4" />
          <span>Building the Future</span>
        </motion.div>

        <h1 className="text-5xl font-black text-white mb-4 tracking-tighter drop-shadow-md">
           WE'RE <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">UPGRADING</span>
        </h1>
        <p className="text-zinc-400 text-lg mb-10 max-w-md mx-auto leading-relaxed">
          This part of Loopchat is being forged in the neon fires. We'll be back online shortly with a brand new experience.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            onClick={() => navigate('/')}
            className="w-full sm:w-auto h-14 px-10 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-bold transition-all shadow-[0_10px_30px_rgba(168,85,247,0.3)] hover:scale-105 active:scale-95 border-t border-white/20 group outline-none"
          >
            <Sparkles className="w-5 h-5 mr-2 group-hover:animate-pulse" />
            Wait for the Loop
          </Button>
          <Button 
            onClick={() => navigate(-1)}
            variant="ghost"
            className="w-full sm:w-auto h-14 px-8 rounded-2xl text-zinc-400 hover:text-white hover:bg-white/5 font-bold transition-all group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Previous Page
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
