import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, ArrowRight, User, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import api, { getUserProfileApi } from '../services/api';
import { uploadImage } from '../services/upload';

export default function ProfileSetup() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useAuth();
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [avatarPreview, setAvatarPreview] = useState(currentUser?.profileImage || `https://api.dicebear.com/7.x/notionists/svg?seed=${currentUser?.username || 'user'}`);
  const [username, setUsername] = useState(currentUser?.username || currentUser?.email?.split('@')[0] || 'User');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit for cloud uploads
        alert("Image is too large! Please choose an image under 5MB.");
        return;
      }
      setSelectedFile(file); // Store raw file for upload

      // Generate local preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (currentUser?.email) {
      getUserProfileApi(currentUser.email).then(res => {
        if (res.data) {
          setBio(res.data.bio || '');
          setUsername(res.data.username || currentUser?.username || currentUser?.email?.split('@')[0] || 'User');
          setAvatarPreview(res.data.profileImage || avatarPreview);
        }
      }).catch(err => {
        console.error("Failed to load profile (Backend might need a restart):", err);
        setUsername(currentUser?.username || currentUser?.email?.split('@')[0] || 'User');
      });
    }
  }, [currentUser]);

  const handleComplete = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let finalImageUrl = avatarPreview;

      // 🔥 Upload to Cloudinary if new file selected
      if (selectedFile) {
        finalImageUrl = await uploadImage(selectedFile);
      }

      // 🔥 Choose endpoint based on whether this is an initial setup or an update
      const endpoint = currentUser?.bio ? '/api/auth/update-profile' : '/api/auth/complete-profile';
      
      if (username.length > 32) {
        alert("Display name is too long! Max 32 characters.");
        setIsLoading(false);
        return;
      }

      const response = await api.put(endpoint, {
        email: currentUser.email,
        username: username.trim(),
        profileImage: finalImageUrl,
        bio: bio.trim().substring(0, 160) // Restrict bio too
      });
      
      const updatedUser = { ...currentUser, username, bio, profileImage: finalImageUrl };
      setCurrentUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      alert("Profile saved ✅");
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      // Even if update fails, we might still want to attempt navigating, but better to alert
      alert("Failed to save profile. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#313338] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-[#5865F2] selection:text-white">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
      {/* Discord-style Backdrop */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#5865F2]/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-[480px] relative z-10"
      >
        <div className="bg-[#2B2D31] rounded-lg shadow-[0_8px_16px_rgba(0,0,0,0.24)] overflow-hidden border border-[#1E1F22]">
          <div className="h-[120px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
             <button onClick={() => navigate('/dashboard')} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors">
               <X className="w-5 h-5" />
             </button>
          </div>
          
          <div className="px-8 pb-8 pt-0 relative -mt-12">
            <div className="flex flex-col items-start gap-4 mb-6">
              <div className="relative group cursor-pointer inline-block" onClick={handleImageClick}>
                <div className="w-[100px] h-[100px] rounded-full overflow-hidden border-[6px] border-[#2B2D31] bg-[#1E1F22] relative shadow-lg">
                  <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#23A559] border-[4px] border-[#2B2D31] rounded-full shadow-md" />
              </div>
              
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-white tracking-tight leading-tight">User Settings</h1>
                <p className="text-[#B5BAC1] text-[15px]">Personalize how you appear on LoopChat</p>
              </div>
            </div>

            <form onSubmit={handleComplete} className="flex flex-col gap-6">
              <div className="flex gap-4">
                <div className="space-y-2 flex-1">
                  <label className="text-xs font-bold text-[#DBDEE1] uppercase tracking-wider block px-1">Display Name</label>
                  <div className="relative group/input">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Your awesome username"
                      className="w-full bg-[#1E1F22] rounded-[4px] px-4 py-3 text-[#DBDEE1] border-none outline-none font-medium text-[15px] focus:ring-1 focus:ring-[#5865F2] transition-all placeholder:text-[#4E5058]"
                    />
                  </div>
                  <p className="text-[11px] text-[#72767D] px-1 italic">Choose a unique display name for the community.</p>
                </div>

                <div className="space-y-2 flex-1">
                  <label className="text-xs font-bold text-[#DBDEE1] uppercase tracking-wider block px-1">Email <span className="text-red-400 font-normal lowercase">(Private)</span></label>
                  <div className="bg-[#1E1F22] rounded-[4px] px-4 py-3 text-[#949BA4] border-none outline-none font-medium text-[15px] cursor-not-allowed opacity-70 truncate">
                    {currentUser?.email || 'email@example.com'}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#DBDEE1] uppercase tracking-wider block px-1">About Me</label>
                <div className="relative">
                  <textarea 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Discord style bio..." 
                    rows={4}
                    className="w-full px-4 py-3 bg-[#1E1F22] border-none text-[#DBDEE1] focus:outline-none focus:ring-1 focus:ring-[#5865F2] rounded-[8px] resize-none transition-all placeholder:text-[#949BA4] text-[15px] leading-relaxed"
                  />
                </div>
                <p className="text-[12px] text-[#949BA4] px-1">You can use markdown and links in your bio.</p>
              </div>

              <div className="w-full h-px bg-[#3F4147] my-2" />

              <div className="flex items-center gap-3 justify-end">
                <button type="button" onClick={() => navigate('/dashboard')} className="text-white text-sm font-medium hover:underline px-4 py-2">
                  Cancel
                </button>
                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium h-[40px] px-8 rounded-[3px] flex items-center justify-center gap-2 transition-colors duration-200 shadow-lg shadow-[#5865F2]/10"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
