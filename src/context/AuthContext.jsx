import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Helper: decode JWT payload to get the email (sub claim)
const getEmailFromToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub; // "sub" = user's email
  } catch (e) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      
      // Always extract email from JWT as the source of truth
      const emailFromToken = getEmailFromToken(token);
      
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          // Ensure email is always present (use JWT email as fallback)
          if (!parsed.email && emailFromToken) {
            parsed.email = emailFromToken;
            localStorage.setItem('user', JSON.stringify(parsed));
          }
          setCurrentUser(parsed);

          // 🔥 If username is missing, sync from backend
          if (!parsed.username && parsed.email) {
            import('../services/api').then(({ getUserProfileApi }) => {
              getUserProfileApi(parsed.email).then(res => {
                const freshUser = { ...parsed, ...res.data };
                setCurrentUser(freshUser);
                localStorage.setItem('user', JSON.stringify(freshUser));
              }).catch(console.error);
            });
          }
        } catch (e) {
          console.error("Failed parsing stored user", e);
          setCurrentUser({ email: emailFromToken });
        }
      } else {
        // No stored user — create one from JWT
        const initialUser = { email: emailFromToken };
        setCurrentUser(initialUser);
        
        // 🔥 Fetch fresh details instantly
        if (emailFromToken) {
          import('../services/api').then(({ getUserProfileApi }) => {
            getUserProfileApi(emailFromToken).then(res => {
              const freshUser = { ...initialUser, ...res.data };
              setCurrentUser(freshUser);
              localStorage.setItem('user', JSON.stringify(freshUser));
            }).catch(console.error);
          });
        }
      }
      setIsLoading(false);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setCurrentUser(null);
      setIsLoading(false);
    }
  }, [token]);

  const login = async (credentials) => {
    try {
      const response = await loginUser(credentials);
      const data = response.data;
      
      if (data && data.token) {
        // Extract email from JWT if login response doesn't include it
        const emailFromToken = getEmailFromToken(data.token);
        const userData = { ...data, email: data.email || emailFromToken };
        
        setToken(data.token);
        setCurrentUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, setToken, currentUser, setCurrentUser, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
