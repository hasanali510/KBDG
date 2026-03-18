import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Search, Filter, MoreVertical, Edit2, Trash2, ShieldCheck, UserX, Bell, CheckCircle2, XCircle, Loader2, Droplet } from 'lucide-react';

export default function AdminUsers() {
  const { users, sendNotification } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isNotifying, setIsNotifying] = useState(false);
  const [notifData, setNotifData] = useState({ title: '', message: '' });

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    setIsNotifying(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    sendNotification(selectedUser, notifData.title, notifData.message);
    
    setIsNotifying(false);
    setSelectedUser(null);
    setNotifData({ title: '', message: '' });
    alert('নোটিফিকেশন পাঠানো হয়েছে!');
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-800">ব্যবহারকারী ব্যবস্থাপনা</h2>
          <p className="text-sm text-slate-500 font-bold">রক্তদাতা এবং অনুরোধকারীদের পরিচালনা করুন</p>
        </div>
        <button className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black shadow-xl shadow-slate-900/20 hover:shadow-slate-900/40 hover:-translate-y-0.5 transition-all active:scale-95">
          নতুন ব্যবহারকারী যোগ করুন
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row gap-6 justify-between items-center bg-slate-50/30">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="নাম বা ইমেইল দিয়ে খুঁজুন..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border-2 border-slate-100 focus:border-rose-200 focus:ring-4 focus:ring-rose-500/5 outline-none transition-all font-bold text-slate-700"
            />
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl text-slate-600 font-black text-sm hover:bg-slate-50 transition-all shadow-sm active:scale-95">
              <Filter className="w-5 h-5" /> ফিল্টার
            </button>
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl text-slate-600 font-black text-sm hover:bg-slate-50 transition-all shadow-sm active:scale-95">
              CSV এক্সপোর্ট
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest border-b border-slate-100">
                <th className="p-6 font-black">ব্যবহারকারী</th>
                <th className="p-6 font-black">যোগাযোগ</th>
                <th className="p-6 font-black">রক্তের গ্রুপ</th>
                <th className="p-6 font-black">অবস্থা</th>
                <th className="p-6 font-black">রক্তদান</th>
                <th className="p-6 font-black text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-50">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-md" />
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${user.isAvailable ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                      </div>
                      <div>
                        <p className="font-black text-slate-800 text-base">{user.name}</p>
                        <p className="text-xs text-slate-400 font-bold">{user.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <p className="font-bold text-slate-700">{user.email}</p>
                    <p className="text-xs text-slate-400 font-bold">{user.phone}</p>
                  </td>
                  <td className="p-6">
                    <span className="px-4 py-1.5 bg-rose-50 text-rose-600 rounded-xl font-black text-xs border border-rose-100 inline-block">
                      {user.bloodGroup}
                    </span>
                  </td>
                  <td className="p-6">
                    {user.isDonor ? (
                      <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl font-black text-xs border border-emerald-100 flex items-center gap-2 w-max">
                        <ShieldCheck className="w-4 h-4" /> সক্রিয় রক্তদাতা
                      </span>
                    ) : (
                      <span className="px-4 py-1.5 bg-slate-100 text-slate-500 rounded-xl font-black text-xs border border-slate-200 flex items-center gap-2 w-max">
                        <UserX className="w-4 h-4" /> নিষ্ক্রিয়
                      </span>
                    )}
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                      <Droplet className="w-4 h-4 text-rose-500" fill="currentColor" />
                      <span className="font-black text-slate-700 text-lg">{user.donationsCount}</span>
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => setSelectedUser(user.id)}
                        className="p-3 text-amber-500 hover:bg-amber-50 rounded-2xl transition-all active:scale-90"
                        title="নোটিফিকেশন পাঠান"
                      >
                        <Bell className="w-5 h-5" />
                      </button>
                      <button className="p-3 text-blue-500 hover:bg-blue-50 rounded-2xl transition-all active:scale-90" title="এডিট করুন">
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button className="p-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all active:scale-90" title="ডিলিট করুন">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400 font-bold bg-slate-50/30">
          <p>{filteredUsers.length} টি এন্ট্রির মধ্যে ১ থেকে {filteredUsers.length} টি দেখানো হচ্ছে</p>
          <div className="flex gap-2">
            <button className="px-5 py-2.5 border-2 border-slate-100 rounded-xl hover:bg-white transition-all disabled:opacity-50 font-black">পূর্ববর্তী</button>
            <button className="px-5 py-2.5 bg-rose-500 text-white rounded-xl shadow-lg shadow-rose-500/20 font-black">১</button>
            <button className="px-5 py-2.5 border-2 border-slate-100 rounded-xl hover:bg-white transition-all disabled:opacity-50 font-black">পরবর্তী</button>
          </div>
        </div>
      </div>

      {/* Notification Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-500">
                  <Bell className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800">নোটিফিকেশন পাঠান</h3>
                  <p className="text-xs text-slate-500 font-bold">ব্যবহারকারীকে সরাসরি মেসেজ দিন</p>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="p-3 hover:bg-white rounded-2xl transition-colors">
                <XCircle className="w-6 h-6 text-slate-300" />
              </button>
            </div>
            
            <form onSubmit={handleSendNotification} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">শিরোনাম</label>
                <input 
                  type="text" 
                  required
                  value={notifData.title}
                  onChange={e => setNotifData({...notifData, title: e.target.value})}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-50 focus:border-amber-200 focus:bg-white outline-none transition-all font-bold text-slate-700"
                  placeholder="যেমন: রক্তদানের জন্য ধন্যবাদ"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">মেসেজ</label>
                <textarea 
                  required
                  rows={4}
                  value={notifData.message}
                  onChange={e => setNotifData({...notifData, message: e.target.value})}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-50 focus:border-amber-200 focus:bg-white outline-none transition-all font-bold text-slate-700 resize-none"
                  placeholder="আপনার মেসেজটি এখানে লিখুন..."
                />
              </div>
              
              <div className="flex gap-4 pt-2">
                <button 
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="flex-1 px-8 py-4 rounded-2xl border-2 border-slate-100 text-slate-500 font-black hover:bg-slate-50 transition-all active:scale-95"
                >
                  বাতিল করুন
                </button>
                <button 
                  type="submit"
                  disabled={isNotifying}
                  className="flex-1 px-8 py-4 rounded-2xl bg-amber-500 text-white font-black shadow-xl shadow-amber-500/20 hover:bg-amber-600 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isNotifying ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                  পাঠিয়ে দিন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
