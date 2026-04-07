import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { connect, sendPrivateMessage, sendDeliveredReceipt, sendReadReceipt, disconnect } from '../services/websocket';
import { getMessages, getOnlineUsers as fetchOnlineUsersApi, getConversations, getUserProfileApi } from '../services/api';
import { useAuth } from './AuthContext';

const ChatContext = createContext();
export const useChat = () => useContext(ChatContext);

const convKey = (a, b) => [a, b].sort().join('::');

export const ChatProvider = ({ children }) => {
  const { token, currentUser } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  // messagesMap: { "emailA::emailB": [msg, ...] }
  const [messagesMap, setMessagesMap] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  // Track users we have chatted with
  const [recentUsers, setRecentUsers] = useState(() => {
    const saved = localStorage.getItem('loopchat_recent_users');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('loopchat_recent_users', JSON.stringify(recentUsers));
  }, [recentUsers]);

  const currentUserRef  = useRef(currentUser);
  const selectedUserRef = useRef(selectedUser);
  useEffect(() => { currentUserRef.current  = currentUser;  }, [currentUser]);
  useEffect(() => { 
    selectedUserRef.current = selectedUser; 
    // Add to recents when selected
    if (selectedUser) {
      setRecentUsers(prev => {
        const userToStore = { ...selectedUser };
        const filtered = prev.filter(u => u.email !== userToStore.email);
        return [userToStore, ...filtered].slice(0, 50); // Keep last 50
      });
    }
  }, [selectedUser]);

  // ── Add a brand-new message (marks it as _live so ticks work) ──────────────
  const addMessage = useCallback((msg) => {
    if (!msg.sender || !msg.receiver) return;
    const key = convKey(msg.sender, msg.receiver);
    setMessagesMap(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), { ...msg, _live: true }]
    }));
  }, []);

  // ── Update status of an existing live message matched by timestamp ──────────
  // The server echoes back the full ChatMessage (same sender/receiver/content/timestamp)
  const updateMessageStatus = useCallback((statusMsg) => {
    const key = convKey(statusMsg.sender, statusMsg.receiver);
    setMessagesMap(prev => {
      const msgs = prev[key] || [];
      let updated = false;
      const newMsgs = msgs.map(m => {
        // Match by timestamp first (most precise), fallback to content
        if (
          !updated &&
          m._live &&
          m.sender   === statusMsg.sender   &&
          m.receiver === statusMsg.receiver &&
          (m.timestamp === statusMsg.timestamp || m.content === statusMsg.content)
        ) {
          // Only upgrade status, never downgrade (READ > DELIVERED > SENT)
          const rank = { SENT: 0, DELIVERED: 1, READ: 2 };
          if ((rank[statusMsg.status] ?? 0) > (rank[m.status] ?? 0)) {
            updated = true;
            return { ...m, status: statusMsg.status };
          }
        }
        return m;
      });
      return { ...prev, [key]: newMsgs };
    });
  }, []);

  // ── WebSocket connection ────────────────────────────────────────────────────
  useEffect(() => {
    if (token && currentUser?.email) {
      connect(
        token,
        () => {
          setIsConnected(true);
          console.log('WebSocket connected.');

          if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
          }

          fetchOnlineUsersApi()
            .then(res => setOnlineUsers(res.data || []))
            .catch(console.error);

          // 🔥 FETCH OFFLINE CONVERSATIONS (Sync Recent Users)
          getConversations(currentUser.email)
            .then(async res => {
              const emails = res.data || [];
              // Fetch real profiles for ALL emails to guarantee fresh avatars
              emails.forEach(e => {
                getUserProfileApi(e).then(profileRes => {
                  setRecentUsers(currentPrev => {
                    const freshData = profileRes.data;
                    const others = currentPrev.filter(u => u.email !== freshData.email);
                    return [freshData, ...others].slice(0, 50);
                  });
                }).catch(console.error);
              });
            })
            .catch(console.error);

          const interval = setInterval(() => {
            fetchOnlineUsersApi()
              .then(res => setOnlineUsers(res.data || []))
              .catch(console.error);
          }, 30000);

          return () => clearInterval(interval);
        },
        (err) => {
          setIsConnected(false);
          console.error('WebSocket connection lost.', err);
        },
        (newMsg) => {
          const me = currentUserRef.current?.email?.toLowerCase();
          const senderEmail = newMsg.sender?.toLowerCase();

          if (senderEmail === me) {
            // STATUS UPDATE for a message I sent (DELIVERED or READ coming back)
            // or an echoed message I just sent.
            updateMessageStatus(newMsg);
          } else {
            // NEW message from someone else
            addMessage(newMsg);

            // Notify only if it's from someone else AND (the chat isn't open OR the window is hidden)
            const openConv = selectedUserRef.current;
            if (openConv?.email !== newMsg.sender || document.hidden) {
              if ('Notification' in window && Notification.permission === 'granted') {
                 const senderName = newMsg.sender.split('@')[0];
                 const text = newMsg.type === 'IMAGE' ? '📷 Sent an image' : newMsg.content;
                 const shortText = text.length > 50 ? text.substring(0, 50) + '...' : text;
                 new Notification(`New message from ${senderName}`, {
                    body: shortText
                 });
              }
            }
            
            // 🔥 Add sender to Recent Users and ALWAYS sync real data
            setRecentUsers(prev => {
               // Fetch real profile from DB
               getUserProfileApi(newMsg.sender).then(profileRes => {
                 setRecentUsers(currentPrev => {
                   const freshData = profileRes.data;
                   // Replace existing entry with fresh data
                   const others = currentPrev.filter(u => u.email !== freshData.email);
                   return [freshData, ...others].slice(0, 50);
                 });
               }).catch(console.error);

               return prev;
            });

            // Auto DELIVERED receipt → sender sees ✓✓ grey
            sendDeliveredReceipt(newMsg);

            // Auto READ receipt only if receiver has this conversation open → ✓✓ blue
            if (openConv?.email === newMsg.sender) {
              sendReadReceipt(newMsg);
            }
          }
        }
      );

      return () => disconnect();
    }
  }, [token, currentUser?.email]);

  // ── Load DB history (flagged as NOT live — ticks stay as SENT) ─────────────
  useEffect(() => {
    if (selectedUser && currentUser?.email) {
      getMessages(currentUser.email, selectedUser.email)
        .then(res => {
          const key = convKey(currentUser.email, selectedUser.email);
          // DB messages: always show as SENT (backend never updates DB status)
          const dbMsgs = (res.data || []).map(m => ({
            ...m,
            status: 'SENT',   // Force SENT — db status is stale
            _live:  false      // Not live → ticks frozen at single grey ✓
          }));
          setMessagesMap(prev => ({ ...prev, [key]: dbMsgs }));
        })
        .catch(err => console.error('Error fetching history', err));
    }
  }, [selectedUser, currentUser]);

  // ── Send a message ─────────────────────────────────────────────────────────
  const sendMessage = useCallback((content, type = 'TEXT') => {
    if (selectedUser && content.trim() && currentUser?.email) {
      const receiverEmail = selectedUser.email;
      if (!receiverEmail) return;

      const ts = Date.now();
      sendPrivateMessage(currentUser.email, receiverEmail, content, type);

      // Optimistic: appears immediately as SENT with unique timestamp
      addMessage({
        sender:    currentUser.email,
        receiver:  receiverEmail,
        content,
        type,
        status:    'SENT',
        timestamp: ts,
        _live:     true
      });
    }
  }, [selectedUser, currentUser, addMessage]);

  // ── Derived messages for the open conversation ─────────────────────────────
  const messages = (selectedUser && currentUser?.email)
    ? (messagesMap[convKey(currentUser.email, selectedUser.email)] || [])
    : [];

  return (
    <ChatContext.Provider
      value={{ selectedUser, setSelectedUser, messages, sendMessage, onlineUsers, isConnected, recentUsers }}
    >
      {children}
    </ChatContext.Provider>
  );
};
