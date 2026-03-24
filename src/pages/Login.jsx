import { motion } from 'framer-motion';
import { MessageCircle, ArrowLeft, Mail, Lock, Sparkles } from 'lucide-react';

export default function Login({ onLogin, onBack, onCreateAccount }) {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/20 blur-[120px] rounded-full" />
      </div>

      <button 
        onClick={onBack}
        className="absolute top-8 left-8 p-3 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all z-10 flex items-center gap-2 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium pr-2">Back</span>
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-zinc-900/80 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-[0_0_80px_rgba(147,51,234,0.15)] text-center relative overflow-hidden">
          
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
          
          <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-purple-600 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 mb-6 relative">
             <MessageCircle className="w-8 h-8 text-white" />
             <div className="absolute -top-2 -right-2 w-6 h-6 bg-zinc-900 rounded-full flex items-center justify-center">
               <Sparkles className="w-3 h-3 text-purple-400" />
             </div>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome Back</h2>
          <p className="text-zinc-400 text-sm mb-8">Sign in to Loopchat to continue your conversations.</p>

          <div className="flex flex-col gap-4 mb-8">
            <button 
              type="button"
              onClick={onLogin}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-zinc-100 text-zinc-900 font-semibold py-3 rounded-xl transition-all hover:scale-[1.01] active:scale-95 shadow-lg"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>

            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-white/5" />
              <span className="text-zinc-600 text-xs font-bold uppercase tracking-widest">or</span>
              <div className="h-px flex-1 bg-white/5" />
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); onLogin(); }} className="flex flex-col gap-4 text-left">
            <div>
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5 block px-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input 
                  type="email" 
                  autoFocus
                  required
                  placeholder="name@loopchat.gg" 
                  className="w-full bg-zinc-950/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all font-sans"
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1.5 px-1">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Password</label>
                <a href="#" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Forgot?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••" 
                  className="w-full bg-zinc-950/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all hover:scale-[1.02] active:scale-95 mt-4">
              Sign In
            </button>
          </form>

          <p className="text-sm text-zinc-500 mt-8">
            New to Loopchat? <button type="button" onClick={onCreateAccount} className="text-purple-400 hover:text-white transition-colors font-medium ml-1">Create an account</button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
