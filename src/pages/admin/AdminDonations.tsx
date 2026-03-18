import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Wallet, CheckCircle2, Clock, DollarSign, Smartphone, User } from 'lucide-react';

export default function AdminDonations() {
  const { fundDonations, verifyFundDonation } = useAppStore();

  const totalAmount = fundDonations
    .filter(d => d.status === 'verified')
    .reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="space-y-8 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-800">তহবিল অনুদানসমূহ</h2>
          <p className="text-sm text-slate-500 font-bold">সংগঠনের তহবিলে আসা অনুদানসমূহ যাচাই করুন</p>
        </div>
        <div className="bg-emerald-500 text-white px-8 py-4 rounded-[2rem] shadow-xl shadow-emerald-500/20 flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-100">মোট তহবিল</p>
            <p className="text-2xl font-black">৳ {totalAmount.toLocaleString('bn-BD')}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {fundDonations.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-12 text-center shadow-xl shadow-slate-200/40 border border-slate-100">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <DollarSign className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">কোন অনুদান পাওয়া যায়নি</h3>
            <p className="text-sm text-slate-500 font-bold">নতুন অনুদান আসলে এখানে দেখা যাবে</p>
          </div>
        ) : (
          fundDonations.map(donation => (
            <div key={donation.id} className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center font-black text-emerald-600 text-xl border-2 border-emerald-100">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800">{donation.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-bold mt-1">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(donation.date).toLocaleDateString('bn-BD')}</span>
                      <span className="flex items-center gap-1 uppercase tracking-widest"><Smartphone className="w-3 h-3" /> {donation.paymentMethod}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex gap-12">
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">পরিমাণ</p>
                    <p className="text-2xl font-black text-slate-800">৳ {donation.amount.toLocaleString('bn-BD')}</p>
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">TrxID</p>
                    <p className="text-sm font-black text-rose-500 bg-rose-50 px-4 py-1 rounded-xl border border-rose-100">{donation.transactionId}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center gap-3 min-w-[200px]">
                <div className={`px-6 py-2 rounded-xl text-center text-[10px] font-black uppercase tracking-widest mb-2 ${
                  donation.status === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                  'bg-emerald-50 text-emerald-600 border border-emerald-100'
                }`}>
                  {donation.status === 'pending' ? 'অপেক্ষমান' : 'ভেরিফাইড'}
                </div>

                {donation.status === 'pending' && (
                  <button 
                    onClick={() => verifyFundDonation(donation.id)}
                    className="w-full bg-emerald-500 text-white font-black py-3 rounded-xl shadow-lg hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" /> ভেরিফাই করুন
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
