import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, ArrowLeft, Mail, Lock, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const success = await login({ email, password });
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Login failed, please check your credentials.');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to login.');
    } finally {
      setIsLoading(false);
    }
  };


  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -40, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-purple-600/20 blur-[140px] rounded-full mix-blend-screen" 
        />
        <motion.div 
          animate={{ scale: [1, 1.1, 1], x: [0, -40, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[10%] right-[20%] w-[600px] h-[600px] bg-fuchsia-600/15 blur-[140px] rounded-full mix-blend-screen" 
        />
      </div>

      <button 
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 p-3 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all z-20 flex items-center gap-2 group backdrop-blur-md"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium pr-2 hidden sm:block">Back</span>
      </button>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[420px] relative z-10"
      >
        <div className="bg-zinc-950/40 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative overflow-hidden ring-1 ring-white/5">
          {/* Subtle Top Gradient Line */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/80 to-transparent shadow-[0_0_20px_rgba(168,85,247,0.6)]" />
          
          <div className="p-8 sm:p-10">
            <motion.div variants={itemVariants} className="flex flex-col items-center mb-8">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden mb-4 relative hover:scale-110 transition-transform duration-500 group">
                 <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 to-fuchsia-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                 <img src="/assets/logo.png" alt="Loopchat Logo" className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_20px_rgba(168,85,247,0.3)]" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome Back</h2>
              <p className="text-sm text-zinc-400 text-center">Sign in to Loopchat to continue your conversations.</p>
            </motion.div>
            
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6">
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium p-3 rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              </motion.div>
            )}
            
            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              <motion.div variants={itemVariants} className="space-y-1.5">
                <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest pl-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                  <div className="relative flex items-center bg-zinc-950/50 border border-white/10 rounded-xl overflow-hidden focus-within:border-purple-500/50 focus-within:ring-1 focus-within:ring-purple-500/50 transition-all">
                    <div className="pl-4 pr-3 text-zinc-500 group-focus-within:text-purple-400 transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <Input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="name@loopchat.gg" 
                      className="flex-1 bg-transparent border-0 text-zinc-200 h-14 pl-0 focus-visible:ring-0 placeholder:text-zinc-700 font-medium"
                    />
                  </div>
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants} className="space-y-1.5">
                <div className="flex justify-between items-center pl-1 pr-1">
                  <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">Password</label>
                  <button 
                    type="button" onClick={() => navigate('/forgot-password')} 
                    className="text-[11px] font-medium text-purple-400 hover:text-purple-300 hover:underline transition-all uppercase tracking-wider"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                  <div className="relative flex items-center bg-zinc-950/50 border border-white/10 rounded-xl overflow-hidden focus-within:border-purple-500/50 focus-within:ring-1 focus-within:ring-purple-500/50 transition-all">
                    <div className="pl-4 pr-3 text-zinc-500 group-focus-within:text-purple-400 transition-colors">
                      <Lock className="w-5 h-5" />
                    </div>
                    <Input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••" 
                      className="flex-1 bg-transparent border-0 text-zinc-200 h-14 pl-0 focus-visible:ring-0 placeholder:text-zinc-700 font-medium font-mono tracking-widest"
                    />
                  </div>
                </div>
              </motion.div>

               <motion.div variants={itemVariants} className="pt-2">
                 <Button 
                   type="submit" 
                   disabled={isLoading} 
                   className="w-full relative group overflow-hidden bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-bold h-14 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_8px_20px_rgba(168,85,247,0.3)] hover:shadow-[0_8px_25px_rgba(168,85,247,0.4)] border-t border-white/20"
                 >
                   {isLoading ? (
                     <span className="flex items-center gap-2">
                       <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                       </svg>
                       Authenticating...
                     </span>
                   ) : 'Sign In to Loopchat'}
                 </Button>
               </motion.div>

             </form>
          </div>
          
          <div className="border-t border-white/5 bg-white/[0.02] p-6 text-center">
            <p className="text-sm text-zinc-400">
              New to Loopchat?{' '}
              <button 
                onClick={() => navigate('/create-account')} 
                className="text-white hover:text-purple-400 transition-colors font-semibold tracking-wide ml-1"
              >
                Create an account
              </button>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Developer Attribution */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 0.5 }} 
        whileHover={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 text-center"
      >
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">
          Developed by <span className="text-purple-500">bharanidharan.dev</span>
        </p>
      </motion.div>
    </div>
  );
}
