import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Receipt, Search, CheckCircle2, Clock, Download } from 'lucide-react';

const MONTHS = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
];

export default function AdminSubscriptions() {
  const { users, subscriptions, addSubscription } = useAppStore();
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[new Date().getMonth()]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [searchQuery, setSearchQuery] = useState('');

  const handleMarkAsPaid = (userId: string) => {
    addSubscription({
      userId,
      month: selectedMonth,
      year: selectedYear,
      amount: 100, // Default monthly fee
      status: 'paid',
      date: new Date().toISOString()
    });
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.phone.includes(searchQuery)
  );

  const totalCollected = subscriptions
    .filter(s => s.month === selectedMonth && s.year === selectedYear && s.status === 'paid')
    .reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">মাসিক চাঁদা সংগ্রহ</h1>
          <p className="text-slate-500">সদস্যদের মাসিক চাঁদা ও রসিদ ব্যবস্থাপনা</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
          <select 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-transparent font-medium text-slate-700 outline-none cursor-pointer px-2"
          >
            {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <div className="w-px h-6 bg-slate-200"></div>
          <select 
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-transparent font-medium text-slate-700 outline-none cursor-pointer px-2"
          >
            {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
            <Receipt size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">{selectedMonth} মাসের আদায়</p>
            <h3 className="text-2xl font-bold text-slate-800">৳ {totalCollected.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-lg font-bold text-slate-800">সদস্যদের তালিকা</h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="নাম বা মোবাইল নম্বর..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm">
                <th className="p-4 font-medium">সদস্য</th>
                <th className="p-4 font-medium">মোবাইল</th>
                <th className="p-4 font-medium">রক্তের গ্রুপ</th>
                <th className="p-4 font-medium">স্ট্যাটাস ({selectedMonth})</th>
                <th className="p-4 font-medium text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => {
                const isPaid = subscriptions.some(
                  s => s.userId === user.id && s.month === selectedMonth && s.year === selectedYear && s.status === 'paid'
                );

                return (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={user.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <p className="font-bold text-slate-800">{user.name}</p>
                          <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-600">{user.phone}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-rose-100 text-rose-600 rounded-lg text-xs font-bold">
                        {user.bloodGroup}
                      </span>
                    </td>
                    <td className="p-4">
                      {isPaid ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold">
                          <CheckCircle2 size={14} />
                          পরিশোধিত
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold">
                          <Clock size={14} />
                          বকেয়া
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {isPaid ? (
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="রসিদ ডাউনলোড করুন">
                          <Download size={18} />
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleMarkAsPaid(user.id)}
                          className="px-4 py-1.5 bg-rose-500 text-white text-sm font-medium rounded-lg hover:bg-rose-600 transition-colors"
                        >
                          আদায় করুন
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
