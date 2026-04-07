import React, { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { Phone, Video, HelpCircle, PlusCircle, Smile, Inbox, ArrowLeft, Loader2, Sparkles, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
const EmojiPicker = lazy(() => import('emoji-picker-react'));
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import MessageBubble from './MessageBubble';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { uploadMedia } from '../services/upload';
import ImageCropModal from './ImageCropModal';

export default function ChatWindow({ onToggleAi, isAiOpen, aiInputText }) {
  const { selectedUser, setSelectedUser, messages, sendMessage, isConnected } = useChat();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImageToCrop, setSelectedImageToCrop] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [showProfilePic, setShowProfilePic] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);

  // Close emoji picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onEmojiClick = (emojiObject) => {
    setInputText((prev) => prev + emojiObject.emoji);
  };

  // Sync AI-provided text into input (object with { text, ts })
  useEffect(() => {
    if (aiInputText?.text) {
      setInputText(aiInputText.text);
      // 🔥 Auto-focus the input after 50ms so user can send immediately
      setTimeout(() => {
        document.getElementById('chat-input')?.focus();
      }, 50);
    }
  }, [aiInputText]);

  // Smooth scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      sendMessage(inputText, 'TEXT');
      setInputText('');
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImageToCrop(reader.result);
        setOriginalFile(file);
      };
      reader.readAsDataURL(file);
    } else {
      try {
        setIsUploading(true);
        const { url, type } = await uploadMedia(file);
        sendMessage(url, type);
      } catch (error) {
        console.error("Upload failed", error);
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  const handleCropComplete = async (croppedBlob) => {
    setSelectedImageToCrop(null);
    try {
      setIsUploading(true);
      const croppedFile = new File([croppedBlob], originalFile.name || 'cropped.jpg', { type: 'image/jpeg' });
      const { url, type } = await uploadMedia(croppedFile);
      sendMessage(url, type);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setIsUploading(false);
      setOriginalFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCropCancel = () => {
    setSelectedImageToCrop(null);
    setOriginalFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleBack = () => {
    setSelectedUser(null);
  };

  // Called from AiPanel when user clicks "Use this"
  const handleAiUseMessage = (text) => {
    setInputText(text);
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#313338] text-[#949BA4]">
        <div className="bg-[#1E1F22] rounded-full p-4 mb-4 shadow-lg border border-[#111214]">
          <svg aria-hidden="true" role="img" width="48" height="48" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M21 4H3C1.89543 4 1 4.89543 1 6V18C1 19.1046 1.89543 20 3 20H21C22.1046 20 23 19.1046 23 18V6C23 4.89543 22.1046 4 21 4ZM19.5 6L12 11.25L4.5 6H19.5ZM3 7.875V18H21V7.875L12 14.175L3 7.875Z"></path></svg>
        </div>
        <p className="text-xl font-bold text-[#F2F3F5]">No Direct Message Selected</p>
        <p className="text-sm mt-2 font-medium">Select a friend to start chatting</p>
      </div>
    );
  }

  // conversationMessages are already filtered in ChatContext (using messagesMap[key])
  const conversationMessages = messages;

  // Build email → username map for display
  const emailToName = {};
  const emailToAvatar = {};
  if (currentUser?.email) {
    emailToName[currentUser.email] = currentUser.username || currentUser.email;
    emailToAvatar[currentUser.email] = currentUser.profileImage;
  }
  if (selectedUser?.email) {
    emailToName[selectedUser.email] = selectedUser.username || selectedUser.email;
    emailToAvatar[selectedUser.email] = selectedUser.profileImage;
  }

  // Helper to format date label
  const formatDateLabel = (timestamp) => {
    if (!timestamp) return 'Today';
    const date = new Date(timestamp);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Set message date to midnight for comparison
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    if (compareDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (compareDate.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    }
  };

  // Build array of messages with date separators
  const messagesWithDates = [];
  let lastDateLabel = null;

  conversationMessages.forEach((msg, idx) => {
    const msgDateLabel = formatDateLabel(msg.timestamp || Date.now());
    
    if (msgDateLabel !== lastDateLabel) {
      messagesWithDates.push({ type: 'date', label: msgDateLabel, id: `date-${idx}` });
      lastDateLabel = msgDateLabel;
    }
    messagesWithDates.push({ type: 'message', message: msg, idx });
  });

  return (
    <div className="flex-1 flex flex-col bg-[#313338] relative min-w-0 h-full overflow-hidden">
      {/* Chat Header */}
      <div className="h-14 border-b border-[#1F2023]/60 flex items-center justify-between px-4 bg-[#313338]/95 z-20 shrink-0 backdrop-blur-sm shadow-sm">
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Back button - only visible on mobile (md:hidden) */}
          <button 
            onClick={handleBack}
            className="md:hidden p-2 -ml-2 hover:bg-[#3F4147] rounded-full transition-colors text-[#B5BAC1] hover:text-[#DBDEE1]"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          <div 
            className="flex items-center gap-2 cursor-pointer hover:bg-[#3F4147]/50 p-1.5 -ml-1.5 rounded-lg transition-colors"
            onClick={() => setShowProfilePic(true)}
          >
            <Avatar className="w-7 h-7 rounded-full shrink-0 shadow-sm">
              <AvatarImage src={selectedUser.profileImage || `https://api.dicebear.com/7.x/notionists/svg?seed=${selectedUser.username}`} />
              <AvatarFallback>{selectedUser.username.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h3 className="font-bold text-[#F2F3F5] text-[15px] truncate leading-tight">{selectedUser.username}</h3>
              <div className="flex items-center gap-1.5">
                <div className="w-[8px] h-[8px] rounded-full bg-[#23A559]" />
                <span className="text-[11px] font-medium text-[#23A559]">Online</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-[#B5BAC1]">
           {/* 🤖 AI Toggle Button */}
           <button
             onClick={onToggleAi}
             className={`relative p-1.5 rounded-lg transition-all duration-300 group ${
               isAiOpen 
                 ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' 
                 : 'hover:text-[#DBDEE1] hover:bg-[#3F4147]'
             }`}
             title="Toggle Loop AI"
           >
             <Sparkles className={`w-5 h-5 transition-transform duration-300 ${isAiOpen ? 'scale-110' : 'group-hover:scale-110'}`} />
             {!isAiOpen && (
               <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-purple-500 rounded-full animate-pulse border-2 border-[#313338]" />
             )}
           </button>

           <Phone className="w-5 h-5 cursor-pointer hover:text-[#DBDEE1] transition-colors hidden sm:block" onClick={() => navigate('/under-construction')} />
           <Video className="w-5 h-5 cursor-pointer hover:text-[#DBDEE1] transition-colors hidden sm:block" onClick={() => navigate('/under-construction')} />
           <div className="w-px h-5 bg-[#3F4147] mx-1 hidden sm:block" />
           <Inbox className="w-5 h-5 cursor-pointer hover:text-[#DBDEE1] transition-colors" onClick={() => navigate('/under-construction')} />
           <HelpCircle className="w-5 h-5 cursor-pointer hover:text-[#DBDEE1] transition-colors" onClick={() => navigate('/under-construction')} />
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 relative bg-[#1a1b1e] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none chat-bg-pattern z-0" />
        
        <div className="absolute inset-0 overflow-y-auto custom-scrollbar z-10 flex flex-col">
          <div className="flex flex-col py-8 min-h-full">
           {/* Welcome area (only at the top of history) */}
           <div className="flex flex-col items-center pb-12 px-4 text-center">
              <Avatar 
                className="w-20 h-20 rounded-full mb-4 shadow-2xl ring-4 ring-[#1E1F22] cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setShowProfilePic(true)}
              >
                <AvatarImage src={selectedUser.profileImage || `https://api.dicebear.com/7.x/notionists/svg?seed=${selectedUser.username}`} />
                <AvatarFallback>{selectedUser.username.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <h2 className="text-3xl font-bold text-[#F2F3F5] leading-none mb-3">{selectedUser.username}</h2>
              <p className="text-[15px] font-medium text-[#949BA4] max-w-[420px] leading-relaxed">
                This is the beginning of your direct message history with <strong className="text-[#DBDEE1]">@{selectedUser.username}</strong>.
              </p>
           </div>

           {/* Messages Container */}
           <div className="flex flex-col gap-1 px-2">
             {messagesWithDates.map((item) => {
                if (item.type === 'date') {
                  return (
                    <div key={item.id} className="flex items-center justify-center my-6">
                       <div className="flex-1 h-[1px] bg-[#2B2D31]/40" />
                       <span className="bg-[#2B2D31]/80 backdrop-blur px-5 py-1 text-[11px] font-bold text-[#B5BAC1] rounded-full mx-4 uppercase tracking-[0.1em] shadow-sm">{item.label}</span>
                       <div className="flex-1 h-[1px] bg-[#2B2D31]/40" />
                    </div>
                  );
                } else {
                  const msg = item.message;
                  const idx = item.idx;
                  return (
                    <MessageBubble 
                      key={idx} 
                      message={msg} 
                      isOwn={msg.sender === currentUser?.email} 
                      previousMessage={idx > 0 ? conversationMessages[idx-1] : null}
                      senderName={emailToName[msg.sender] || msg.sender}
                      senderAvatar={emailToAvatar[msg.sender]}
                    />
                  );
                }
             })}
             <div ref={scrollRef} className="h-6 shrink-0" />
           </div>
        </div>
      </div>
    </div>

      {/* Input Area */}
      <div className="px-4 py-4 bg-[#1a1b1e] border-t border-[#2B2D31]/50 shrink-0">
        <form onSubmit={handleSend} className="flex items-center gap-2 sm:gap-3 max-w-6xl mx-auto">
          <div className="flex items-center text-[#72767D] shrink-0 relative" ref={emojiPickerRef}>
            <button type="button" className="p-2 hover:bg-[#2B2D31] hover:text-[#DBDEE1] rounded-full transition-all" onClick={() => setShowEmojiPicker((prev) => !prev)}>
              <Smile className="w-6 h-6" />
            </button>

            {showEmojiPicker && (
              <div className="absolute bottom-full left-0 mb-4 z-50 drop-shadow-2xl">
                <Suspense fallback={<div className="p-4 bg-[#2B2D31] text-[#DBDEE1] rounded-lg text-sm border border-[#3A3C42] shadow-lg">Loading picker...</div>}>
                  <EmojiPicker onEmojiClick={onEmojiClick} theme="dark" />
                </Suspense>
              </div>
            )}

            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="p-2 hover:bg-[#2B2D31] hover:text-[#DBDEE1] rounded-full transition-all hidden sm:flex disabled:opacity-50"
            >
              {isUploading ? <Loader2 className="w-6 h-6 animate-spin text-[#8b5cf6]" /> : <PlusCircle className="w-6 h-6" />}
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileChange} 
            />
          </div>

          <div className="flex-1 bg-[#2B2D31] rounded-full border border-[#3A3C42] focus-within:border-[#8b5cf6]/60 shadow-inner group flex items-center transition-all px-2">
              <input 
                id="chat-input"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message @${selectedUser.username}`}
                className="flex-1 bg-transparent border-0 focus-visible:ring-0 text-[#DBDEE1] placeholder:text-[#828892] h-[44px] px-3 text-[15px] outline-none disabled:opacity-50"
              />
          </div>
          
          <button 
            type="submit" 
            disabled={!inputText.trim()}
            className="bg-[#8b5cf6] hover:bg-[#7c3aed] disabled:bg-[#3A3C42] text-white p-[11px] rounded-full transition-all shadow-lg active:scale-95 flex-shrink-0"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </form>
      </div>

      {selectedImageToCrop && (
        <ImageCropModal 
          imageSrc={selectedImageToCrop} 
          onComplete={handleCropComplete} 
          onCancel={handleCropCancel} 
        />
      )}

      {showProfilePic && createPortal(
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200" 
          onClick={() => setShowProfilePic(false)}
        >
          <div className="relative flex flex-col items-center max-w-[90vw] max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <img 
              src={selectedUser.profileImage || `https://api.dicebear.com/7.x/notionists/svg?seed=${selectedUser.username}`} 
              alt={`${selectedUser.username}'s profile`} 
              className="max-w-full max-h-[80vh] object-contain rounded-full shadow-2xl ring-4 ring-[#2B2D31]" 
            />
            <h3 className="text-white text-xl font-bold mt-6">{selectedUser.username}</h3>
            <button 
              className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-all" 
              onClick={() => setShowProfilePic(false)}
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
