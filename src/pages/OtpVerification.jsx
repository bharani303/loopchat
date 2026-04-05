import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, RefreshCw, Mail } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { sendOtp, verifyOtp } from '../services/api';

export default function OtpVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate('/login');
    }
  }, [email, navigate]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling && element.value !== '') {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length < 6) {
      setError('Please enter the full 6-digit code.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await verifyOtp(email, otpValue);
      // On success, redirect to profile setup or login
      navigate('/profile-setup');
    } catch (err) {
      setError(err?.response?.data || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError('');
    try {
      await sendOtp(email);
      setTimer(60);
    } catch (err) {
      setError('Failed to resend OTP.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="bg-zinc-900/80 backdrop-blur-2xl border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
          
          <CardHeader className="text-center pt-8">
            <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center shadow-xl mb-6 overflow-hidden relative group">
               <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 to-fuchsia-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
               <img src="/assets/logo.png" alt="Loopchat Logo" className="w-full h-full object-contain relative z-10" />
            </div>
            <CardTitle className="text-2xl font-bold text-white tracking-tight">Verify Your Email</CardTitle>
            <CardDescription className="text-zinc-400 flex items-center justify-center gap-2 mt-2">
              <Mail className="w-4 h-4" />
              We've sent a 6-digit code to <span className="text-zinc-200 font-medium">{email}</span>
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            <form onSubmit={handleVerify} className="flex flex-col gap-8">
              <div className="flex justify-between gap-2">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    className="w-12 h-14 bg-zinc-950 border border-white/20 rounded-xl text-center text-xl font-bold text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all shadow-inner"
                    value={data}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              {error && <div className="text-red-400 text-sm font-medium text-center">{error}</div>}

              <Button 
                type="submit" 
                disabled={loading} 
                className={`w-full font-bold h-12 rounded-xl flex items-center justify-center gap-2 transition-all ${
                  otp.some(d => d === '') 
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                    : 'bg-purple-600 hover:bg-purple-700 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)]'
                }`}
              >
                {loading ? 'Verifying...' : 'Verify & Continue'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pb-8 pt-2">
            <div className="text-sm text-zinc-500">
              Didn't receive the code?{' '}
              {timer > 0 ? (
                <span className="text-zinc-400">Resend in {timer}s</span>
              ) : (
                <button 
                  onClick={handleResend} 
                  disabled={isResending}
                  className="text-purple-400 hover:text-white transition-colors font-medium inline-flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${isResending ? 'animate-spin' : ''}`} />
                  Resend Code
                </button>
              )}
            </div>
            <button onClick={() => navigate('/login')} className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors uppercase tracking-widest font-bold">
              Back to Login
            </button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
