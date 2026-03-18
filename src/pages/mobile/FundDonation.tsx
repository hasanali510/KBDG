import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { Heart, CreditCard, Send, CheckCircle2, AlertCircle, Info, DollarSign, Smartphone } from 'lucide-react';

export default function FundDonation() {
  const { currentUser, donateToFund } = useAppStore();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bkash');
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    donateToFund({
      userId: currentUser?.id || null,
      name: currentUser?.name || 'Anonymous Donor',
      amount: Number(amount),
      paymentMethod,
      transactionId
    });
    
    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <Heart className="w-12 h-12 text-rose-600" fill="currentColor" />
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-4">ধন্যবাদ!</h2>
        <p className="text-slate-500 font-bold max-w-xs mx-auto mb-8">
          আপনার অনুদান সফলভাবে গ্রহণ করা হয়েছে। আমাদের টিম ট্রানজেকশনটি ভেরিফাই করবে। আপনার এই ক্ষুদ্র অবদান অনেকের মুখে হাসি ফোটাবে।
        </p>
        <button 
          onClick={() => navigate('/home')}
          className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black shadow-xl hover:bg-slate-800 transition-all active:scale-95"
        >
          হোমে ফিরে যান
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans pb-20">
      <div className="animate-in fade-in slide-in-from-top duration-700">
        <h2 className="text-3xl font-black text-slate-800">তহবিলে অনুদান</h2>
        <p className="text-sm text-slate-500 font-bold mt-1">আমাদের অন্যান্য সেবামূলক কাজে সহায়তা করুন</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-rose-500/30 relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-black mb-4">কেন অনুদান দিবেন?</h3>
            <p className="text-rose-100 text-sm font-bold leading-relaxed mb-6">
              আমাদের সংগঠন শুধু রক্তদান নয়, বরং দরিদ্রদের চিকিৎসা সহায়তা, শীতবস্ত্র বিতরণ এবং দুর্যোগকালীন ত্রাণের কাজও করে থাকে। আপনার অনুদান সরাসরি এই কাজগুলোতে ব্যয় হবে।
            </p>
            <div className="flex gap-4">
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5" fill="currentColor" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">সেবা</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                  <Info className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">স্বচ্ছতা</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">অনুদানের পরিমাণ (টাকা)</label>
              <div className="relative">
                <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  required
                  type="number" 
                  placeholder="পরিমাণ লিখুন..."
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border-2 border-slate-100 focus:border-rose-200 focus:ring-4 focus:ring-rose-500/5 outline-none transition-all font-bold text-slate-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">পেমেন্ট মেথড</label>
              <div className="grid grid-cols-2 gap-4">
                {['bkash', 'nagad'].map(method => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`flex items-center justify-center gap-3 py-4 rounded-2xl border-2 transition-all font-black uppercase tracking-widest text-xs ${
                      paymentMethod === method 
                        ? 'bg-slate-900 text-white border-slate-900 shadow-lg' 
                        : 'bg-white text-slate-500 border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" /> {method}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">পেমেন্ট করার নিয়ম</p>
              <p className="text-sm font-bold text-slate-700 leading-relaxed">
                ১. আমাদের পার্সোনাল নম্বরে (<span className="text-rose-500">০১৭০০০০০০০০</span>) টাকা সেন্ড মানি করুন।<br/>
                ২. ট্রানজেকশন আইডিটি নিচের বক্সে লিখুন।
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">ট্রানজেকশন আইডি (TrxID)</label>
              <input 
                required
                type="text" 
                placeholder="TrxID লিখুন..."
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-white border-2 border-slate-100 focus:border-rose-200 focus:ring-4 focus:ring-rose-500/5 outline-none transition-all font-bold text-slate-700"
              />
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl shadow-2xl shadow-slate-900/20 hover:bg-slate-800 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <>প্রসেসিং হচ্ছে...</>
              ) : (
                <>
                  <Send className="w-5 h-5" /> অনুদান নিশ্চিত করুন
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
