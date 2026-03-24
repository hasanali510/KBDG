import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Wallet, TrendingUp, TrendingDown, Plus, Trash2, Calendar, FileText } from 'lucide-react';

export default function AdminFinance() {
  const { fundDonations, expenses, addExpense, deleteExpense, currentUser } = useAppStore();
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    category: 'ক্যাম্পেইন',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  const verifiedDonations = fundDonations.filter(d => d.status === 'verified');
  const totalIncome = verifiedDonations.reduce((sum, d) => sum + d.amount, 0);
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const currentBalance = totalIncome - totalExpense;

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.title || !newExpense.amount) return;

    addExpense({
      title: newExpense.title,
      amount: Number(newExpense.amount),
      category: newExpense.category,
      date: newExpense.date,
      description: newExpense.description,
      addedBy: currentUser?.name || 'Admin'
    });

    setShowAddExpense(false);
    setNewExpense({
      title: '',
      amount: '',
      category: 'ক্যাম্পেইন',
      date: new Date().toISOString().split('T')[0],
      description: ''
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">ফান্ড ও হিসাবরক্ষণ</h1>
          <p className="text-slate-500">সংগঠনের আয়-ব্যয়ের হিসাব</p>
        </div>
        <button 
          onClick={() => setShowAddExpense(true)}
          className="bg-rose-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-rose-600 transition-colors"
        >
          <Plus size={20} />
          <span>নতুন খরচ যুক্ত করুন</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">মোট আয় (ফান্ড)</p>
            <h3 className="text-2xl font-bold text-slate-800">৳ {totalIncome.toLocaleString()}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center">
            <TrendingDown size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">মোট ব্যয়</p>
            <h3 className="text-2xl font-bold text-slate-800">৳ {totalExpense.toLocaleString()}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">বর্তমান ব্যালেন্স</p>
            <h3 className="text-2xl font-bold text-slate-800">৳ {currentBalance.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-800">খরচের বিবরণী</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm">
                <th className="p-4 font-medium">তারিখ</th>
                <th className="p-4 font-medium">খাত/বিবরণ</th>
                <th className="p-4 font-medium">ক্যাটাগরি</th>
                <th className="p-4 font-medium">যুক্ত করেছেন</th>
                <th className="p-4 font-medium text-right">পরিমাণ</th>
                <th className="p-4 font-medium text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    কোনো খরচের রেকর্ড নেই
                  </td>
                </tr>
              ) : (
                expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-sm text-slate-600">
                      {new Date(expense.date).toLocaleDateString('bn-BD')}
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-slate-800">{expense.title}</p>
                      {expense.description && (
                        <p className="text-xs text-slate-500 mt-1">{expense.description}</p>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium">
                        {expense.category}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-600">{expense.addedBy}</td>
                    <td className="p-4 font-bold text-rose-600 text-right">
                      - ৳ {expense.amount.toLocaleString()}
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => deleteExpense(expense.id)}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">নতুন খরচ যুক্ত করুন</h3>
              <button 
                onClick={() => setShowAddExpense(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddExpense} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">খরচের খাত</label>
                <input 
                  type="text" 
                  required
                  value={newExpense.title}
                  onChange={e => setNewExpense({...newExpense, title: e.target.value})}
                  placeholder="যেমন: ব্যানার প্রিন্ট"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">পরিমাণ (৳)</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    value={newExpense.amount}
                    onChange={e => setNewExpense({...newExpense, amount: e.target.value})}
                    placeholder="500"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">তারিখ</label>
                  <input 
                    type="date" 
                    required
                    value={newExpense.date}
                    onChange={e => setNewExpense({...newExpense, date: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ক্যাটাগরি</label>
                <select 
                  value={newExpense.category}
                  onChange={e => setNewExpense({...newExpense, category: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                >
                  <option value="ক্যাম্পেইন">ক্যাম্পেইন</option>
                  <option value="অফিস খরচ">অফিস খরচ</option>
                  <option value="রোগীর সাহায্য">রোগীর সাহায্য</option>
                  <option value="অন্যান্য">অন্যান্য</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">বিস্তারিত (ঐচ্ছিক)</label>
                <textarea 
                  value={newExpense.description}
                  onChange={e => setNewExpense({...newExpense, description: e.target.value})}
                  placeholder="খরচের বিস্তারিত বিবরণ..."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 resize-none"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowAddExpense(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-medium"
                >
                  বাতিল
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-rose-500 text-white rounded-xl hover:bg-rose-600 font-medium"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
