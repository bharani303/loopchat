import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ArrowLeft, Mail, Lock, Sparkles, User, Calendar, Phone, ShieldCheck, ArrowRight, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { registerUser, sendOtp, verifyOtp, loginUser } from '../services/api';
import { Button } from '../components/ui/button';
import { GoogleLogin } from '@react-oauth/google';

export default function CreateAccount() {
  const navigate = useNavigate();
  
  // States
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [formData, setFormData] = useState({
    username: '', phoneNumber: '', dateOfBirth: '', gender: 'male', password: '', confirmPassword: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

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
    else if (step === 3) setStep(1); 
    else navigate('/login');
  };

  const handleSendEmailOtp = async (e) => {
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
      setError(err?.response?.data?.message || err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

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
      setEmailVerified(true);
      setStep(3); 
    } catch (err) {
      const errorMessage = err?.response?.data?.message || (typeof err?.response?.data === 'string' ? err?.response?.data : 'Invalid OTP. Please try again.');
      setError(errorMessage);
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
      setError('Failed to resend OTP.');
    } finally {
      setIsResending(false);
    }
  };

  const handleFinalRegister = async (e) => {
    e.preventDefault();
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    setLoading(true);
    setError('');
    try {
      await registerUser({
        username: formData.username,
        email: email,
        phoneNumber: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        password: formData.password
      });
      navigate('/login');
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    navigate('/under-construction');
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.1 }
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  // Helper for rendering input fields consistently
  const renderInput = (label, icon, type, value, onChange, placeholder, isSelect = false, options = []) => (
    <motion.div variants={itemVariants} className="space-y-1.5 w-full">
      <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest pl-1">{label}</label>
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
        <div className="relative flex items-center bg-zinc-950/50 border border-white/10 rounded-xl overflow-hidden focus-within:border-purple-500/50 focus-within:ring-1 focus-within:ring-purple-500/50 transition-all">
          {icon && (
            <div className="pl-4 pr-3 text-zinc-500 group-focus-within:text-purple-400 transition-colors">
              {icon}
            </div>
          )}
          {isSelect ? (
            <>
              <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`flex-1 bg-transparent border-0 text-zinc-200 h-14 ${icon ? 'pl-0' : 'pl-4'} py-0 focus-visible:ring-0 appearance-none font-medium pr-10 focus:outline-none`}
                required
              >
                {options.map(opt => <option className="bg-zinc-900" key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              <div className="absolute right-4 pointer-events-none text-zinc-500">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </div>
            </>
          ) : (
            <input 
              type={type} 
              value={value}
              onChange={(e) => onChange(e.target.value)}
              required
              placeholder={placeholder} 
              style={type === 'date' ? { colorScheme: 'dark' } : {}}
              className={`flex-1 bg-transparent border-0 text-zinc-200 h-14 ${icon ? 'pl-0' : 'pl-4'} pr-4 py-0 focus-visible:ring-0 focus:outline-none placeholder:text-zinc-700 font-medium w-full`}
            />
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden fixed">
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
        onClick={onBack}
        className="fixed top-8 left-8 p-3 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all z-20 flex items-center gap-2 group backdrop-blur-md"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium pr-2 hidden sm:block">
          {step === 1 ? 'Back to Login' : step === 2 ? 'Change Email' : 'Back to Step 1'}
        </span>
      </button>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[500px] relative z-10 my-auto py-12"
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
              <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Create Account</h2>
              <p className="text-sm text-zinc-400 text-center">
                {step === 1 ? 'Enter your email to join Loopchat.' : step === 2 ? 'We sent a verification code to your email.' : 'Complete your profile to get started.'}
              </p>
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }} 
                  animate={{ opacity: 1, height: 'auto', marginBottom: 24 }} 
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium p-3 rounded-xl flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span>{typeof error === 'string' ? error : String(error?.message || 'An error occurred')}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {/* STEP 1: EMAIL INPUT */}
              {step === 1 && (
                <motion.form 
                  key="step1" variants={containerVariants} initial="hidden" animate="visible" exit="exit"
                  onSubmit={handleSendEmailOtp} className="flex flex-col gap-6"
                >
                  {renderInput("Email Address", <Mail className="w-5 h-5" />, "email", email, setEmail, "name@loopchat.gg")}
                  
                   <motion.div variants={itemVariants} className="pt-2">
                     <Button 
                       type="submit" disabled={loading} 
                       className="w-full relative group overflow-hidden bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-bold h-14 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_8px_20px_rgba(168,85,247,0.3)] hover:shadow-[0_8px_25px_rgba(168,85,247,0.4)] border-t border-white/20 flex items-center justify-center gap-2"
                     >
                       {loading ? 'Sending Code...' : (
                         <>Continue with Email <ArrowRight className="w-4 h-4" /></>
                       )}
                     </Button>
                   </motion.div>

                   {/* OR DIVIDER */}
                   <motion.div variants={itemVariants} className="flex items-center gap-4 my-2">
                     <div className="h-[1px] flex-1 bg-white/10" />
                     <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">or continue with</span>
                     <div className="h-[1px] flex-1 bg-white/10" />
                   </motion.div>

                    {/* GOOGLE LOGIN BUTTON (UNDER CONSTRUCTION) */}
                    <motion.div variants={itemVariants} className="flex justify-center flex-col items-center gap-2">
                      <button 
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full h-12 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-3 group px-4 relative"
                      >
                        <div className="absolute -top-3 -right-3 bg-purple-500 text-[9px] font-bold px-2 py-0.5 rounded-full text-white shadow-lg animate-pulse ring-2 ring-zinc-950">
                          COMING SOON
                        </div>
                        <svg width="20" height="20" viewBox="0 0 24 24">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        <span className="text-zinc-200 font-bold text-sm tracking-wide">Sign up with Google</span>
                      </button>
                    </motion.div>
                  </motion.form>
              )}

              {/* STEP 2: OTP ENTRY */}
              {step === 2 && (
                <motion.div 
                  key="step2" variants={containerVariants} initial="hidden" animate="visible" exit="exit"
                  className="flex flex-col items-center w-full"
                >
                  <motion.div variants={itemVariants} className="mb-6 text-sm text-center bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-zinc-300 w-full">
                    Code sent to <span className="font-bold text-white">{email}</span>
                  </motion.div>

                  <motion.div variants={itemVariants} className="flex justify-between gap-2 px-1 w-full mb-8">
                    {otp.map((data, index) => (
                      <input
                        key={index} type="text" maxLength="1" autoFocus={index === 0}
                        className="w-12 sm:w-14 h-14 sm:h-16 bg-zinc-950/50 border border-white/10 rounded-xl text-center text-2xl font-bold text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all shadow-inner placeholder:text-zinc-700"
                        value={data}
                        onChange={(e) => handleOtpChange(e.target, index)}
                        onKeyDown={(e) => handleOtpKeyDown(e, index)}
                        placeholder="-"
                      />
                    ))}
                  </motion.div>
                  
                  <motion.div variants={itemVariants} className="w-full">
                    <Button 
                      onClick={handleVerifyOtp} disabled={loading || otp.some(d => d === '')} 
                      className={`w-full relative group overflow-hidden font-bold h-14 rounded-xl transition-all border-t border-white/20 flex items-center justify-center gap-2 ${
                        otp.some(d => d === '') 
                          ? 'bg-zinc-800/50 text-zinc-500 border-white/5 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white hover:scale-[1.02] active:scale-[0.98] shadow-[0_8px_20px_rgba(168,85,247,0.3)] hover:shadow-[0_8px_25px_rgba(168,85,247,0.4)]'
                      }`}
                    >
                      {loading ? 'Verifying...' : (
                        <>Verify Code <ShieldCheck className="w-5 h-5" /></>
                      )}
                    </Button>
                  </motion.div>

                  <motion.div variants={itemVariants} className="mt-8 text-sm text-zinc-500">
                    Didn't receive the code?{' '}
                    {timer > 0 ? (
                      <span className="text-zinc-400 font-mono font-medium">Resend in {timer}s</span>
                    ) : (
                      <button 
                        onClick={handleResendOtp} disabled={isResending}
                        className="text-purple-400 hover:text-white transition-colors font-medium inline-flex items-center gap-1.5 uppercase tracking-wider text-[11px]"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                        Resend Now
                      </button>
                    )}
                  </motion.div>
                </motion.div>
              )}

              {/* STEP 3: FULL DETAILS */}
              {step === 3 && (
                <motion.form 
                  key="step3" variants={containerVariants} initial="hidden" animate="visible" exit="exit"
                  onSubmit={handleFinalRegister} className="flex flex-col gap-5 text-left w-full"
                >
                  <motion.div variants={itemVariants} className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 px-4 flex items-center gap-3 mb-2 shadow-inner">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <div className="flex-1">
                      <p className="text-green-400 text-[10px] font-bold uppercase tracking-widest">Email Verified</p>
                      <p className="text-zinc-200 text-sm font-medium">{email}</p>
                    </div>
                  </motion.div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {renderInput("Username", <User className="w-4 h-4" />, "text", formData.username, (val) => setFormData({...formData, username: val}), "loopmaster")}
                    {renderInput("Phone Number", <Phone className="w-4 h-4" />, "tel", formData.phoneNumber, (val) => setFormData({...formData, phoneNumber: val}), "+1 234 567 890")}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {renderInput("Date of Birth", <Calendar className="w-4 h-4" />, "date", formData.dateOfBirth, (val) => setFormData({...formData, dateOfBirth: val}), "")}
                    {renderInput("Gender", null, "select", formData.gender, (val) => setFormData({...formData, gender: val}), "", true, [
                      { value: 'male', label: 'Male' },
                      { value: 'female', label: 'Female' },
                      { value: 'other', label: 'Other' },
                      { value: 'prefer_not_to_say', label: 'Prefer not to say' }
                    ])}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1">
                      {renderInput("Password", <Lock className="w-4 h-4" />, "password", formData.password, (val) => setFormData({...formData, password: val}), "••••••••")}
                      <p className={`text-[10px] pl-1 transition-colors ${formData.password.length >= 8 ? 'text-green-500' : 'text-zinc-500'}`}>
                        Minimum 8 characters
                      </p>
                    </div>
                    {renderInput("Confirm Password", <Lock className="w-4 h-4" />, "password", formData.confirmPassword, (val) => setFormData({...formData, confirmPassword: val}), "••••••••")}
                  </div>

                  <motion.div variants={itemVariants} className="pt-4 w-full">
                    <Button 
                      disabled={loading} type="submit" 
                      className="w-full relative group overflow-hidden bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-bold h-14 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_8px_20px_rgba(168,85,247,0.3)] hover:shadow-[0_8px_25px_rgba(168,85,247,0.4)] border-t border-white/20"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating Account...
                        </span>
                      ) : 'Complete Registration'}
                    </Button>
                  </motion.div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          <div className="border-t border-white/5 bg-white/[0.02] p-6 text-center mt-2 w-full">
            <p className="text-sm text-zinc-400">
              Already have an account?{' '}
              <button 
                type="button" 
                onClick={() => navigate('/login')} 
                className="text-white hover:text-purple-400 transition-colors font-semibold tracking-wide ml-1"
              >
                Log In
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
