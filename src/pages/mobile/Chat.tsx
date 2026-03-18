import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { Send, ArrowLeft, Phone, MapPin, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { bn } from 'date-fns/locale';

export const Chat: React.FC = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const { currentUser, requests, messages, sendMessage, users } = useAppStore();
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const request = requests.find(r => r.id === requestId);
  const chatMessages = messages.filter(m => m.requestId === requestId);
  
  // Find the other person in the chat
  const isRequester = currentUser?.id === request?.requesterId;
  const otherUserId = isRequester ? request?.acceptedById : request?.requesterId;
  const otherUser = users.find(u => u.id === otherUserId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSend = () => {
    if (!inputText.trim() || !requestId) return;
    sendMessage(requestId, inputText);
    setInputText('');
  };

  if (!request) return <div className="p-8 text-center">অনুরোধটি পাওয়া যায়নি</div>;

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="font-bold text-slate-900 leading-tight">
            {otherUser?.name || 'ব্যবহারকারী'}
          </h1>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${otherUser?.isAvailable ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
            {otherUser?.isAvailable ? 'অনলাইন' : 'অফলাইন'}
          </p>
        </div>
        {otherUser && !otherUser.hidePhone && (
          <a href={`tel:${otherUser.phone}`} className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors">
            <Phone size={20} />
          </a>
        )}
      </header>

      {/* Request Info Summary */}
      <div className="bg-red-50 px-4 py-2 border-b border-red-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-red-700 font-medium">
          <span className="bg-red-600 text-white px-2 py-0.5 rounded-full">{request.bloodGroup}</span>
          <span>{request.hospitalName}</span>
        </div>
        <div className="text-[10px] text-red-500">
          {format(new Date(request.createdAt), 'd MMMM, h:mm a', { locale: bn })}
        </div>
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {chatMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2 opacity-60">
              <div className="p-4 bg-white rounded-full shadow-sm">
                <Send size={32} className="rotate-45" />
              </div>
              <p className="text-sm">কথোপকথন শুরু করুন</p>
            </div>
          ) : (
            chatMessages.map((msg) => {
              const isMe = msg.senderId === currentUser?.id;
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl shadow-sm ${
                    isMe 
                      ? 'bg-red-600 text-white rounded-tr-none' 
                      : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-red-100' : 'text-slate-400'}`}>
                      {format(new Date(msg.createdAt), 'h:mm a', { locale: bn })}
                    </p>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t safe-bottom">
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-full">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="বার্তা লিখুন..."
            className="flex-1 bg-transparent px-4 py-2 text-sm focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className={`p-2.5 rounded-full transition-all ${
              inputText.trim() 
                ? 'bg-red-600 text-white shadow-md active:scale-90' 
                : 'bg-slate-200 text-slate-400'
            }`}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
