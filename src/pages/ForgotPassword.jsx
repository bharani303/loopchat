import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ArrowLeft, Mail, Lock, Sparkles, ShieldCheck, ArrowRight, RefreshCw, KeyRound, CheckCircle2 } from 'lucide-react';
import { forgotPassword, sendOtp, verifyOtp } from '../services/api';
import { Button } from '../components/ui/button';

export default function ForgotPassword() {
  const navigate = useNavigate();
  
  // States
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);

  // OTP Timer Logic
  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const onBack = () => {
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
    else navigate('/login');
  };

  // Step 1: Send OTP for Reset
  const handleSendResetOtp = async (e) => {
    if (e) e.preventDefault();
    if (!email) {
      setError("Please enter your email");
      return;
    }
    setLoading(true);
    setError('');
    try {
      await sendOtp(email);
      setStep(2);
      setTimer(60);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    const newOtpArr = [...otp];
    newOtpArr[index] = element.value;
    setOtp(newOtpArr);

    if (element.nextSibling && element.value !== '') {
      element.nextSibling.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length < 6) {
      setError('Please enter the 6-digit code.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await verifyOtp(email, otpValue);
      setStep(3);
    } catch (err) {
      setError(err?.response?.data || 'Invalid reset code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    setError('');
    try {
      await sendOtp(email);
      setTimer(60);
    } catch (err) {
      setError('Failed to resend code.');
    } finally {
      setIsResending(false);
    }
  };

  // Step 3: Complete Reset
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    setLoading(true);
    setError('');
    try {
      await forgotPassword({
        email: email,
        otp: otp.join(''),
        newPassword: newPassword
      });
      setSuccess('Password reset successfully! You can now log in.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/10 blur-[120px] rounded-full" />
      </div>

      <button 
        onClick={onBack}
        className="fixed top-8 left-8 p-3 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all z-20 flex items-center gap-2 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium pr-2">Back</span>
      </button>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-zinc-900/80 backdrop-blur-2xl border border-white/10 p-8 sm:p-10 rounded-3xl shadow-[0_0_80px_rgba(147,51,234,0.15)] text-center relative overflow-hidden">
          
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
          
          <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-purple-600 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 mb-6 relative">
             <KeyRound className="w-8 h-8 text-white" />
             <div className="absolute -top-2 -right-2 w-6 h-6 bg-zinc-900 rounded-full flex items-center justify-center">
               <Sparkles className="w-3 h-3 text-purple-400" />
             </div>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Secret Recovery</h2>
          <p className="text-zinc-400 text-sm mb-8">
            {step === 1 ? "Enter your email to receive a reset code." : step === 2 ? "Verify your identity with the 6-digit code." : "Create a powerful new password."}
          </p>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm font-medium mb-6 text-center bg-red-500/10 py-3 rounded-xl border border-red-500/20"
              >
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="text-green-400 text-sm font-medium mb-6 text-center bg-green-500/10 py-4 rounded-xl border border-green-500/20 flex flex-col items-center gap-2"
              >
                <CheckCircle2 className="w-6 h-6" />
                {success}
              </motion.div>
            )}

            {/* STEP 1: EMAIL */}
            {step === 1 && (
              <motion.form 
                key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                onSubmit={handleSendResetOtp} className="flex flex-col gap-6 text-left"
              >
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block px-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input 
                      type="email" required value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="name@gmail.com" 
                      className="w-full bg-zinc-950/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-zinc-200 focus:outline-none focus:border-purple-500/50 transition-all font-sans"
                    />
                  </div>
                </div>
                <button 
                  disabled={loading} type="submit" 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all flex items-center justify-center gap-2"
                >
                  {loading ? 'Sending...' : 'Send Recovery Code'}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </motion.form>
            )}

            {/* STEP 2: OTP */}
            {step === 2 && (
              <motion.div 
                key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                className="flex flex-col items-center w-full"
              >
                <div className="flex justify-between gap-2 px-2 w-full mb-8">
                  {otp.map((data, index) => (
                    <input
                      key={index} type="text" maxLength="1" autoFocus={index === 0}
                      className="w-12 h-14 bg-zinc-950 border border-white/20 rounded-xl text-center text-xl font-bold text-white focus:outline-none focus:border-purple-500 focus:ring-2 transition-all shadow-inner"
                      value={data}
                      onChange={(e) => handleOtpChange(e.target, index)}
                      onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    />
                  ))}
                </div>
                <Button 
                  onClick={handleVerifyOtp} disabled={loading} 
                  className={`w-full font-bold h-14 rounded-xl flex items-center justify-center gap-2 transition-all ${
                    otp.some(d => d === '') 
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                      : 'bg-purple-600 hover:bg-purple-700 text-white shadow-xl shadow-purple-500/20'
                  }`}
                >
                  {loading ? 'Verifying...' : 'Verify Code'}
                  {!loading && <ShieldCheck className="w-4 h-4" />}
                </Button>
                <div className="mt-8 text-sm text-zinc-500">
                  Didn't receive the code?{' '}
                  {timer > 0 ? (
                    <span className="text-zinc-400">Resend in {timer}s</span>
                  ) : (
                    <button 
                      onClick={handleResendOtp} disabled={isResending}
                      className="text-purple-400 hover:text-white transition-colors font-medium inline-flex items-center gap-1"
                    >
                      <RefreshCw className={`w-3 h-3 ${isResending ? 'animate-spin' : ''}`} />
                      Resend
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* STEP 3: NEW PASSWORD */}
            {step === 3 && (
              <motion.form 
                key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                onSubmit={handleResetPassword} className="flex flex-col gap-6 text-left"
              >
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block px-1">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input 
                      type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full bg-zinc-950/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-zinc-200 focus:outline-none focus:border-purple-500/50 transition-all font-sans"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block px-1">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input 
                      type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full bg-zinc-950/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-zinc-200 focus:outline-none focus:border-purple-500/50 transition-all font-sans"
                    />
                  </div>
                </div>
                <button 
                  disabled={loading} type="submit" 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all"
                >
                  {loading ? 'Updating...' : 'Reset Password'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
