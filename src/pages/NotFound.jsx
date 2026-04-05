import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function NotFound() {
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
           {/* Pure CSS Neon 404 */}
           <motion.div 
             animate={{ 
               y: [0, -20, 0],
               filter: ["drop-shadow(0 0 20px rgba(168,85,247,0.4))", "drop-shadow(0 0 40px rgba(168,85,247,0.8))", "drop-shadow(0 0 20px rgba(168,85,247,0.4))"] 
             }}
             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
             className="text-[180px] font-black leading-none tracking-tighter select-none"
           >
             <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-purple-500 to-fuchsia-600">404</span>
           </motion.div>
           
           {/* Orbiting particles */}
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
             className="absolute w-64 h-64 border border-purple-500/10 rounded-full"
           />
           <motion.div 
             animate={{ rotate: -360 }}
             transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
             className="absolute w-80 h-80 border border-fuchsia-500/5 rounded-full"
           />
        </div>

        <h1 className="text-5xl font-black text-white mb-4 tracking-tighter drop-shadow-md">
           LOST IN THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">VOID</span>
        </h1>
        <p className="text-zinc-400 text-lg mb-10 max-w-md mx-auto leading-relaxed">
          The page you're looking for has drifted out of orbit. Don't worry, we'll help you find your way back.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            onClick={() => navigate(-1)}
            variant="outline"
            className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-white/5 border-white/10 text-white hover:bg-white/10 border backdrop-blur-md font-bold transition-all hover:scale-105 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </Button>
          <Button 
            onClick={() => navigate('/')}
            className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-bold transition-all shadow-[0_10px_30px_rgba(168,85,247,0.3)] hover:scale-105 active:scale-95 border-t border-white/20"
          >
            <Home className="w-5 h-5 mr-2" />
            Return Home
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
