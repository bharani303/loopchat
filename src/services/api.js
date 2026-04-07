import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.bharanidharan.dev',
});

// Request interceptor to inject JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─────────────────────────────────────────────
// AUTH MICROSERVICE ENDPOINTS (/api/auth)
// ─────────────────────────────────────────────

export const registerUser = (data) =>
  api.post('/api/auth/register', data);
// data: { username, email, phoneNumber, dateOfBirth, gender, password }

export const loginUser = (data) =>
  api.post('/api/auth/login', data);
// data: { email, password }
// response: { token, username, email }

export const sendOtp = (email) =>
  api.post(`/api/auth/send-otp?email=${encodeURIComponent(email)}`);

export const verifyOtp = (email, otp) =>
  api.post(`/api/auth/verify-otp?email=${encodeURIComponent(email)}&otp=${otp}`);

export const completeProfile = (data) =>
  api.put('/api/auth/complete-profile', data);
// data: { email, profileImage, bio }

export const updateProfile = (data) =>
  api.put('/api/auth/update-profile', data);

export const searchUsers = (username) =>
  api.get(`/api/auth/search?username=${encodeURIComponent(username)}`);
// response: [{ id, username, profileImage, bio }]

export const getUserProfileApi = (identifier) =>
  api.get(`/api/auth/profile?identifier=${encodeURIComponent(identifier)}`);

export const forgotPassword = (data) =>
  api.post('/api/auth/forgot-password', data);
// data: { email, token, newPassword }

// ─────────────────────────────────────────────
// CHAT MICROSERVICE ENDPOINTS (/api/messages)
// ─────────────────────────────────────────────

export const getMessages = (user1, user2) =>
  api.get(`/api/messages/messages?user1=${encodeURIComponent(user1)}&user2=${encodeURIComponent(user2)}`);
// response: [{ sender, receiver, content, status, timestamp }]

export const getOnlineUsers = () =>
  api.get('/api/messages/online-users');
// response: ["a@gmail.com", "b@gmail.com"]

export const getConversations = (email) =>
  api.get(`/api/messages/conversations?user=${encodeURIComponent(email)}`);

console.log("NEW BUILD FORCE 123");
// ─────────────────────────────────────────────
// AI MICROSERVICE ENDPOINTS (/api/ai)
// ─────────────────────────────────────────────

export const getSmartReply = (text) =>
  api.post('/api/ai/reply', JSON.stringify(text), { headers: { 'Content-Type': 'application/json' } });
// response: "Hey! How's it going?"

export const getSentiment = (text) =>
  api.post('/api/ai/sentiment', JSON.stringify(text), { headers: { 'Content-Type': 'application/json' } });
// response: "Positive 😊"

export const getSummary = (text) =>
  api.post('/api/ai/summarize', JSON.stringify(text), { headers: { 'Content-Type': 'application/json' } });
// response: "The conversation discusses..."

export const getRephrase = (text) =>
  api.post('/api/ai/rephrase', JSON.stringify(text), { headers: { 'Content-Type': 'application/json' } });
// response: "That isn't ideal, honestly."

export default api;
