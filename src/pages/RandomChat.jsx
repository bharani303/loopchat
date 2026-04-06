import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { MessageSquare, LogOut, Compass, ArrowLeft, RefreshCw, X, Send, ShieldCheck, Zap } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { getUserProfileApi } from '../services/api';

export default function RandomChat() {
  const { currentUser, logout } = useAuth();
  const { onlineUsers, setSelectedUser, messages: contextMessages, sendMessage, isConnected, recentUsers } = useChat();
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle'); // idle, searching, paired
  const [partner, setPartner] = useState(null);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef(null);

  // Clear selection on mount and unmount ensures we start fresh
  useEffect(() => {
    setSelectedUser(null);
    return () => setSelectedUser(null);
  }, [setSelectedUser]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [contextMessages]);

  const startSearch = () => {
    setStatus('searching');
    setPartner(null);
    setSelectedUser(null);
    
    // Pick a real random online user who IS NOT a recent friend
    setTimeout(() => {
      const recentEmails = recentUsers.map(u => u.email);
      const strangers = onlineUsers.filter(email => 
        email !== currentUser?.email && !recentEmails.includes(email)
      );
      
      if (strangers.length > 0) {
        const randomEmail = strangers[Math.floor(Math.random() * strangers.length)];
        
        getUserProfileApi(randomEmail)
          .then(res => {
            const newPartner = res.data;
            setPartner(newPartner);
            setSelectedUser(newPartner);
            setStatus('paired');
          })
          .catch(err => {
             console.error("Failed to load stranger profile", err);
             // Fallback
             const username = randomEmail.split('@')[0];
             const newPartner = { 
               username: username, 
               email: randomEmail,
               bio: 'A live LoopChat stranger! 👋'
             };
             setPartner(newPartner);
             setSelectedUser(newPartner); 
             setStatus('paired');
          });
      } else {
        setStatus('idle');
        const msg = onlineUsers.length <= 1 
          ? "No one else is online right now! 🌑" 
          : "You've already chatted with everyone online! Go say hi to your friends on the Dashboard. 🚀";
        alert(msg);
      }
    }, 2000);
  };

  const stopChat = () => {
    setStatus('idle');
    setPartner(null);
    setSelectedUser(null);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (inputText.trim() && status === 'paired' && isConnected) {
      sendMessage(inputText);
      setInputText('');
    }
  };

  return (
    <div className="flex h-[100dvh] w-full bg-[#1E1F22] font-sans text-[#DBDEE1] overflow-hidden selection:bg-[#8b5cf6] selection:text-white">
      
      {/* 1. Sidebar (Discord Style) */}
      <div className="w-[72px] flex-shrink-0 bg-[#1E1F22] pt-3 pb-4 flex flex-col items-center gap-2 z-20 border-r border-[#111214]">
        <div className="w-12 h-12 rounded-[24px] hover:rounded-[16px] bg-[#313338] text-[#DBDEE1] hover:text-white flex items-center justify-center transition-all duration-300 cursor-pointer shadow-lg mb-2" onClick={() => navigate('/dashboard')}>
          <MessageSquare className="w-6 h-6" />
        </div>
        <div className="w-8 h-[2px] bg-[#313338] rounded-full mx-auto my-1" />
        <div className="w-12 h-12 rounded-[16px] bg-[#23A559] text-white flex items-center justify-center transition-all duration-300 cursor-pointer shadow-lg shadow-[#23A559]/20">
          <Compass className="w-6 h-6" />
        </div>
        <div className="mt-auto flex flex-col items-center gap-3">
           <div 
             className="w-12 h-12 rounded-[24px] hover:rounded-[16px] overflow-hidden cursor-pointer transition-all duration-300 ring-2 ring-transparent hover:ring-[#8b5cf6]"
             onClick={() => navigate('/profile-setup')}
             title="Your Profile"
           >
             <Avatar className="w-full h-full rounded-none">
               <AvatarImage src={currentUser?.profileImage || `https://api.dicebear.com/7.x/notionists/svg?seed=${currentUser?.username || 'member'}`} />
               <AvatarFallback>{(currentUser?.username || 'U').substring(0, 2).toUpperCase()}</AvatarFallback>
             </Avatar>
           </div>
           
           <div className="w-12 h-12 rounded-[24px] hover:rounded-[16px] bg-[#313338] hover:bg-[#DA373C] text-[#DBDEE1] hover:text-white flex items-center justify-center transition-all duration-300 cursor-pointer" onClick={logout} title="Logout">
             <LogOut className="w-5 h-5 ml-1" />
           </div>
        </div>
      </div>

      {/* 2. Main Content */}
      <div className="flex-1 flex flex-col relative bg-[#313338] min-w-0">
        <div className="h-14 border-b border-[#1F2023]/60 flex items-center justify-between px-4 md:px-6 bg-[#313338]/95 backdrop-blur-sm z-10 shrink-0">
          <div className="flex items-center gap-2 md:gap-4 truncate">
            <div className="flex items-center gap-2 shrink-0">
              <Compass className="w-5 h-5 text-[#23A559]" />
              <h1 className="font-bold text-[#F2F3F5] text-base md:text-lg hidden sm:block">Random Discover</h1>
            </div>
            <div className="h-4 w-px bg-[#3F4147] hidden sm:block" />
            <div className="flex items-center gap-2 text-[#949BA4] text-xs md:text-sm truncate">
              <Zap className="w-3 md:w-4 h-3 md:h-4 text-amber-500 fill-amber-500" />
              <span className="truncate">{Math.max(0, onlineUsers.length - (onlineUsers.includes(currentUser?.email) ? 1 : 0))} Users Online</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-3">
             <div className="flex items-center gap-1.5 px-2 md:px-3 py-1 bg-[#232428] rounded-full border border-[#1F2023]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#23A559]" />
                <span className="text-[10px] md:text-xs font-bold text-[#F2F3F5]">ANONYMOUS</span>
             </div>
             <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-[#3F4147] rounded-full transition-colors text-[#949BA4] hover:text-[#F2F3F5]">
               <ArrowLeft className="w-5 h-5" />
             </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
          <div className="flex-1 flex flex-col p-4 md:p-6 gap-4 border-b lg:border-b-0 lg:border-r border-[#1F2023]/40 overflow-y-auto min-h-0 scrollbar-hide">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-[300px] lg:min-h-0">
                <div className="bg-[#1E1F22] rounded-2xl relative overflow-hidden border-2 border-[#111214] flex items-center justify-center shadow-2xl min-h-[150px]">
                   <div className="absolute top-4 left-4 z-10 bg-black/40 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold border border-white/10 uppercase tracking-widest">You</div>
                   <Avatar className="w-24 h-24 md:w-32 lg:w-48 lg:h-48 ring-8 ring-[#8b5cf6]/20">
                     <AvatarImage src={currentUser?.profileImage || `https://api.dicebear.com/7.x/notionists/svg?seed=${currentUser?.username}`} />
                     <AvatarFallback>ME</AvatarFallback>
                   </Avatar>
                </div>

                <div className={`bg-[#1E1F22] rounded-2xl relative overflow-hidden flex items-center justify-center transition-all duration-500 border-2 shadow-2xl min-h-[150px] ${status === 'paired' ? 'border-[#23A559]/50' : 'border-[#111214]'}`}>
                   <div className="absolute top-4 left-4 z-10 bg-black/40 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold border border-white/10 uppercase tracking-widest">
                     {status === 'paired' ? partner?.username : 'Stranger'}
                   </div>
                   {status === 'searching' ? (
                     <div className="flex flex-col items-center gap-4 animate-pulse">
                       <div className="w-24 h-24 lg:w-48 lg:h-48 rounded-full bg-[#2B2D31] flex items-center justify-center">
                         <RefreshCw className="w-10 lg:w-16 h-10 lg:h-16 text-[#8b5cf6] animate-spin" />
                       </div>
                       <p className="text-[#8b5cf6] font-bold text-base tracking-widest uppercase">Finding...</p>
                     </div>
                   ) : status === 'paired' ? (
                     <Avatar className="w-24 h-24 lg:w-48 lg:h-48 ring-8 ring-[#23A559]/10 transition-transform hover:scale-105 duration-300">
                       <AvatarImage src={partner?.profileImage || `https://api.dicebear.com/7.x/notionists/svg?seed=${partner?.username}`} />
                       <AvatarFallback>?</AvatarFallback>
                     </Avatar>
                   ) : (
                     <div className="text-center p-4">
                       <div className="w-16 h-16 rounded-full bg-[#2B2D31] mx-auto mb-4 flex items-center justify-center shadow-lg">
                          <X className="w-8 h-8 text-[#949BA4]" />
                       </div>
                       <h3 className="text-lg font-bold text-[#F2F3F5] truncate">No Connection</h3>
                     </div>
                   )}
                </div>
             </div>

             <div className="flex items-center justify-center gap-4 py-2 shrink-0">
                {status === 'searching' ? (
                   <button onClick={stopChat} className="px-8 py-3 bg-[#DA373C] hover:bg-[#A92B2F] text-white font-bold rounded-xl transition-all shadow-xl active:scale-95">
                     Cancel Search
                   </button>
                ) : status === 'paired' ? (
                   <button onClick={stopChat} className="px-8 py-3 bg-[#DA373C] hover:bg-[#A92B2F] text-white font-bold rounded-xl transition-all shadow-xl flex items-center gap-2">
                      <LogOut className="w-5 h-5" />
                      Next Partner
                   </button>
                ) : (
                   <button onClick={startSearch} className="  p-3  bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-black text-xl rounded-2xl transition-all shadow-2xl active:scale-95 flex items-center gap-3 uppercase">
                     Discover <Zap className="w-9 h-8 fill-white" />
                   </button>
                )}
             </div>
          </div>

          <div className="w-full lg:w-[400px] flex flex-col bg-[#2B2D31] relative min-h-0 shrink-0">
             <div className="absolute inset-0 pointer-events-none chat-bg-pattern opacity-50 z-0" />
             <div className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth custom-scrollbar min-h-0 relative z-10">
                {contextMessages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
                     <MessageSquare className="w-12 h-12 mb-4 text-[#949BA4]" />
                     <p className="font-bold text-[#F2F3F5]">
                        {status === 'paired' ? 'Connected! Say hi!' : 'Waiting...'}
                     </p>
                  </div>
                )}
                <div className="space-y-4">
                   {status === 'paired' && (
                     <div className="flex flex-col items-center">
                        <div className="bg-[#1E1F22] px-4 py-1.5 rounded-full border border-[#111214] text-[10px] font-bold text-[#949BA4] uppercase tracking-widest my-4">
                           Paired with @{partner?.username}
                        </div>
                     </div>
                   )}
                   {contextMessages.map((msg, idx) => {
                      const isOwn = msg.sender === currentUser?.email;
                      return (
                        <div key={idx} className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                           <div className={`px-4 py-2.5 rounded-2xl text-[14px] max-w-[85%] shadow-sm ${isOwn ? 'bg-[#8b5cf6] text-white rounded-br-sm' : 'bg-[#1E1F22] text-[#DBDEE1] rounded-bl-sm border border-[#1F2023]'}`}>
                              {msg.content}
                           </div>
                           <div className="mt-1 flex items-center gap-1.5 px-2">
                             <span className="text-[10px] text-[#949BA4] font-medium">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                           </div>
                        </div>
                      );
                   })}
                   <div ref={scrollRef} className="h-4" />
                </div>
             </div>

             <div className="p-4 bg-[#232428] border-t border-[#1F2023]/60 shrink-0">
                <form onSubmit={handleSend} className="flex gap-2">
                   <div className="flex-1 bg-[#1E1F22] rounded-xl border border-[#111214] focus-within:border-[#8b5cf6]/50 transition-all flex items-center px-4">
                      <input 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        disabled={status !== 'paired'}
                        placeholder={status === 'paired' ? 'Message...' : 'Pairing...'}
                        className="w-full bg-transparent border-0 outline-none h-10 text-sm text-[#DBDEE1] placeholder:text-[#949BA4]"
                      />
                   </div>
                   <button type="submit" disabled={!inputText.trim() || status !== 'paired'} className="w-10 h-10 bg-[#8b5cf6] hover:bg-[#7c3aed] disabled:bg-[#313338] rounded-xl flex items-center justify-center text-white transition-all shadow-lg active:scale-95">
                     <Send className="w-5 h-5" />
                   </button>
                </form>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
