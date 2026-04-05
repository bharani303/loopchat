import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { FileText, Download, Play, File, Image as ImageIcon, Music, Film, MoreHorizontal, X } from 'lucide-react';

// ─── Tick Icons ──────────────────────────────────────────────────────────────

// Single grey tick = SENT
const SingleTick = () => (
  <svg width="15" height="11" viewBox="0 0 16 11" fill="none" className="inline-block ml-0.5">
    <path d="M1 5.5L5.5 10L15 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Double grey tick = DELIVERED
const DoubleTick = () => (
  <svg width="17" height="11" viewBox="0 0 18 11" fill="none" className="inline-block ml-0.5">
    <path d="M1 5.5L5.5 10L15 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 5.5L9.5 10L19 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Double blue tick = READ
const BlueDoubleTick = () => (
  <svg width="17" height="11" viewBox="0 0 18 11" fill="none" className="inline-block ml-0.5">
    <path d="M1 5.5L5.5 10L15 1" stroke="#53BDEB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 5.5L9.5 10L19 1" stroke="#53BDEB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const StatusTick = ({ status }) => {
  if (status === 'READ')      return <BlueDoubleTick />;
  if (status === 'DELIVERED') return <DoubleTick />;
  return <SingleTick />;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getFileIcon = (url) => {
  const ext = url.split('.').pop().toLowerCase();
  if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(ext)) return <ImageIcon className="w-6 h-6 text-blue-400" />;
  if (['mp4', 'mov', 'avi', 'webm'].includes(ext)) return <Film className="w-6 h-6 text-purple-400" />;
  if (['mp3', 'wav', 'ogg'].includes(ext)) return <Music className="w-6 h-6 text-pink-400" />;
  if (['pdf'].includes(ext)) return <FileText className="w-6 h-6 text-red-500" />;
  if (['doc', 'docx', 'txt'].includes(ext)) return <FileText className="w-6 h-6 text-blue-500" />;
  return <File className="w-6 h-6 text-gray-400" />;
};

const getFileName = (url) => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const filename = pathname.split('/').pop();
    // Cloudinary etc. might have long IDs, tries to clean it up or just show "Document"
    return filename.length > 25 ? filename.substring(0, 22) + '...' : filename || 'Document';
  } catch (e) {
    return 'Document';
  }
};

// ─── MessageBubble ────────────────────────────────────────────────────────────

