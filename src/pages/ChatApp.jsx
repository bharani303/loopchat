import { useState, useRef, useEffect } from 'react';
import { Search, MoreVertical, Video, Phone, Paperclip, Smile, Send, CheckCheck, Mic, ArrowLeft } from 'lucide-react';

export default function ChatApp({ onLogout }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello there!', time: '10:40 AM', sender: 'stranger', read: true },
    { id: 2, text: 'Anyone up for a chat?', time: '10:41 AM', sender: 'stranger', read: true },
    { id: 3, text: 'Hey! Do you like sci-fi movies?', time: '10:42 AM', sender: 'you', read: true }
  ]);
  const messagesEndRef = useRef(null);

  const contacts = [
    { id: 1, name: 'Stranger #1', msg: 'Hey! Do you like sci-fi movies?', time: '10:42 AM', unread: 0, online: true, avatar: 'bg-gradient-to-tr from-purple-500 to-fuchsia-500' },
    { id: 2, name: 'Alice', msg: 'That sounds great, see you then.', time: 'Yesterday', unread: 2, online: false, avatar: 'bg-gradient-to-tr from-blue-500 to-indigo-500' },
    { id: 3, name: 'Stranger #4', msg: 'Typing...', time: 'Yesterday', unread: 0, online: true, avatar: 'bg-gradient-to-tr from-emerald-500 to-teal-500' },
    { id: 4, name: 'Stranger #9', msg: 'Haha absolutely!', time: 'Tuesday', unread: 0, online: false, avatar: 'bg-gradient-to-tr from-amber-500 to-orange-500' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;
    
    // Add user message
    const newMsg = {
      id: Date.now(),
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'you',
      read: false
    };
    
    setMessages(prev => [...prev, newMsg]);
    setMessage('');
    
    // Simulate stranger reply
    setTimeout(() => {
      const replyMsg = {
        id: Date.now() + 1,
        text: 'Wow, that is awesome! Need to watch it again.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'stranger',
        read: true
      };
      setMessages(prev => [...prev, replyMsg]);
    }, 1500);
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <div className="w-full sm:w-[380px] flex-shrink-0 border-r border-white/5 bg-zinc-900/50 flex-col hidden sm:flex">
        {/* Header */}
        <div className="h-16 border-b border-white/5 flex items-center justify-between px-4 bg-zinc-900 z-20 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-purple-500/20 cursor-pointer" onClick={onLogout}>
              <span className="font-bold text-sm text-white">You</span>
            </div>
            <span className="font-semibold text-zinc-200">Chats</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-400">
            <button className="hover:text-white transition-colors" title="Logout" onClick={onLogout}><ArrowLeft className="w-5 h-5" /></button>
            <MoreVertical className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
          </div>
        </div>
        
        {/* Search */}
        <div className="p-3 border-b border-white/5 bg-zinc-900/50">
          <div className="relative bg-zinc-950/80 rounded-xl flex items-center px-3 py-2 border border-white/5 focus-within:border-purple-500/50 transition-colors">
            <Search className="w-4 h-4 text-zinc-500 mr-2" />
            <input 
              type="text" 
              placeholder="Search or start new chat" 
              className="bg-transparent border-none outline-none text-sm text-zinc-200 w-full placeholder:text-zinc-600"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {contacts.map((contact, i) => (
            <div key={contact.id} className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${i === 0 ? 'bg-zinc-800/80' : 'hover:bg-zinc-800/40'}`}>
              <div className={`relative w-12 h-12 rounded-full ${contact.avatar} flex-shrink-0 flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                {contact.name[0]}
                {contact.online && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-[3px] border-zinc-900 rounded-full" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-medium text-zinc-200 truncate">{contact.name}</h3>
                  <span className={`text-xs ${contact.unread ? 'text-purple-400 font-medium' : 'text-zinc-500'}`}>{contact.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className={`text-sm truncate ${contact.unread ? 'text-zinc-300 font-medium' : 'text-zinc-500'}`}>{contact.msg}</p>
                  {contact.unread > 0 && (
                    <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 shadow-lg shadow-purple-500/20">
                      {contact.unread}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-zinc-950 relative w-full">
        {/* Subtle patterned background */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 to-transparent pointer-events-none" />
        
        {/* Chat Header */}
        <div className="h-16 border-b border-white/5 bg-zinc-900/95 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 z-10 shadow-sm flex-shrink-0">
          <div className="flex items-center gap-3">
            <button className="sm:hidden text-zinc-400 hover:text-white mr-1" onClick={onLogout}><ArrowLeft className="w-5 h-5" /></button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-lg shadow-md relative">
              S
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-zinc-900 rounded-full" />
            </div>
            <div>
              <h2 className="font-semibold text-zinc-100 leading-tight">Stranger #1</h2>
              <p className="text-xs text-emerald-400 font-medium">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-4 sm:gap-5 text-zinc-400">
            <Video className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
            <Phone className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
            <div className="w-px h-5 bg-white/10 mx-1 hidden sm:block" />
            <Search className="w-5 h-5 cursor-pointer hover:text-white transition-colors hidden sm:block" />
            <MoreVertical className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4 z-10 custom-scrollbar">
          <div className="flex justify-center mb-4 pt-4">
            <span className="bg-zinc-900/80 backdrop-blur-md border border-white/5 text-xs text-zinc-400 font-medium py-1.5 px-4 rounded-full shadow-sm">Today</span>
          </div>
          
          <div className="flex justify-center mb-6">
            <span className="bg-zinc-900/50 border border-yellow-500/10 text-xs text-yellow-500/70 py-1.5 px-4 rounded-lg flex items-center gap-2 max-w-sm text-center">
              <CheckCheck className="w-3 h-3" /> Messages to this chat and calls are now secured with end-to-end encryption.
            </span>
          </div>
          
          {/* Messages Loop */}
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col gap-1 max-w-[85%] sm:max-w-[65%] ${msg.sender === 'you' ? 'self-end' : 'self-start'}`}>
              <div 
                className={`rounded-2xl px-4 py-2.5 text-[15px] shadow-sm flex flex-col ${
                  msg.sender === 'you' 
                    ? 'bg-purple-600 text-white rounded-tr-sm shadow-purple-600/10' 
                    : 'bg-zinc-800 text-zinc-200 rounded-tl-sm border border-white/5'
                }`}
              >
                <span>{msg.text}</span>
                <div className={`flex items-center gap-1 mt-1 ${msg.sender === 'you' ? 'justify-end' : 'justify-start'}`}>
                  <span className={`text-[10px] font-medium ${msg.sender === 'you' ? 'text-purple-200' : 'text-zinc-500'}`}>{msg.time}</span>
                  {msg.sender === 'you' && <CheckCheck className={`w-4 h-4 ${msg.read ? 'text-purple-200' : 'text-purple-400/50'}`} />}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 sm:p-4 bg-zinc-900/95 backdrop-blur-md border-t border-white/5 z-10 flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="p-2 text-zinc-400 hover:text-white transition-colors hidden sm:block"><Smile className="w-6 h-6" /></button>
            <button className="p-2 text-zinc-400 hover:text-white transition-colors"><Paperclip className="w-5 h-5" /></button>
            <div className="flex-1 bg-zinc-950 border border-white/10 rounded-2xl px-4 py-3 flex items-center focus-within:border-purple-500/50 focus-within:ring-1 focus-within:ring-purple-500/50 transition-all shadow-inner">
              <input 
                type="text" 
                placeholder="Type a message" 
                className="bg-transparent border-none outline-none w-full text-zinc-200 text-[15px] placeholder:text-zinc-600"
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
              />
            </div>
            {message.trim() ? (
              <button 
                className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center hover:bg-purple-700 transition-colors shadow-lg shadow-purple-600/20 active:scale-95 transform flex-shrink-0"
                onClick={handleSend}
              >
                <Send className="w-5 h-5 ml-1" />
              </button>
            ) : (
              <button className="w-12 h-12 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex-shrink-0">
                <Mic className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
