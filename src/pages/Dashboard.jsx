import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import AiPanel from '../components/AiPanel';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { MessageSquare, Settings, LogOut, Compass, X } from 'lucide-react';
import { getUserProfileApi } from '../services/api';

export default function Dashboard() {
  const { selectedUser } = useChat();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [fullProfile, setFullProfile] = React.useState(null);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [inputForAi, setInputForAi] = useState({ text: '', ts: 0 });
  const [showRightProfilePic, setShowRightProfilePic] = useState(false);

  React.useEffect(() => {
    const identifier = selectedUser?.email || selectedUser?.username;
    if (identifier) {
      setFullProfile(selectedUser); // Start with partial
      getUserProfileApi(identifier)
        .then(res => setFullProfile(res.data))
        .catch(err => console.error("Failed to fetch full profile", err));
    } else {
      setFullProfile(null);
      setIsAiOpen(false); // Close AI panel when no user selected
    }
  }, [selectedUser]);
  
  // profileUser for the right panel
  const profileUser = fullProfile;

  const handleToggleAi = () => {
    setIsAiOpen(prev => !prev);
  };

  // Called when AI panel "Use this" is clicked — sets the chat input
  const handleAiUseMessage = (text) => {
    setInputForAi({ text, ts: Date.now() });
    setIsAiOpen(false); // 🔥 Auto-close panel after using suggestion
  };

  return (
    <div className="flex h-[100dvh] w-full bg-[#1E1F22] font-sans text-[#DBDEE1] overflow-hidden selection:bg-[#8b5cf6] selection:text-white">
      
      {/* 1. Ultra-left Server Bar (Discord style) - Hidden on mobile if chat open */}
      <div className={`w-[72px] flex-shrink-0 bg-[#1E1F22] pt-3 pb-4 flex flex-col items-center gap-2 z-20 ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
        <div className="w-12 h-12 rounded-[24px] hover:rounded-[16px] bg-[#313338] text-[#DBDEE1] hover:text-white flex items-center justify-center transition-all duration-300 cursor-pointer shadow-lg mb-2" onClick={() => navigate('/dashboard')}>
          <MessageSquare className="w-6 h-6" />
        </div>
        <div className="w-8 h-[2px] bg-[#313338] rounded-full mx-auto my-1" />
        <div 
          onClick={() => navigate('/random-chat')}
          className="w-12 h-12 rounded-[24px] hover:rounded-[16px] bg-[#313338] hover:bg-[#23A559] text-[#DBDEE1] hover:text-white flex items-center justify-center transition-all duration-300 cursor-pointer group"
        >
          <Compass className="w-6 h-6 group-hover:scale-110 transition-transform" />
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

      {/* 2. Left Sidebar (DMs List) - Hidden on mobile if chat open */}
      <div className={`flex-shrink-0 flex-1 md:flex-initial md:w-[240px] lg:w-[260px] ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
        <Sidebar className="w-full h-full" />
      </div>

      {/* 3. Center Chat Panel - Hidden on mobile if NO chat open */}
      <div className={`flex-1 flex flex-col min-w-0 ${!selectedUser ? 'hidden md:flex' : 'flex'}`}>
        <ChatWindow 
          onToggleAi={handleToggleAi} 
          isAiOpen={isAiOpen}
          aiInputText={inputForAi}
        />
      </div>

      {/* 4. AI Panel - Slides in from right when toggled */}
      {selectedUser && isAiOpen && (
        <AiPanel 
          isOpen={isAiOpen}
          onClose={() => setIsAiOpen(false)}
          onUseMessage={handleAiUseMessage}
        />
      )}

      {/* 5. Right Profile Panel - Only on large screens when a user is selected AND AI panel is closed */}
      {profileUser && !isAiOpen && (
        <div className="w-[300px] lg:w-[340px] flex-shrink-0 bg-[#2B2D31] flex flex-col overflow-y-auto border-l border-[#1F2023]/60 hidden xl:flex">
          <div className="h-[120px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
          
          <div className="px-4 pb-6 relative -mt-12 bg-[#111214] mx-4 rounded-xl shadow-xl flex-shrink-0 mb-4 border border-[#1E1F22]">
            <div className="absolute top-0 right-0 p-3">
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-[#2B2D31] flex items-center justify-center text-[#B5BAC1] hover:text-[#DBDEE1] cursor-pointer" onClick={() => navigate('/dashboard')}>
                  <MessageSquare className="w-4 h-4" />
                </div>
              </div>
            </div>
            
            <div className="relative inline-block border-6 border-[#111214] rounded-full mt-4 bg-[#111214]">
              <Avatar 
                className="w-[84px] h-[84px] cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setShowRightProfilePic(true)}
              >
                <AvatarImage src={profileUser?.profileImage || `https://api.dicebear.com/7.x/notionists/svg?seed=${profileUser?.username || 'member'}`} />
                <AvatarFallback>{profileUser?.username?.substring(0,2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="absolute bottom-1 right-1 w-5 h-5 bg-[#23A559] border-[4px] border-[#111214] rounded-full" />
            </div>
            
            <div className="mt-2 bg-[#111214] rounded-lg text-left">
              <h2 className="text-xl font-bold text-white leading-tight">{(profileUser?.username || 'Member').split('@')[0]}</h2>
              <p className="text-sm text-[#8b5cf6] font-medium tracking-tight">@{(profileUser?.username || 'member').split('@')[0].toLowerCase()}</p>
              
              <div className="w-full h-[1px] bg-[#2B2D31] my-4" />
              
              <h4 className="text-xs font-bold text-[#DBDEE1] uppercase mb-2">About Me</h4>
              <p className="text-sm text-[#B5BAC1] leading-relaxed">
                {(profileUser?.bio && profileUser.bio.trim() !== "") ? profileUser.bio : "Just exploring LoopChat! 🚀"}
              </p>
              
              <h4 className="text-xs font-bold text-[#DBDEE1] uppercase mt-4 mb-2">LoopChat Member Since</h4>
              <p className="text-sm text-[#B5BAC1]">April 4, 2026</p>
            </div>
          </div>
        </div>
      )}

      {/* 6. Profile Picture Viewer Portal */}
      {showRightProfilePic && profileUser && createPortal(
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200" 
          onClick={() => setShowRightProfilePic(false)}
        >
          <div className="relative flex flex-col items-center max-w-[90vw] max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <img 
              src={profileUser.profileImage || `https://api.dicebear.com/7.x/notionists/svg?seed=${profileUser.username || 'member'}`} 
              alt={`${profileUser.username}'s profile`} 
              className="max-w-full max-h-[80vh] object-contain rounded-full shadow-2xl ring-4 ring-[#2B2D31]" 
            />
            <h3 className="text-white text-xl font-bold mt-6">{profileUser.username}</h3>
            <button 
              className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-all" 
              onClick={() => setShowRightProfilePic(false)}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
