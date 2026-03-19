import React, { useState } from 'react';
import { useAppStore, User } from '@/store/useAppStore';
import { Search, Filter, MoreVertical, Edit2, Trash2, ShieldCheck, UserX, Bell, CheckCircle2, XCircle, Loader2, Droplet, Download, BadgeCheck, Award } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const getBadgeStyle = (badge: string) => {
  switch (badge) {
    case 'রক্তদাতা হিরো': return { icon: Award, bg: 'bg-amber-100', text: 'text-amber-700' };
    case '৫ বার রক্তদান': return { icon: Droplet, bg: 'bg-rose-100', text: 'text-rose-700' };
    case 'প্রথম রক্তদান': return { icon: CheckCircle2, bg: 'bg-blue-100', text: 'text-blue-700' };
    case '১০ বার রক্তদান': return { icon: ShieldCheck, bg: 'bg-emerald-100', text: 'text-emerald-700' };
    case 'সুপার ডোনার': return { icon: BadgeCheck, bg: 'bg-purple-100', text: 'text-purple-700' };
    default: return { icon: Award, bg: 'bg-slate-100', text: 'text-slate-700' };
  }
};

export default function AdminUsers() {
  const { users, sendNotification, updateUser } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isNotifying, setIsNotifying] = useState(false);
  const [notifData, setNotifData] = useState({ title: '', message: '' });

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Blood Donors List", 14, 15);
    
    const tableColumn = ["Name", "Email", "Phone", "Blood Group", "Location", "Donations", "Status"];
    const tableRows = filteredUsers.map(user => [
      user.name,
      user.email,
      user.phone,
      user.bloodGroup,
      user.location,
      user.donationsCount.toString(),
      user.isVerified ? 'Verified' : 'Unverified'
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    
    doc.save("blood_donors.pdf");
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    updateUser(editingUser.id, editingUser);
    setEditingUser(null);
  };

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
            <button 
              onClick={handleExportPDF}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-rose-50 border-2 border-rose-100 rounded-2xl text-rose-600 font-black text-sm hover:bg-rose-100 transition-all shadow-sm active:scale-95"
            >
              <Download className="w-5 h-5" /> PDF এক্সপোর্ট
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
                <th className="p-6 font-black">আইডি কার্ড</th>
                <th className="p-6 font-black text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-50">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-md bg-white" />
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${user.isAvailable ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-black text-slate-800 text-base">{user.name}</p>
                          {user.isVerified && <BadgeCheck className="w-4 h-4 text-blue-500" title="Verified" />}
                          {user.role === 'admin' && <ShieldCheck className="w-4 h-4 text-rose-500" title="Admin" />}
                        </div>
                        <p className="text-xs text-slate-400 font-bold">{user.location}</p>
                        {user.badges && user.badges.length > 0 && (
                          <div className="flex gap-1 mt-1 flex-wrap">
                            {user.badges.map((badge, idx) => {
                              const { icon: Icon, bg, text } = getBadgeStyle(badge);
                              return (
                                <span key={idx} className={`text-[10px] ${bg} ${text} px-2 py-0.5 rounded-full font-bold flex items-center gap-1`}>
                                  <Icon className="w-3 h-3" /> {badge}
                                </span>
                              );
                            })}
                          </div>
                        )}
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
                    {user.idCardStatus === 'pending' ? (
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => updateUser(user.id, { idCardStatus: 'approved' })}
                          className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200"
                          title="Approve ID Card"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => updateUser(user.id, { idCardStatus: 'rejected' })}
                          className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                          title="Reject ID Card"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ) : user.idCardStatus === 'approved' ? (
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold">অনুমোদিত</span>
                    ) : user.idCardStatus === 'rejected' ? (
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-[10px] font-bold">বাতিল</span>
                    ) : (
                      <span className="text-slate-400 text-xs font-bold">-</span>
                    )}
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex items-center justify-end gap-3 transition-all">
                      <button 
                        onClick={() => setSelectedUser(user.id)}
                        className="p-3 bg-amber-100 text-amber-600 hover:bg-amber-200 rounded-2xl transition-all active:scale-90"
                        title="নোটিফিকেশন পাঠান"
                      >
                        <Bell className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => setEditingUser(user)}
                        className="p-3 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-2xl transition-all active:scale-90" 
                        title="এডিট করুন"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button className="p-3 bg-red-100 text-red-600 hover:bg-red-200 rounded-2xl transition-all active:scale-90" title="ডিলিট করুন">
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
      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-500">
                  <Edit2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800">একাউন্ট এডিট করুন</h3>
                  <p className="text-xs text-slate-500 font-bold">{editingUser.name} এর তথ্য পরিবর্তন করুন</p>
                </div>
              </div>
              <button onClick={() => setEditingUser(null)} className="p-3 hover:bg-white rounded-2xl transition-colors">
                <XCircle className="w-6 h-6 text-slate-300" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateUser} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">নাম</label>
                  <input 
                    type="text" 
                    required
                    value={editingUser.name}
                    onChange={e => setEditingUser({...editingUser, name: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-50 focus:border-blue-200 focus:bg-white outline-none transition-all font-bold text-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">ইমেইল</label>
                  <input 
                    type="email" 
                    required
                    value={editingUser.email}
                    onChange={e => setEditingUser({...editingUser, email: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-50 focus:border-blue-200 focus:bg-white outline-none transition-all font-bold text-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">ফোন</label>
                  <input 
                    type="text" 
                    required
                    value={editingUser.phone}
                    onChange={e => setEditingUser({...editingUser, phone: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-50 focus:border-blue-200 focus:bg-white outline-none transition-all font-bold text-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">রক্তদানের সংখ্যা</label>
                  <input 
                    type="number" 
                    required
                    value={editingUser.donationsCount}
                    onChange={e => setEditingUser({...editingUser, donationsCount: parseInt(e.target.value) || 0})}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-50 focus:border-blue-200 focus:bg-white outline-none transition-all font-bold text-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">রক্তের গ্রুপ</label>
                  <select 
                    value={editingUser.bloodGroup}
                    onChange={e => setEditingUser({...editingUser, bloodGroup: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-50 focus:border-blue-200 focus:bg-white outline-none transition-all font-bold text-slate-700"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">রোল</label>
                  <select 
                    value={editingUser.role}
                    onChange={e => setEditingUser({...editingUser, role: e.target.value as 'user' | 'admin'})}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-50 focus:border-blue-200 focus:bg-white outline-none transition-all font-bold text-slate-700"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">ব্যাজ নির্বাচন করুন</label>
                  <select 
                    multiple
                    value={editingUser.badges || []}
                    onChange={e => setEditingUser({...editingUser, badges: Array.from(e.target.selectedOptions, option => option.value)})}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-50 focus:border-blue-200 focus:bg-white outline-none transition-all font-bold text-slate-700 h-32"
                  >
                    {['রক্তদাতা হিরো', '৫ বার রক্তদান', 'প্রথম রক্তদান', '১০ বার রক্তদান', 'সুপার ডোনার'].map(badge => (
                      <option key={badge} value={badge}>{badge}</option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-400 font-bold ml-1">একাধিক ব্যাজ সিলেক্ট করতে Ctrl/Cmd চেপে ধরুন</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={editingUser.isVerified || false}
                    onChange={e => setEditingUser({...editingUser, isVerified: e.target.checked})}
                    className="w-5 h-5 rounded border-slate-300 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="font-bold text-slate-700 flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4 text-blue-500" /> ভেরিফাইড একাউন্ট
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={editingUser.isDonor}
                    onChange={e => setEditingUser({...editingUser, isDonor: e.target.checked})}
                    className="w-5 h-5 rounded border-slate-300 text-rose-500 focus:ring-rose-500"
                  />
                  <span className="font-bold text-slate-700 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-rose-500" /> রক্তদাতা
                  </span>
                </label>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 px-8 py-4 rounded-2xl border-2 border-slate-100 text-slate-500 font-black hover:bg-slate-50 transition-all active:scale-95"
                >
                  বাতিল করুন
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-8 py-4 rounded-2xl bg-blue-500 text-white font-black shadow-xl shadow-blue-500/20 hover:bg-blue-600 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" /> সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
