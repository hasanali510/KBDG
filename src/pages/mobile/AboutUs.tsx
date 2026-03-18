import React from 'react';
import { Heart, Users, Activity, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="space-y-8 font-sans pb-20">
      <div className="animate-in fade-in slide-in-from-top duration-700">
        <h2 className="text-3xl font-black text-slate-800">আমাদের সম্পর্কে</h2>
        <p className="text-sm text-slate-500 font-bold mt-1">খানসামা ব্লাড ডোনার্স ক্লাব</p>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40 border border-slate-100 animate-in fade-in slide-in-from-bottom">
        <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-500 mb-6">
          <Heart className="w-8 h-8" fill="currentColor" />
        </div>
        <h3 className="text-2xl font-black text-slate-800 mb-4">আমাদের গল্প</h3>
        <p className="text-slate-500 font-medium leading-relaxed">
          খানসামা ব্লাড ডোনার্স ক্লাব একটি অলাভজনক সেচ্ছাসেবী সংগঠন। আমাদের প্রধান লক্ষ্য হলো জরুরি মুহূর্তে রক্তের অভাবে যেন কোনো রোগীর প্রাণহানি না ঘটে তা নিশ্চিত করা। আমরা বিশ্বাস করি, এক ফোঁটা রক্ত একটি জীবন বাঁচাতে পারে।
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-[2.5rem] p-6 text-white shadow-lg shadow-rose-500/20 animate-in fade-in slide-in-from-left delay-100">
          <Users className="w-8 h-8 mb-4 opacity-80" />
          <h4 className="text-xl font-black mb-2">৫০০০+</h4>
          <p className="text-rose-100 font-bold text-sm">নিবন্ধিত রক্তদাতা</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-[2.5rem] p-6 text-white shadow-lg shadow-emerald-500/20 animate-in fade-in slide-in-from-right delay-200">
          <Activity className="w-8 h-8 mb-4 opacity-80" />
          <h4 className="text-xl font-black mb-2">১০০০০+</h4>
          <p className="text-emerald-100 font-bold text-sm">সফল রক্তদান</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40 border border-slate-100 animate-in fade-in slide-in-from-bottom delay-300">
        <h3 className="text-xl font-black text-slate-800 mb-6">যোগাযোগ করুন</h3>
        
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">ফোন</p>
              <p className="font-bold text-slate-700">+880 1700-000000</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">ইমেইল</p>
              <p className="font-bold text-slate-700">info@khansamablood.org</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">ঠিকানা</p>
              <p className="font-bold text-slate-700">খানসামা, দিনাজপুর, বাংলাদেশ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
