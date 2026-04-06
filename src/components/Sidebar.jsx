import React, { useState, useEffect } from 'react';
import { Search, Mic, Headphones, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { searchUsers } from '../services/api';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ className }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const { selectedUser, setSelectedUser, onlineUsers, recentUsers } = useChat();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // If there's a search term OR the input is focused, we show "discovery/search" mode
        if (searchQuery.trim() || isFocused) {
          const response = await searchUsers(searchQuery);
          let filtered = (response.data || []).filter(u => u.email !== currentUser?.email);
          
          // If query is empty but focused, show 10 random members
          if (!searchQuery.trim() && isFocused) {
            filtered = filtered.sort(() => 0.5 - Math.random()).slice(0, 10);
          }
          
          setUsers(filtered);
        } else {
          setUsers([]);
        }
      } catch (err) {
        console.error("Failed to search users", err);
      }
    };
    
    const delay = setTimeout(() => {
      fetchUsers();
    }, 200);
    return () => clearTimeout(delay);
  }, [searchQuery, isFocused, currentUser]);

  return (
    <div className={`w-[260px] flex-shrink-0 bg-[#2B2D31] flex flex-col border-r border-[#1F2023]/60 ${className}`}>
      {/* Search Header */}
      <div className="h-12 border-b border-[#1F2023]/60 flex items-center px-3 shadow-sm bg-[#2B2D31]">
        <button className="w-full h-7 bg-[#1E1F22] rounded text-[13px] text-[#949BA4] text-left px-2 flex items-center justify-between shadow-sm cursor-text hover:bg-[#111214] transition-colors relative">
           <input 
             type="text" 
             placeholder="Find or start a conversation" 
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             onFocus={() => setIsFocused(true)}
             onBlur={() => setTimeout(() => setIsFocused(false), 200)}
             className="bg-transparent border-none outline-none w-full h-full text-[#DBDEE1] placeholder:text-[#949BA4]"
           />
        </button>
      </div>
      
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-2 space-y-[2px]">
          {/* Recent / Search Results */}
          <div className="flex items-center justify-between pt-3 pb-1 px-3">
             <h2 className="text-xs font-bold text-[#949BA4] uppercase hover:text-[#DBDEE1] transition-colors cursor-default">
               {searchQuery ? 'Search Results' : (isFocused ? 'Discover People' : `Recent Chats — ${Math.max(0, onlineUsers.length - (onlineUsers.includes(currentUser?.email) ? 1 : 0))} Online`)}
             </h2>
             {!searchQuery && !isFocused && <span className="text-[#949BA4] hover:text-[#DBDEE1] cursor-pointer text-lg font-light leading-none">+</span>}
          </div>

          {(searchQuery || isFocused ? users : recentUsers).map(user => {
             const userId = user.email || user.username;
             const isSelected = selectedUser?.email === user.email;
             const isOnline = onlineUsers.includes(userId);
             return (
              <button 
                key={user.email || user.username}
                onClick={() => setSelectedUser(user)}
                className={`w-full flex items-center gap-3 px-2 py-[5px] rounded-[4px] transition-colors group ${
                  isSelected ? 'bg-[#404249] text-white' : 'hover:bg-[#35373C] text-[#949BA4] hover:text-[#DBDEE1]'
                }`}
              >
                <div className="relative">
                  <Avatar className="w-8 h-8 rounded-full border-none shadow-none ring-1 ring-[#1E1F22]">
                    <AvatarImage src={user.profileImage || `https://api.dicebear.com/7.x/notionists/svg?seed=${user.username}`} />
                    <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  {isOnline && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-[11px] h-[11px] rounded-full bg-[#23A559] border-[2px] border-[#2B2D31] group-hover:border-[#35373C]" />
                  )}
                </div>
                <div className="flex-1 text-left overflow-hidden">
                  <div className={`font-semibold truncate leading-tight text-[15px] ${isSelected ? 'text-white' : 'text-[#DBDEE1]'}`}>{user.username}</div>
                  {!isSelected && (
                    <div className="text-[12px] text-[#949BA4] truncate">Click to message</div>
                  )}
                </div>
              </button>
             );
          })}

          {searchQuery && users.length === 0 && (
            <div className="text-center text-[#949BA4] text-xs mt-4">
              No users found for "{searchQuery}"
            </div>
          )}

          {!searchQuery && recentUsers.length === 0 && (
            <div className="px-3 py-4 text-center">
              <div className="bg-[#1E1F22] rounded-lg p-4">
                <p className="text-[13px] text-[#949BA4]">Search for a friend to start your first conversation! 🚀</p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* User Footer (Discord style) */}
      <div className="h-[52px] bg-[#232428] px-2 flex items-center gap-2 shrink-0 overflow-hidden">
        <div className="flex items-center gap-2 p-1 hover:bg-[#35373C] rounded-[4px] cursor-pointer transition-colors flex-1 min-w-0" onClick={() => navigate('/profile-setup')}>
          <div className="relative shrink-0">
            <Avatar className="w-8 h-8 rounded-full border-none shadow-sm ring-2 ring-[#111214]">
              <AvatarImage 
                src={currentUser?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.username || currentUser?.email || 'default'}`} 
                alt={currentUser?.username}
              />
              <AvatarFallback className="bg-[#5865F2] text-white text-[10px] font-bold">
                {(currentUser?.username || currentUser?.email || 'U').substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#23A559] border-[3px] border-[#232428]" />
          </div>
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="text-[14px] font-bold text-[#F2F3F5] truncate leading-tight">
              {currentUser?.username || 'LoopChat Member'}
            </div>
            <div className="text-[12px] text-[#949BA4] truncate leading-tight">
              #{ (currentUser?.username || 'user').substring(0, 4).toLowerCase() }
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <button 
            className="w-8 h-8 flex items-center justify-center text-[#B5BAC1] hover:text-[#DBDEE1] hover:bg-[#35373C] rounded-[4px] transition-colors"
            onClick={() => navigate('/under-construction')}
          >
            <Mic className="w-[20px] h-[20px]" />
          </button>
          <button 
            className="w-8 h-8 flex items-center justify-center text-[#B5BAC1] hover:text-[#DBDEE1] hover:bg-[#35373C] rounded-[4px] transition-colors"
            onClick={() => navigate('/under-construction')}
          >
            <Headphones className="w-[20px] h-[20px]" />
          </button>
          <button 
            className="w-8 h-8 flex items-center justify-center text-[#B5BAC1] hover:text-[#DBDEE1] hover:bg-[#35373C] rounded-[4px] transition-colors"
            onClick={() => navigate('/under-construction')}
          >
            <Settings className="w-[20px] h-[20px]" />
          </button>
        </div>
      </div>

      {/* Developer Attribution Sidebar Footer */}
      <div className="bg-[#1E1F22] py-1 text-center border-t border-[#1F2023]/60 opacity-30 hover:opacity-100 transition-opacity">
        <p className="text-[7px] font-black text-[#949BA4] uppercase tracking-[0.4em]">
           Dev by <span className="text-[#DBDEE1]">bharanidharan.dev</span>
        </p>
      </div>
    </div>
  );
}
