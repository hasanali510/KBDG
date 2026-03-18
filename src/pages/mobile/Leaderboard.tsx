import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Award, Trophy, Medal, Star, ArrowUpRight, ChevronRight } from 'lucide-react';

export default function Leaderboard() {
  const { users } = useAppStore();

  // Sort users by donationsCount
  const topDonors = [...users]
    .filter(u => u.isDonor)
    .sort((a, b) => b.donationsCount - a.donationsCount)
    .slice(0, 10);

  return (
    <div className="space-y-8 font-sans pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-800">লিডারবোর্ড</h2>
          <p className="text-sm text-slate-500 font-bold">সেরা রক্তদাতাদের তালিকা</p>
        </div>
        <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-200/50">
          <Trophy className="w-8 h-8 text-amber-500" />
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="flex items-end justify-center gap-4 pt-10 pb-6">
        {/* 2nd Place */}
        {topDonors[1] && (
          <div className="flex flex-col items-center">
            <div className="relative mb-3">
              <img src={topDonors[1].avatar} alt={topDonors[1].name} className="w-16 h-16 rounded-2xl border-4 border-slate-200 shadow-lg object-cover" />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-300 rounded-xl flex items-center justify-center text-white font-black border-2 border-white shadow-sm">
                2
              </div>
            </div>
            <div className="h-24 w-20 bg-slate-100 rounded-t-2xl flex flex-col items-center justify-center p-2 border-x border-t border-slate-200">
              <p className="text-[10px] font-black text-slate-800 truncate w-full text-center">{topDonors[1].name.split(' ')[0]}</p>
              <p className="text-xs font-black text-slate-500">{topDonors[1].donationsCount}</p>
            </div>
          </div>
        )}

        {/* 1st Place */}
        {topDonors[0] && (
          <div className="flex flex-col items-center">
            <div className="relative mb-4 scale-110">
              <img src={topDonors[0].avatar} alt={topDonors[0].name} className="w-20 h-20 rounded-[2rem] border-4 border-amber-400 shadow-xl object-cover" />
              <div className="absolute -top-3 -right-3 w-10 h-10 bg-amber-400 rounded-2xl flex items-center justify-center text-white font-black border-4 border-white shadow-md">
                1
              </div>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                <Trophy className="w-8 h-8 text-amber-500 animate-bounce" />
              </div>
            </div>
            <div className="h-32 w-24 bg-gradient-to-b from-amber-50 to-white rounded-t-3xl flex flex-col items-center justify-center p-2 border-x border-t border-amber-200 shadow-lg">
              <p className="text-xs font-black text-slate-800 truncate w-full text-center">{topDonors[0].name.split(' ')[0]}</p>
              <p className="text-sm font-black text-amber-600">{topDonors[0].donationsCount}</p>
              <div className="flex gap-1 mt-1">
                <Star className="w-3 h-3 text-amber-400" fill="currentColor" />
                <Star className="w-3 h-3 text-amber-400" fill="currentColor" />
                <Star className="w-3 h-3 text-amber-400" fill="currentColor" />
              </div>
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {topDonors[2] && (
          <div className="flex flex-col items-center">
            <div className="relative mb-3">
              <img src={topDonors[2].avatar} alt={topDonors[2].name} className="w-16 h-16 rounded-2xl border-4 border-amber-700/20 shadow-lg object-cover" />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-700/40 rounded-xl flex items-center justify-center text-white font-black border-2 border-white shadow-sm">
                3
              </div>
            </div>
            <div className="h-20 w-20 bg-amber-50/30 rounded-t-2xl flex flex-col items-center justify-center p-2 border-x border-t border-amber-100">
              <p className="text-[10px] font-black text-slate-800 truncate w-full text-center">{topDonors[2].name.split(' ')[0]}</p>
              <p className="text-xs font-black text-amber-800/60">{topDonors[2].donationsCount}</p>
            </div>
          </div>
        )}
      </div>

      {/* Rest of the List */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/50">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">শীর্ষ ১০ রক্তদাতা</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {topDonors.slice(3).map((donor, index) => (
            <div key={donor.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors group">
              <div className="flex items-center gap-4">
                <span className="w-6 text-center font-black text-slate-300 group-hover:text-rose-500 transition-colors">{index + 4}</span>
                <img src={donor.avatar} alt={donor.name} className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-sm" />
                <div>
                  <p className="font-black text-slate-800 text-sm">{donor.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold">{donor.location.split(',')[0]}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-black text-rose-500">{donor.donationsCount}</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-tight">রক্তদান</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-rose-500 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Motivation Card */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-900/40 relative overflow-hidden group">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
        <div className="relative z-10">
          <h3 className="text-xl font-black mb-2">আপনিও হতে পারেন হিরো!</h3>
          <p className="text-slate-400 text-sm font-bold mb-6">রক্তদান করুন এবং লিডারবোর্ডে নিজের জায়গা করে নিন। আপনার এক ব্যাগ রক্ত বাঁচাতে পারে একটি প্রাণ।</p>
          <button className="flex items-center gap-2 text-rose-500 font-black text-sm group-hover:translate-x-2 transition-transform">
            রক্তদানের নিয়মাবলী দেখুন <ArrowUpRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