export default function MessageBubble({ message, isOwn, previousMessage, senderName, senderAvatar }) {
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  
  // Esc key to close media viewer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsMediaOpen(false);
    };
    if (isMediaOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMediaOpen]);

  // DB history messages are never live — always show single grey tick
  const effectiveStatus = message._live ? message.status : 'SENT';
  const timeInfo = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    : '';

  const showAvatar = !isOwn && (!previousMessage || previousMessage.sender !== message.sender);
  const showName   = !isOwn && showAvatar;

  // Group consecutive messages: reduce top gap
  const isGrouped = previousMessage && previousMessage.sender === message.sender;

  const isMedia = message.type === 'IMAGE' || message.type === 'VIDEO';

  return (
    <div className={`flex items-end gap-2 px-4 ${isGrouped ? 'mt-[2px]' : 'mt-4'} ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>

      {/* Avatar (only for received, first in group) */}
      {!isOwn && (
        <div className="w-8 flex-shrink-0 self-end">
          {showAvatar ? (
            <Avatar className="w-8 h-8 ring-2 ring-zinc-800/50 shadow-md">
              <AvatarImage src={senderAvatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${senderName}`} />
              <AvatarFallback className="text-xs">{senderName?.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          ) : null}
        </div>
      )}

      {/* Bubble */}
      <div className={`flex flex-col group/bubble ${isOwn ? 'items-end' : 'items-start'} max-w-[75%] sm:max-w-[65%]`}>

        {/* Sender name (received messages, first in group) */}
        {showName && (
          <span className="text-[11px] font-bold text-[#8b5cf6] px-1 mb-[3px] ml-1 max-w-full truncate">
            {senderName}
          </span>
        )}

        <div
          className={`relative shadow-lg transition-all duration-200 
            ${isMedia ? 'p-[3px] rounded-lg' : 'px-3 py-[6px] rounded-2xl'}
            ${isOwn
              ? 'bg-[#7c3aed] text-white rounded-br-[4px]'
              : 'bg-[#2B2D31] text-[#DBDEE1] rounded-bl-[4px] border border-[#3A3C42]'
            }`}
        >
          {/* TEXT MESSAGE */}
          {(!message.type || message.type === 'TEXT') && (
            <div className="flex flex-wrap items-end gap-2">
              <span className="whitespace-pre-wrap text-[14.5px] leading-[1.4] break-words">{message.content}</span>
              <div className={`flex items-center gap-[2px] ml-auto pb-[1px] text-[10px] select-none
                ${isOwn ? 'text-purple-200/60' : 'text-[#72767D]'}`}
              >
                {timeInfo}
                {isOwn && <StatusTick status={effectiveStatus} />}
              </div>
            </div>
          )}

          {/* IMAGE MESSAGE */}
          {message.type === 'IMAGE' && (
            <>
              <div 
                className="relative group/media overflow-hidden rounded-[6px] cursor-pointer"
                onClick={() => setIsMediaOpen(true)}
              >
                <img 
                  src={message.content} 
                  alt="Image" 
                  className="max-w-[280px] sm:max-w-[400px] max-h-[500px] object-cover rounded-[5px] block shadow-inner group-hover/media:opacity-90 transition-opacity"
                />
                <div className="absolute bottom-1 right-2 flex items-center gap-[2px] px-1.5 py-0.5 rounded-full bg-black/30 backdrop-blur-sm text-[10px] text-white/90 select-none">
                  {timeInfo}
                  {isOwn && <StatusTick status={effectiveStatus} />}
                </div>
              </div>
              {isMediaOpen && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200" onClick={() => setIsMediaOpen(false)}>
                  <div className="relative max-w-[90vw] max-h-[90vh]" onClick={e => e.stopPropagation()}>
                    <img src={message.content} alt="Image Preview" className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" />
                    <button className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-all" onClick={() => setIsMediaOpen(false)}>
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>,
                document.body
              )}
            </>
          )}

          {/* VIDEO MESSAGE */}
          {message.type === 'VIDEO' && (
            <>
              <div 
                className="relative group/media overflow-hidden rounded-[6px] bg-black/20 cursor-pointer"
                onClick={() => setIsMediaOpen(true)}
              >
                <video 
                  src={message.content} 
                  className="max-w-[280px] sm:max-w-[400px] max-h-[500px] rounded-[5px] block group-hover/media:opacity-90 transition-opacity" 
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover/media:scale-110 transition-transform">
                  <div className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-lg">
                    <Play className="w-6 h-6 fill-white text-white ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-1 right-2 flex items-center gap-[2px] px-1.5 py-0.5 rounded-full bg-black/30 backdrop-blur-sm text-[10px] text-white/90 select-none">
                  {timeInfo}
                  {isOwn && <StatusTick status={effectiveStatus} />}
                </div>
              </div>
              {isMediaOpen && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200" onClick={() => setIsMediaOpen(false)}>
                  <div className="relative max-w-[90vw] max-h-[90vh] bg-black rounded-lg shadow-2xl" onClick={e => e.stopPropagation()}>
                    <video src={message.content} controls autoPlay className="max-w-full max-h-[90vh] rounded-lg" />
                    <button className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-all" onClick={() => setIsMediaOpen(false)}>
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>,
                document.body
              )}
            </>
          )}

          {/* FILE MESSAGE (WhatsApp Style) */}
          {message.type === 'FILE' && (
            <div className="flex flex-col gap-1 min-w-[240px]">
              <a 
                href={message.content} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`flex items-center gap-3 p-2.5 rounded-xl transition-all border
                  ${isOwn 
                    ? 'bg-[#6d28d9]/50 border-white/10 hover:bg-[#6d28d9]/70' 
                    : 'bg-[#1E1F22] border-[#3A3C42] hover:bg-[#313338]'
                  }`}
              >
                <div className="w-11 h-11 shrink-0 bg-zinc-900/50 rounded-lg flex items-center justify-center border border-white/5 shadow-inner">
                  {getFileIcon(message.content)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-bold truncate pr-2">{getFileName(message.content)}</div>
                  <div className="text-[11px] opacity-60 flex items-center gap-1.5 mt-0.5 uppercase tracking-wider font-semibold">
                    <span>Document</span>
                    <span className="w-1 h-1 rounded-full bg-current opacity-30" />
                    <span>Download</span>
                  </div>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-transform group-hover/bubble:translate-y-[-2px]
                  ${isOwn ? 'border-white/20 bg-white/10' : 'border-[#3A3C42] bg-[#2B2D31]'}`}
                >
                  <Download className="w-4 h-4" />
                </div>
              </a>
              <div className={`flex items-center gap-[2px] ml-auto px-1 text-[10px] select-none
                ${isOwn ? 'text-purple-200/60' : 'text-[#72767D]'}`}
              >
                {timeInfo}
                {isOwn && <StatusTick status={effectiveStatus} />}
              </div>
            </div>
          )}

          {/* Bubble tail */}
          {!isMedia && (
            isOwn ? (
              <span className="absolute bottom-1 right-[-5px] w-3 h-3 overflow-hidden pointer-events-none translate-y-[2px]">
                <svg viewBox="0 0 12 12" className="absolute bottom-0 right-0">
                  <path d="M12 12 Q12 0 0 12 Z" fill="#7c3aed"/>
                </svg>
              </span>
            ) : (
              !isGrouped && (
                <span className="absolute bottom-1 left-[-5px] w-3 h-3 overflow-hidden pointer-events-none translate-y-[2px]">
                  <svg viewBox="0 0 12 12" className="absolute bottom-0 left-0">
                    <path d="M0 12 Q0 0 12 12 Z" fill="#2B2D31"/>
                  </svg>
                </span>
              )
            )
          )}
        </div>
      </div>
    </div>
  );
}
