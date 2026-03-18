import React from 'react';
import { Users, Award, Heart, Shield, Star, CheckCircle2 } from 'lucide-react';

export default function Committee() {
  const committeeMembers = [
    {
      id: 1,
      name: 'জনি আহমেদ',
      role: 'সভাপতি',
      image: 'https://i.pravatar.cc/150?u=1',
      phone: '০১৭০০০০০০০০',
      bloodGroup: 'O+'
    },
    {
      id: 2,
      name: 'রহিম শেখ',
      role: 'সাধারণ সম্পাদক',
      image: 'https://i.pravatar.cc/150?u=2',
      phone: '০১৮০০০০০০০০',
      bloodGroup: 'A+'
    },
    {
      id: 3,
      name: 'করিম খান',
      role: 'সাংগঠনিক সম্পাদক',
      image: 'https://i.pravatar.cc/150?u=3',
      phone: '০১৯০০০০০০০০',
      bloodGroup: 'B+'
    },
    {
      id: 4,
      name: 'আব্দুর রহমান',
      role: 'কোষাধ্যক্ষ',
      image: 'https://i.pravatar.cc/150?u=4',
      phone: '০১৫০০০০০০০০',
      bloodGroup: 'AB+'
    }
  ];

  return (
    <div className="space-y-8 font-sans pb-20">
      <div className="animate-in fade-in slide-in-from-top duration-700">
        <h2 className="text-3xl font-black text-slate-800">কার্য নির্বাহী কমিটি</h2>
        <p className="text-sm text-slate-500 font-bold mt-1">আমাদের সংগঠনের নিবেদিত প্রাণ সদস্যবৃন্দ</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {committeeMembers.map((member, index) => (
          <div 
            key={member.id} 
            className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/40 border border-slate-100 flex items-center gap-6 animate-in fade-in slide-in-from-bottom"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="relative shrink-0">
              <img src={member.image} alt={member.name} className="w-24 h-24 rounded-3xl object-cover border-4 border-slate-50 shadow-lg" />
              <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-rose-500 text-white rounded-xl flex items-center justify-center font-black text-sm border-4 border-white shadow-md">
                {member.bloodGroup}
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-black text-slate-800">{member.name}</h3>
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-sm font-bold text-rose-500 mb-3">{member.role}</p>
              
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-2 rounded-xl w-max">
                <Shield className="w-3 h-3 text-slate-400" />
                {member.phone}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-900/20 mt-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
            <Award className="w-8 h-8 text-amber-400" />
          </div>
          <h3 className="text-2xl font-black mb-4">আমাদের লক্ষ্য</h3>
          <p className="text-slate-300 font-medium leading-relaxed max-w-md">
            রক্তের অভাবে যেন একটি প্রাণও ঝরে না যায়, সেই লক্ষ্যে আমরা নিরলসভাবে কাজ করে যাচ্ছি। আমাদের সাথে যুক্ত হয়ে আপনিও হতে পারেন এই মহৎ কাজের অংশীদার।
          </p>
        </div>
      </div>
    </div>
  );
}
