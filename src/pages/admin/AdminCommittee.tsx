import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Users, Shield, Plus, Trash2, Edit2, Search, CheckCircle2 } from 'lucide-react';

export default function AdminCommittee() {
  const { users, committeeMembers, addCommitteeMember, removeCommitteeMember, updateCommitteeMember } = useAppStore();
  const [showAddMember, setShowAddMember] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [newMember, setNewMember] = useState({
    userId: '',
    designation: '',
    department: 'কেন্দ্রীয় কমিটি',
    joinDate: new Date().toISOString().split('T')[0],
    status: 'active' as const
  });

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.userId || !newMember.designation) return;

    addCommitteeMember({
      userId: newMember.userId,
      designation: newMember.designation,
      department: newMember.department,
      joinDate: newMember.joinDate,
      status: newMember.status
    });

    setShowAddMember(false);
    setNewMember({
      userId: '',
      designation: '',
      department: 'কেন্দ্রীয় কমিটি',
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active'
    });
  };

  const getMemberDetails = (userId: string) => {
    return users.find(u => u.id === userId);
  };

  const availableUsers = users.filter(u => 
    !committeeMembers.some(cm => cm.userId === u.id && cm.status === 'active') &&
    (u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.phone.includes(searchQuery))
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">কমিটি ম্যানেজমেন্ট</h1>
          <p className="text-slate-500">সংগঠনের কার্যকরী কমিটি ও সদস্য পরিচালনা</p>
        </div>
        <button 
          onClick={() => setShowAddMember(true)}
          className="bg-rose-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-rose-600 transition-colors"
        >
          <Plus size={20} />
          <span>নতুন সদস্য যুক্ত করুন</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {committeeMembers.map((member) => {
          const user = getMemberDetails(member.userId);
          if (!user) return null;

          return (
            <div key={member.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button 
                  onClick={() => removeCommitteeMember(member.id)}
                  className="p-2 bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-100 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-16 h-16 rounded-full object-cover border-2 border-slate-100"
                />
                <div>
                  <h3 className="font-bold text-lg text-slate-800">{user.name}</h3>
                  <div className="flex items-center gap-1 text-rose-500 font-medium text-sm">
                    <Shield size={14} />
                    <span>{member.designation}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">ডিপার্টমেন্ট</span>
                  <span className="font-medium">{member.department}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">যোগদানের তারিখ</span>
                  <span className="font-medium">{new Date(member.joinDate).toLocaleDateString('bn-BD')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">মোবাইল</span>
                  <span className="font-medium">{user.phone}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">অবস্থা</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    member.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {member.status === 'active' ? 'সক্রিয়' : 'সাবেক'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
              <h3 className="text-lg font-bold text-slate-800">কমিটিতে যুক্ত করুন</h3>
              <button 
                onClick={() => setShowAddMember(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form onSubmit={handleAddMember} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">সদস্য নির্বাচন করুন</label>
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="text" 
                      placeholder="নাম বা মোবাইল নম্বর দিয়ে খুঁজুন..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                  
                  <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100">
                    {availableUsers.length === 0 ? (
                      <div className="p-4 text-center text-slate-500 text-sm">কোনো ব্যবহারকারী পাওয়া যায়নি</div>
                    ) : (
                      availableUsers.map(user => (
                        <div 
                          key={user.id}
                          onClick={() => setNewMember({...newMember, userId: user.id})}
                          className={`p-3 flex items-center gap-3 cursor-pointer transition-colors ${
                            newMember.userId === user.id ? 'bg-rose-50' : 'hover:bg-slate-50'
                          }`}
                        >
                          <img src={user.avatar} alt="" className="w-8 h-8 rounded-full" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                            <p className="text-xs text-slate-500">{user.phone}</p>
                          </div>
                          {newMember.userId === user.id && (
                            <CheckCircle2 className="w-5 h-5 text-rose-500" />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">পদবি (Designation)</label>
                  <input 
                    type="text" 
                    required
                    value={newMember.designation}
                    onChange={e => setNewMember({...newMember, designation: e.target.value})}
                    placeholder="যেমন: সভাপতি, সাধারণ সম্পাদক"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">ডিপার্টমেন্ট</label>
                    <select 
                      value={newMember.department}
                      onChange={e => setNewMember({...newMember, department: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                    >
                      <option value="কেন্দ্রীয় কমিটি">কেন্দ্রীয় কমিটি</option>
                      <option value="উপদেষ্টা মণ্ডলী">উপদেষ্টা মণ্ডলী</option>
                      <option value="আইটি ও প্রচার">আইটি ও প্রচার</option>
                      <option value="অর্থ সম্পাদক">অর্থ সম্পাদক</option>
                      <option value="রক্তদান বিষয়ক">রক্তদান বিষয়ক</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">যোগদানের তারিখ</label>
                    <input 
                      type="date" 
                      required
                      value={newMember.joinDate}
                      onChange={e => setNewMember({...newMember, joinDate: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowAddMember(false)}
                    className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-medium"
                  >
                    বাতিল
                  </button>
                  <button 
                    type="submit"
                    disabled={!newMember.userId || !newMember.designation}
                    className="flex-1 px-4 py-2.5 bg-rose-500 text-white rounded-xl hover:bg-rose-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    সংরক্ষণ করুন
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
