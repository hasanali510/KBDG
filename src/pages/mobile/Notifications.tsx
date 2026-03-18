import { useAppStore } from '@/store/useAppStore';
import { Bell, CheckCircle2, AlertCircle, ArrowLeft, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

export default function Notifications() {
  const { notifications, currentUser, markNotificationRead } = useAppStore();
  const navigate = useNavigate();

  const userNotifications = notifications
    .filter(n => n.userId === currentUser?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="flex flex-col min-h-screen bg-rose-50/50 max-w-md mx-auto relative overflow-hidden font-sans">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl text-slate-800 px-6 py-6 flex items-center justify-between border-b border-slate-100 z-10 sticky top-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-3 -ml-2 hover:bg-slate-100 rounded-2xl transition-all active:scale-90">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="font-black text-xl text-slate-800">নোটিফিকেশন</h1>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">আপনার সব আপডেট</p>
          </div>
        </div>
        <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center text-rose-500 shadow-inner">
          <Bell className="w-5 h-5" />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-6 scroll-smooth pb-10">
        {userNotifications.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-12 text-center shadow-xl shadow-slate-200/50 border border-slate-100 mt-10">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Bell className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">কোন নোটিফিকেশন নেই</h3>
            <p className="text-sm text-slate-500 font-bold">আপনি সব আপডেট দেখেছেন!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {userNotifications.map(notification => (
              <div 
                key={notification.id} 
                onClick={() => markNotificationRead(notification.id)}
                className={`p-6 rounded-[2rem] border transition-all cursor-pointer relative overflow-hidden group active:scale-95 ${
                  notification.read 
                    ? 'bg-white border-slate-100 shadow-sm' 
                    : 'bg-white border-rose-100 shadow-xl shadow-rose-500/5'
                }`}
              >
                {!notification.read && (
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500"></div>
                )}
                
                <div className="flex gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                    notification.read ? 'bg-slate-50 text-slate-400' : 'bg-rose-50 text-rose-500'
                  }`}>
                    {notification.title.includes('জরুরী') ? (
                      <AlertCircle className="w-7 h-7" />
                    ) : (
                      <CheckCircle2 className="w-7 h-7" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`font-black text-lg leading-tight ${notification.read ? 'text-slate-600' : 'text-slate-900'}`}>
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <span className="w-2.5 h-2.5 bg-rose-500 rounded-full shadow-lg shadow-rose-500/50 animate-pulse"></span>
                      )}
                    </div>
                    <p className={`text-sm font-bold leading-relaxed ${notification.read ? 'text-slate-400' : 'text-slate-600'}`}>
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <Clock className="w-3.5 h-3.5 text-slate-300" />
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                        {formatDistanceToNow(new Date(notification.createdAt))} আগে
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
