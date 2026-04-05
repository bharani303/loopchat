import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Video,
  Users,
  Search,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  MessageCircle,
  Menu,
  X
} from 'lucide-react';
import FloatingLines from '../components/FloatingLines/FloatingLines';

export default function Landing({ onNavigate }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-purple-500/30 overflow-x-hidden">
      {/* Background Glows */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-fuchsia-600/10 blur-[120px]" />
      </div>

      <div className="relative z-10">
        {/* Centered Pro Navbar */}
        <motion.nav
          initial={{ y: -100, x: '-50%', opacity: 0 }}
          animate={{ y: 0, x: '-50%', opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.1 }}
          className="fixed top-6 left-1/2 w-[calc(100%-3rem)] max-w-5xl h-16 bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-2xl z-50 px-6 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        >
          {/* Left: Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center">
              <img src="/assets/logo.png" alt="Loopchat" className="w-full h-full object-cover mix-blend-screen scale-[1.3] brightness-[1.1] contrast-[1.1]" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white hidden sm:block">Loopchat</span>
          </div>

          {/* Center: Desktop Nav (Perfectly Centered) */}
          <div className="hidden lg:flex items-center absolute left-1/2 -translate-x-1/2 bg-white/5 border border-white/5 px-2 py-1 rounded-xl gap-1">
            {['Home', 'Blog', 'About', 'Support'].map((item) => (
              <button
                key={item}
                onClick={() => item === 'Home' ? null : onNavigate("under-construction")}
                className="px-4 py-1.5 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Right: Buttons */}
          <div className="flex items-center gap-3">
            <button className="p-2 text-zinc-400 hover:text-white transition-colors hidden sm:block"><Search className="w-4 h-4" /></button>
            <button onClick={() => onNavigate("login")} className="relative px-6 py-2 rounded-xl text-sm font-semibold overflow-hidden group/btn">
              <div className="absolute inset-0 bg-white group-hover/btn:bg-zinc-200 transition-colors" />
              <span className="relative text-black">Login</span>
            </button>
            <button className="lg:hidden p-2 text-zinc-400" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:hidden absolute top-20 inset-x-4 bg-zinc-900/90 backdrop-blur-3xl border border-white/10 rounded-2xl p-6 flex flex-col gap-4 shadow-2xl"
            >
              {['Home', 'Blog', 'About', 'Support'].map((item) => (
                <button
                  key={item}
                  onClick={() => item === 'Home' ? setIsMenuOpen(false) : onNavigate("under-construction")}
                  className="py-2 text-zinc-400 hover:text-white transition-colors border-b border-white/5 text-left"
                >
                  {item}
                </button>
              ))}
              <button onClick={() => onNavigate("login")} className="w-full mt-2 px-5 py-3 rounded-xl bg-white text-black font-bold">Login</button>
            </motion.div>
          )}
        </motion.nav>

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* FloatingLines Background */}
          <div className="absolute inset-0 z-0 opacity-70">
            <FloatingLines
              linesGradient={['#7c3aed', '#4c1d95', '#a855f7', '#312e81']}
              enabledWaves={['top', 'middle', 'bottom']}
              lineCount={[12, 10, 14]}
              lineDistance={[4, 3, 5]}
              animationSpeed={1.0}
              interactive={true}
              bendRadius={5.0}
              bendStrength={-0.4}
              parallax={true}
              parallaxStrength={0.15}
              mixBlendMode="screen"
            />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-4xl mx-auto text-center px-6 py-40">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-sm text-purple-300 text-sm font-medium mb-8"
            >
              <Sparkles className="w-4 h-4" />
              <span>Talk to strangers, Make friends!</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight drop-shadow-2xl"
            >
              The Modern Way to <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">Connect Globally</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto mb-12 leading-relaxed drop-shadow-lg"
            >
              Experience a random chat alternative to find friends, connect with people, and chat with strangers from all over the world!
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button onClick={() => onNavigate("under-construction")} className="w-full sm:w-auto px-8 py-4 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-medium transition-all shadow-[0_0_40px_-10px_rgba(147,51,234,0.5)] hover:shadow-[0_0_60px_-15px_rgba(147,51,234,0.7)] hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Text Chat
              </button>
              <button onClick={() => onNavigate("under-construction")} className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-sm text-white font-medium transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                <Video className="w-5 h-5" />
                Video Chat
              </button>
            </motion.div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="py-24 px-6 border-t border-white/5 bg-black/20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Anonymous Chat, <br className="hidden sm:block" /> Meet new people</h2>
              <p className="text-zinc-400 text-lg">
                Find strangers worldwide, the new modern Omegle and OmeTV alternative. Connect with real people, enjoy ad free text and video chats, and build genuine friendships.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 lg:gap-24 mb-32 items-center">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6">
                  <HeartIcon className="w-7 h-7 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Chat with Random Strangers With Similar Interests</h3>
                <p className="text-zinc-400 leading-relaxed text-lg">
                  Talk to online strangers who love what you love. Chat about hobbies and enjoy fun conversations - all from one place! Making new friends based on interests is made easy.
                </p>
              </div>
              <div className="aspect-square md:aspect-[4/3] rounded-3xl border border-white/10 bg-zinc-900/50 p-2 shadow-2xl overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-full h-full rounded-2xl bg-zinc-950 border border-white/5 flex flex-col">
                  {/* Fake UI */}
                  <div className="h-14 border-b border-white/5 flex items-center px-6 gap-4">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1 p-6 flex flex-col gap-4">
                    <div className="self-end px-4 py-2 rounded-2xl bg-purple-600 text-sm max-w-[80%]">Hey! Do you like sci-fi movies?</div>
                    <div className="self-start px-4 py-2 rounded-2xl bg-zinc-800 text-sm max-w-[80%]">I love them! Just watched Interstellar again.</div>
                    <div className="self-end px-4 py-2 rounded-2xl bg-purple-600 text-sm max-w-[80%]">No way, that's my favorite!</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 lg:gap-24 mb-32 items-center md:flex-row-reverse">
              <div className="md:order-2">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
                  <Video className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Simple and Fun Video Chats</h3>
                <p className="text-zinc-400 leading-relaxed text-lg">
                  Enjoy video chats with strangers worldwide, our platform is designed to make it easy and safe to connect with people from all over the world. Meet new people, make friends, and have fun!
                </p>
              </div>
              <div className="md:order-1 aspect-square md:aspect-[4/3] rounded-3xl border border-white/10 bg-zinc-900/50 p-2 shadow-2xl relative overflow-hidden">
                <div className="w-full h-full rounded-2xl bg-zinc-950 border border-white/5 relative grid grid-rows-2 sm:grid-rows-1 sm:grid-cols-2 gap-2 p-2">
                  <div className="bg-zinc-900 rounded-xl flex items-center justify-center relative overflow-hidden">
                    <span className="text-zinc-600 font-medium">Stranger #1</span>
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center"><HeartIcon className="w-4 h-4 text-white" /></div>
                    </div>
                  </div>
                  <div className="bg-zinc-800 rounded-xl flex items-center justify-center relative overflow-hidden">
                    <span className="text-zinc-500 font-medium">You</span>
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      <div className="w-8 h-8 rounded-full justify-center bg-purple-600 flex items-center"><Video className="w-4 h-4 text-white" /></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-24 px-6 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-zinc-100 pb-2">From Strangers to Friends</h2>
              <p className="text-zinc-400 text-lg max-w-2xl mx-auto">The best site to Chat with Male and Female Strangers.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon={<Video className="w-6 h-6" />}
                title="Video Chat"
                desc="Experience authentic face to face encounters with real people from all over the world."
              />
              <FeatureCard
                icon={<Users className="w-6 h-6" />}
                title="Friends & History"
                desc="Had a fun chat but skipped by accident? Find them in your chat history and add them as a friend."
              />
              <FeatureCard
                icon={<Search className="w-6 h-6" />}
                title="Search Filters"
                desc="Want to narrow down your search? Use interests, genders or locations to filter the strangers you meet."
              />
              <FeatureCard
                icon={<MessageSquare className="w-6 h-6" />}
                title="Text Chat"
                desc="Not in the mood for video? No problem! You can also chat with strangers via text messages."
              />
              <FeatureCard
                icon={<ShieldCheck className="w-6 h-6" />}
                title="Safety & Moderation"
                desc="We make use of advanced AI technologies and enhanced spam protection to keep your chats clean."
              />
              <FeatureCard
                icon={<Sparkles className="w-6 h-6" />}
                title="Feature rich"
                desc="From sending photos, videos, having voice calls, to sharing GIFs and adding avatars, we have it all."
              />
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 px-6 border-t border-white/5 bg-gradient-to-b from-black/0 to-purple-900/10">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Don't take our word for it</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto mb-16">
              We've asked random strangers, both men and women, to try our Omegle alternative platform. Here's what they had to say:
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
              {[
                { name: "Stranger #1", role: "Beta Tester", review: "The filters makes finding people genuinely fun again. It's clean, fast, and exactly what I needed." },
                { name: "Stranger #2", role: "User", review: "I met my current best friend here discussing indie games! The interest matching is spot on." },
                { name: "Stranger #3", role: "User", review: "Best Omegle alternative I've tried. The video quality is solid and the UI is beautiful." },
                { name: "Stranger #4", role: "Premium User", review: "Love the history feature. Accidental skips used to ruin my day, not anymore!" }
              ].map((test, i) => (
                <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-purple-500/30 transition-colors">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => <StarIcon key={j} className="w-4 h-4 text-purple-400 fill-purple-400" />)}
                  </div>
                  <p className="text-zinc-300 text-sm mb-6 leading-relaxed">"{test.review}"</p>
                  <div>
                    <h4 className="font-semibold">{test.name}</h4>
                    <span className="text-xs text-zinc-500">{test.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Pro Footer */}
        <footer className="pt-24 pb-12 px-6 border-t border-white/5 bg-zinc-950">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
              {/* Brand Column */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex items-center justify-center">
                    <img src="/assets/logo.png" alt="Loopchat Logo" className="w-full h-full object-cover mix-blend-screen scale-[1.3] brightness-[1.1] contrast-[1.1]" />
                  </div>
                  <span className="text-xl font-bold tracking-tight text-white">Loopchat</span>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
                  The most modern and secure place to chat with strangers, find interests, and build genuine friendships globally.
                </p>
                <div className="flex items-center gap-3">
                  <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-purple-600/20 hover:border-purple-500/50 hover:-translate-y-1 transition-all">
                    <MessageCircle className="w-4 h-4 text-zinc-400 hover:text-white" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-purple-600/20 hover:border-purple-500/50 hover:-translate-y-1 transition-all">
                    <MessageSquare className="w-4 h-4 text-zinc-400 hover:text-white" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-purple-600/20 hover:border-purple-500/50 hover:-translate-y-1 transition-all">
                    <Users className="w-4 h-4 text-zinc-400 hover:text-white" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-purple-600/20 hover:border-purple-500/50 hover:-translate-y-1 transition-all">
                    <Search className="w-4 h-4 text-zinc-400 hover:text-white" />
                  </a>
                </div>
              </div>

              {/* Product Column */}
              <div>
                <h4 className="text-white font-semibold mb-6">Product</h4>
                <ul className="flex flex-col gap-4 text-sm text-zinc-400">
                  <li><a href="#" className="hover:text-purple-400 transition-colors">Text Chat</a></li>
                  <li><a href="#" className="hover:text-purple-400 transition-colors">Video Chat</a></li>
                  <li><a href="#" className="hover:text-purple-400 transition-colors">Interest Matcher</a></li>
                  <li><a href="#" className="hover:text-purple-400 transition-colors">Safety Features</a></li>
                </ul>
              </div>

              {/* Legal Column */}
              <div>
                <h4 className="text-white font-semibold mb-6">Legal</h4>
                <ul className="flex flex-col gap-4 text-sm text-zinc-400">
                  <li><a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-purple-400 transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-purple-400 transition-colors">Community Guidelines</a></li>
                  <li><a href="#" className="hover:text-purple-400 transition-colors">Refund Policy</a></li>
                </ul>
              </div>

              {/* Feature Column */}
              <div className="bg-gradient-to-br from-purple-600/10 to-transparent p-6 rounded-3xl border border-purple-500/20">
                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                  Stay in the loop <Sparkles className="w-4 h-4 text-purple-400" />
                </h4>
                <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                  Join our Discord server to get updates, early access, and participate in community events!
                </p>
                <button className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95">
                  Join Discord
                </button>
              </div>
            </div>

            <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-zinc-500">
              <p>© 2026 BeFriendsWith LTD. All rights reserved.</p>
              <div className="flex items-center gap-6">
                <span>Designed for the modern web</span>
                <span className="w-1 h-1 rounded-full bg-zinc-700" />
                <span>v2.4.0 Stable</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-8 rounded-3xl border border-white/5 bg-zinc-900/40 hover:bg-zinc-900/80 transition-all hover:-translate-y-1 hover:border-purple-500/30 group">
      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 text-zinc-400 group-hover:text-purple-400 group-hover:bg-purple-500/10 transition-colors">
        {icon}
      </div>
      <h4 className="text-xl font-semibold mb-3">{title}</h4>
      <p className="text-zinc-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function HeartIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function StarIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}


