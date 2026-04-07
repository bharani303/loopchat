import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

let stompClient = null;

export const connect = (token, onConnected, onError, onMessage) => {
  const baseURL = import.meta.env.VITE_API_URL || 'https://api.bharanidharan.dev';
  stompClient = new Client({
    webSocketFactory: () => new SockJS(`${baseURL}/chat?token=${token}`),
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    // connectHeaders: { Authorization: `Bearer ${token}` }, // Removed as token is in URL

    onConnect: () => {
      console.log('WebSocket connected ✅');
      if (onConnected) onConnected();

      stompClient.subscribe('/topic/messages', (msg) => {
        if (onMessage && msg.body) {
          onMessage(JSON.parse(msg.body));
        }
      });
    },
    

    onStompError: (frame) => {
      console.error('STOMP ERROR:', frame);
      if (onError) onError(frame);
    },

    onWebSocketClose: (error) => {
      console.warn('WebSocket closed.', error);
      if (onError) onError(error) ;
    }
  });
  
  stompClient.activate();
};

export const sendPrivateMessage = (sender, receiver, content, type = 'TEXT') => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: '/app/chat.send',
      body: JSON.stringify({ sender, receiver, content, type })
    });
  } else {
    console.error('Not connected — cannot send message.');
  }
};

// 🔔 Receiver calls this when a message arrives (→ single ✓ becomes ✓✓ grey)
export const sendDeliveredReceipt = (message) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: '/app/delivered',
      body: JSON.stringify(message) // send full message back, server sets DELIVERED
    });
  }
};

// 👁 Receiver calls this when they open the conversation (→ ✓✓ grey becomes ✓✓ blue)
export const sendReadReceipt = (message) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: '/app/read',
      body: JSON.stringify(message) // send full message back, server sets READ
    });
  }
};

export const disconnect = () => {
  if (stompClient !== null) {
    stompClient.deactivate();
  }
};
