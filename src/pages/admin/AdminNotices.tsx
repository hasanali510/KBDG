import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Bell, Plus, Trash2, AlertCircle, Calendar } from 'lucide-react';

export default function AdminNotices() {
  const { notices, addNotice, deleteNotice, currentUser } = useAppStore();
  const [showAddNotice, setShowAddNotice] = useState(false);
  
  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    isImportant: false
  });

  const handleAddNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotice.title || !newNotice.content) return;

    addNotice({
      title: newNotice.title,
      content: newNotice.content,
      isImportant: newNotice.isImportant,
      date: new Date().toISOString(),
      authorId: currentUser?.id || 'admin'
    });

    setShowAddNotice(false);
    setNewNotice({
      title: '',
      content: '',
      isImportant: false
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">নোটিশ বোর্ড</h1>
          <p className="text-slate-500">সংগঠনের সকল সদস্যের জন্য নোটিশ ও ঘোষণা</p>
        </div>
        <button 
          onClick={() => setShowAddNotice(true)}
          className="bg-rose-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-rose-600 transition-colors"
        >
          <Plus size={20} />
          <span>নতুন নোটিশ দিন</span>
        </button>
      </div>

      <div className="space-y-4">
        {notices.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">কোনো নোটিশ নেই</h3>
            <p className="text-slate-500">বর্তমানে কোনো সক্রিয় নোটিশ বা ঘোষণা নেই।</p>
          </div>
        ) : (
          notices.map((notice) => (
            <div 
              key={notice.id} 
              className={`bg-white rounded-2xl border p-6 relative group transition-shadow hover:shadow-md ${
                notice.isImportant ? 'border-rose-200' : 'border-slate-200'
              }`}
            >
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => deleteNotice(notice.id)}
                  className="p-2 bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-100 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="flex items-start gap-4 pr-12">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  notice.isImportant ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  {notice.isImportant ? <AlertCircle size={24} /> : <Bell size={24} />}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-slate-800">{notice.title}</h3>
                    {notice.isImportant && (
                      <span className="px-2.5 py-1 bg-rose-100 text-rose-600 rounded-lg text-xs font-bold uppercase tracking-wider">
                        জরুরী
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-4">
                    <Calendar size={14} />
                    <span>{new Date(notice.date).toLocaleDateString('bn-BD', { 
                      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                    })}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {notice.content}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Notice Modal */}
      {showAddNotice && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">নতুন নোটিশ তৈরি করুন</h3>
              <button 
                onClick={() => setShowAddNotice(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddNotice} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">নোটিশের শিরোনাম</label>
                <input 
                  type="text" 
                  required
                  value={newNotice.title}
                  onChange={e => setNewNotice({...newNotice, title: e.target.value})}
                  placeholder="যেমন: আগামী শুক্রবার সাধারণ সভা"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">বিস্তারিত বিবরণ</label>
                <textarea 
                  required
                  value={newNotice.content}
                  onChange={e => setNewNotice({...newNotice, content: e.target.value})}
                  placeholder="নোটিশের বিস্তারিত লিখুন..."
                  rows={6}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 resize-none"
                />
              </div>

              <label className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                <input 
                  type="checkbox" 
                  checked={newNotice.isImportant}
                  onChange={e => setNewNotice({...newNotice, isImportant: e.target.checked})}
                  className="w-5 h-5 text-rose-500 rounded border-slate-300 focus:ring-rose-500"
                />
                <div>
                  <p className="font-bold text-slate-800">এটি একটি জরুরী নোটিশ</p>
                  <p className="text-xs text-slate-500">জরুরী নোটিশগুলো সবার উপরে হাইলাইট করে দেখানো হবে</p>
                </div>
              </label>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowAddNotice(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-medium"
                >
                  বাতিল
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-rose-500 text-white rounded-xl hover:bg-rose-600 font-medium"
                >
                  প্রকাশ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
