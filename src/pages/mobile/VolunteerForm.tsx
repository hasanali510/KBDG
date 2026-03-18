import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { UserCheck, Send, AlertCircle, Heart } from 'lucide-react';

export default function VolunteerForm() {
  const { currentUser, applyAsVolunteer } = useAppStore();
  const navigate = useNavigate();
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    applyAsVolunteer({
      userId: currentUser.id,
      name: currentUser.name,
      phone: currentUser.phone,
      reason
    });
    
    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <UserCheck className="w-12 h-12 text-emerald-600" />
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-4">আবেদন সফল হয়েছে!</h2>
        <p className="text-slate-500 font-bold max-w-xs mx-auto mb-8">
          আপনার সেচ্ছাসেবী হওয়ার আবেদনটি আমরা পেয়েছি। আমাদের টিম আপনার সাথে শীঘ্রই যোগাযোগ করবে।
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
        <h2 className="text-3xl font-black text-slate-800">সেচ্ছাসেবী আবেদন</h2>
        <p className="text-sm text-slate-500 font-bold mt-1">আমাদের সংগঠনের সাথে যুক্ত হয়ে মানুষের সেবা করুন</p>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40 border border-slate-100">
        <div className="flex items-center gap-4 mb-8 p-4 bg-rose-50 rounded-3xl border border-rose-100">
          <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-rose-200">
            <Heart className="w-6 h-6 text-white" fill="currentColor" />
          </div>
          <p className="text-xs font-bold text-rose-700 leading-relaxed">
            সেচ্ছাসেবী হিসেবে আপনি রক্তদান ক্যাম্পেইন পরিচালনা, দাতা সংগ্রহ এবং জরুরি মুহূর্তে রোগীদের সহায়তা করতে পারবেন।
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">আপনার নাম</label>
            <input 
              type="text" 
              value={currentUser?.name} 
              disabled
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 font-bold text-slate-500 cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">মোবাইল নম্বর</label>
            <input 
              type="text" 
              value={currentUser?.phone} 
              disabled
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 font-bold text-slate-500 cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">কেন সেচ্ছাসেবী হতে চান?</label>
            <textarea 
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="আপনার আগ্রহ এবং অভিজ্ঞতা সম্পর্কে সংক্ষেপে লিখুন..."
              className="w-full px-6 py-4 rounded-2xl bg-white border-2 border-slate-100 focus:border-rose-200 focus:ring-4 focus:ring-rose-500/5 outline-none transition-all font-bold text-slate-700 min-h-[150px] resize-none"
            />
          </div>

          <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[10px] font-bold text-amber-700 leading-relaxed">
              আবেদন করার মাধ্যমে আপনি আমাদের সংগঠনের নিয়মাবলী মেনে চলার অঙ্গীকার করছেন।
            </p>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl shadow-2xl shadow-slate-900/20 hover:bg-slate-800 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
          >
            {isSubmitting ? (
              <>আবেদন পাঠানো হচ্ছে...</>
            ) : (
              <>
                <Send className="w-5 h-5" /> আবেদন জমা দিন
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
