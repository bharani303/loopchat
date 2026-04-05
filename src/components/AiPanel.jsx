import React, { useState, useCallback } from 'react';
import { X, Sparkles, MessageCircle, BarChart3, FileText, RefreshCw, Send, Copy, Check, ChevronDown, Loader2, Wand2, Zap, Brain } from 'lucide-react';
import { getSmartReply, getSentiment, getSummary, getRephrase } from '../services/api';
import { useChat } from '../context/ChatContext';

// ─── Animated AI Sparkle Icon ──────────────────────────────────────────────────

const AiSparkle = ({ className = '' }) => (
  <div className={`relative ${className}`}>
    <Sparkles className="w-5 h-5" />
    <div className="absolute inset-0 animate-ping opacity-20">
      <Sparkles className="w-5 h-5" />
    </div>
  </div>
);

// ─── Feature Card ──────────────────────────────────────────────────────────────

const FeatureCard = ({ icon: Icon, title, description, gradient, onClick, isActive }) => (
  <button
    onClick={onClick}
    className={`w-full text-left p-3 rounded-xl border transition-all duration-300 group relative overflow-hidden
      ${isActive 
        ? 'border-purple-500/50 bg-purple-500/10 shadow-lg shadow-purple-500/10' 
        : 'border-[#3A3C42] bg-[#2B2D31]/50 hover:border-purple-500/30 hover:bg-[#2B2D31]'
      }`}
  >
    {/* Gradient glow on hover */}
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r ${gradient} blur-xl`} />
    
    <div className="relative flex items-start gap-3">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-gradient-to-br ${gradient} shadow-lg`}>
        <Icon className="w-4.5 h-4.5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-[13px] font-bold text-[#F2F3F5] leading-tight">{title}</h4>
        <p className="text-[11px] text-[#949BA4] mt-0.5 leading-snug">{description}</p>
      </div>
    </div>
  </button>
);

// ─── Shimmer Loading ───────────────────────────────────────────────────────────

const ShimmerLoading = () => (
  <div className="space-y-2 p-3 animate-pulse">
    <div className="h-3 bg-[#3A3C42] rounded-full w-4/5" />
    <div className="h-3 bg-[#3A3C42] rounded-full w-3/5" />
    <div className="h-3 bg-[#3A3C42] rounded-full w-2/3" />
  </div>
);

// ─── AI Result Card ────────────────────────────────────────────────────────────

const ResultCard = ({ result, onUse, onCopy, type }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Sentiment badge colors
  const getSentimentStyle = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('positive') || lower.includes('happy') || lower.includes('joy'))
      return 'from-emerald-500 to-teal-500 text-emerald-100';
    if (lower.includes('negative') || lower.includes('angry') || lower.includes('sad'))
      return 'from-red-500 to-rose-500 text-red-100';
    if (lower.includes('neutral'))
      return 'from-blue-500 to-indigo-500 text-blue-100';
    return 'from-purple-500 to-violet-500 text-purple-100';
  };

  return (
    <div className="mt-3 rounded-xl border border-[#3A3C42] bg-[#1E1F22] overflow-hidden animate-in slide-in-from-bottom-2 duration-300">
      {/* Result header */}
      <div className="px-3 py-2 bg-gradient-to-r from-purple-500/10 to-transparent border-b border-[#3A3C42]/50 flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
        <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wider">AI Response</span>
      </div>
      
      {/* Render based on type */}
      {type === 'sentiment' ? (
        <div className="p-4 flex items-center justify-center">
          <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r ${getSentimentStyle(result)} font-bold text-sm shadow-lg`}>
            <BarChart3 className="w-4 h-4" />
            {result}
          </div>
        </div>
      ) : (
        <div className="p-3">
          <p className="text-[13.5px] text-[#DBDEE1] leading-relaxed whitespace-pre-wrap">{result}</p>
        </div>
      )}

      {/* Actions */}
      <div className="px-3 py-2 border-t border-[#3A3C42]/50 flex items-center gap-2">
        {(type === 'reply' || type === 'rephrase') && (
          <button
            onClick={() => onUse(result)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[12px] font-bold transition-all active:scale-95 shadow-lg shadow-purple-600/20"
          >
            <Send className="w-3 h-3" />
            Use this
          </button>
        )}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2B2D31] hover:bg-[#35373C] text-[#B5BAC1] hover:text-white text-[12px] font-bold transition-all border border-[#3A3C42]"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
};

// ─── Main AI Panel ─────────────────────────────────────────────────────────────

export default function AiPanel({ isOpen, onClose, onUseMessage, inputText }) {
  const { messages, selectedUser } = useChat();
  const [activeFeature, setActiveFeature] = useState(null);
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [customInput, setCustomInput] = useState('');

  const features = [
    {
      id: 'reply',
      icon: MessageCircle,
      title: 'Smart Reply',
      description: 'AI suggests a reply to the last message',
      gradient: 'from-purple-600 to-violet-600',
    },
    {
      id: 'sentiment',
      icon: BarChart3,
      title: 'Sentiment Analysis',
      description: 'Detect the mood of a message',
      gradient: 'from-blue-600 to-cyan-600',
    },
    {
      id: 'summarize',
      icon: FileText,
      title: 'Summarize Chat',
      description: 'Get a quick summary of recent conversation',
      gradient: 'from-emerald-600 to-teal-600',
    },
    {
      id: 'rephrase',
      icon: RefreshCw,
      title: 'Rephrase Message',
      description: 'Make your draft sound more professional',
      gradient: 'from-amber-600 to-orange-600',
    },
  ];

  const getLastReceivedMessage = useCallback(() => {
    // Find the last non-own TEXT message (messages from context have sender/receiver, not isOwn)
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      // msg.sender being truthy and msg not being a media type
      const isTextMsg = !msg.type || msg.type === 'TEXT';
      if (isTextMsg && msg.content) {
        return msg.content;
      }
    }
    return null;
  }, [messages]);

  const getChatLog = useCallback(() => {
    // Build recent chat log (last 20 text messages) for summarization
    return messages
      .filter(m => !m.type || m.type === 'TEXT')
      .slice(-20)
      .map(m => `${m.sender}: ${m.content}`)
      .join('\n');
  }, [messages]);

  const handleFeatureClick = async (featureId) => {
    setActiveFeature(featureId);
    setResult('');
    setError('');
    setCustomInput('');

    let textToSend = '';

    switch (featureId) {
      case 'reply': {
        const lastMsg = getLastReceivedMessage();
        if (!lastMsg) {
          setError('No received messages to reply to yet.');
          return;
        }
        textToSend = lastMsg;
        break;
      }
      case 'sentiment': {
        // Use the last received message or let user type
        const lastMsg = getLastReceivedMessage();
        if (lastMsg) {
          textToSend = lastMsg;
        } else {
          // Wait for user input
          return;
        }
        break;
      }
      case 'summarize': {
        const chatLog = getChatLog();
        if (!chatLog.trim()) {
          setError('No messages to summarize yet.');
          return;
        }
        textToSend = chatLog;
        break;
      }
      case 'rephrase': {
        // Use current input text or let user type
        if (inputText?.trim()) {
          textToSend = inputText;
        } else {
          // Wait for user input
          return;
        }
        break;
      }
    }

    if (textToSend) {
      await executeAi(featureId, textToSend);
    }
  };

  // Safely converts backend response to a plain string
  const toStr = (data) => {
    if (data === null || data === undefined) return '';
    if (typeof data === 'string') return data;
    // Spring Boot error body → extract message field or stringify
    if (typeof data === 'object') {
      if (data.message) return data.message;
      if (data.error) return `Error ${data.status || ''}: ${data.error}`;
      return JSON.stringify(data);
    }
    return String(data);
  };

  const executeAi = async (featureId, text) => {
    setIsLoading(true);
    setError('');
    setResult('');

    try {
      let response;
      switch (featureId) {
        case 'reply':
          response = await getSmartReply(text);
          break;
        case 'sentiment':
          response = await getSentiment(text);
          break;
        case 'summarize':
          response = await getSummary(text);
          break;
        case 'rephrase':
          response = await getRephrase(text);
          break;
        default:
          return;
      }
      // Always convert to string to prevent React render crash
      const resultText = toStr(response.data);
      if (!resultText) {
        setError('AI returned an empty response. Please try again.');
      } else {
        setResult(resultText);
      }
    } catch (err) {
      console.error('AI error:', err);
      const errData = err.response?.data;
      const errMsg = toStr(errData) || err.message || 'AI service unavailable. Make sure the backend is running with a valid Gemini API key.';
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (customInput.trim() && activeFeature) {
      executeAi(activeFeature, customInput.trim());
    }
  };

  const handleUseResult = (text) => {
    if (onUseMessage) {
      onUseMessage(text);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-[100] w-full max-w-[100vw] sm:max-w-[320px] md:relative md:inset-auto md:z-auto lg:max-w-[360px] flex-shrink-0 bg-[#1E1F22] flex flex-col border-l border-[#3A3C42]/50 shadow-2xl animate-in slide-in-from-right duration-300 h-full overflow-hidden">
      
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#3A3C42]/50 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <AiSparkle className="text-white" />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-[#F2F3F5] leading-tight">Loop AI</h3>
            <p className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider">Powered by Gemini</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-md flex items-center justify-center text-[#949BA4] hover:text-white hover:bg-[#35373C] transition-all"
        >
          <X className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
        
        {/* Features Grid */}
        <div className="space-y-2">
          {features.map((feat) => (
            <FeatureCard
              key={feat.id}
              icon={feat.icon}
              title={feat.title}
              description={feat.description}
              gradient={feat.gradient}
              isActive={activeFeature === feat.id}
              onClick={() => handleFeatureClick(feat.id)}
            />
          ))}
        </div>

        {/* Active Feature Content */}
        {activeFeature && (
          <div className="mt-4 animate-in fade-in duration-200">
            <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent mb-4" />

            {/* Custom input for sentiment/rephrase when no auto text */}
            {((activeFeature === 'sentiment' && !getLastReceivedMessage()) || 
              (activeFeature === 'rephrase' && !inputText?.trim())) && !result && !isLoading && (
              <form onSubmit={handleCustomSubmit} className="mb-3">
                <label className="text-[11px] font-bold text-[#949BA4] uppercase tracking-wider mb-2 block">
                  {activeFeature === 'sentiment' ? 'Enter text to analyze' : 'Enter text to rephrase'}
                </label>
                <div className="flex gap-2">
                  <input
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder={activeFeature === 'sentiment' ? 'Type a message...' : 'Type your draft...'}
                    className="flex-1 bg-[#2B2D31] border border-[#3A3C42] rounded-lg px-3 py-2 text-[13px] text-[#DBDEE1] placeholder:text-[#72767D] outline-none focus:border-purple-500/50 transition-colors"
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={!customInput.trim()}
                    className="p-2 bg-purple-600 hover:bg-purple-700 disabled:bg-[#3A3C42] rounded-lg text-white transition-all active:scale-95 shadow-lg shadow-purple-600/20 disabled:shadow-none"
                  >
                    <Zap className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* Loading */}
            {isLoading && (
              <div className="rounded-xl border border-[#3A3C42] bg-[#2B2D31]/50 overflow-hidden">
                <div className="px-3 py-2 border-b border-[#3A3C42]/50 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 text-purple-400 animate-spin" />
                  <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wider">
                    {activeFeature === 'reply' && 'Generating smart reply...'}
                    {activeFeature === 'sentiment' && 'Analyzing sentiment...'}
                    {activeFeature === 'summarize' && 'Summarizing conversation...'}
                    {activeFeature === 'rephrase' && 'Rephrasing your text...'}
                  </span>
                </div>
                <ShimmerLoading />
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 animate-in fade-in duration-200">
                <p className="text-[12px] text-red-300 leading-snug">
                  {typeof error === 'string' ? error : JSON.stringify(error)}
                </p>
                <p className="text-[11px] text-red-400/70 mt-1">
                  💡 Make sure your Gemini API key is set in <code className="bg-red-900/30 px-1 rounded">application.properties</code>
                </p>
              </div>
            )}

            {/* Result */}
            {result && !isLoading && (
              <ResultCard
                result={result}
                type={activeFeature}
                onUse={handleUseResult}
                onCopy={() => navigator.clipboard.writeText(result)}
              />
            )}

            {/* Retry button */}
            {result && !isLoading && (activeFeature === 'reply' || activeFeature === 'rephrase') && (
              <button
                onClick={() => handleFeatureClick(activeFeature)}
                className="mt-2 w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-[#3A3C42] bg-[#2B2D31]/50 hover:bg-[#35373C] text-[#949BA4] hover:text-[#DBDEE1] text-[12px] font-bold transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Generate another
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-[#3A3C42]/50 shrink-0">
        <div className="flex items-center gap-2 text-[10px] text-[#72767D]">
          <Brain className="w-3.5 h-3.5 text-purple-500/50" />
          <span>Loop AI uses Google Gemini. Responses may not always be accurate.</span>
        </div>
      </div>
    </div>
  );
}
