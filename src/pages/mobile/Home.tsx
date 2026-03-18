import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Droplet, Heart, Activity, AlertCircle, MapPin, Clock, ChevronRight, Search, Phone, Zap, Users, Award, Trophy, Moon, Sun, BookOpen, UserPlus, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

export default function Home() {
  const { currentUser, requests, users, theme, toggleTheme } = useAppStore();
  const navigate = useNavigate();

  const emergencyRequests = requests.filter(r => r.isEmergency && r.status === 'pending');
  const recentRequests = requests.filter(r => !r.isEmergency && r.status === 'pending').slice(0, 3);
  
  // Mock nearby donors (excluding current user)
  const nearbyDonors = users
    .filter(u => u.id !== currentUser?.id && u.isDonor && u.isAvailable)
    .slice(0, 4);

  const totalDonors = users.filter(u => u.isDonor).length;
  const totalRequests = requests.length;
  const livesSaved = requests.filter(r => r.status === 'completed').length * 3;

  return (
    <div className="space-y-8 font-sans pb-20">
      {/* Welcome Section */}
      <div className="flex justify-between items-center">
        <div className="animate-in fade-in slide-in-from-left duration-700">
          <h2 className="text-3xl font-black text-slate-800 leading-tight">হ্যালো, <span className="text-rose-500">{currentUser?.name.split(' ')[0]}!</span></h2>
          <p className="text-sm text-slate-500 font-bold mt-1">আজ কি একটি জীবন বাঁচাতে প্রস্তুত?</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleTheme}
            className="p-3 bg-white rounded-2xl shadow-lg shadow-slate-100 hover:scale-105 transition-transform text-slate-600"
          >
            {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
          </button>
          <div className="relative group cursor-pointer" onClick={() => navigate('/profile')}>
            <img src={currentUser?.avatar} alt="Profile" className="w-14 h-14 rounded-2xl border-4 border-white shadow-xl shadow-rose-100 group-hover:scale-105 transition-transform" />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Emergency Quick Action */}
      <div className="bg-rose-500 rounded-[2.5rem] p-6 text-white shadow-2xl shadow-rose-500/40 relative overflow-hidden group">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
              <Zap className="w-7 h-7 text-white animate-pulse" fill="currentColor" />
            </div>
            <div>
              <h3 className="text-xl font-black">জরুরী রক্ত প্রয়োজন?</h3>
              <p className="text-rose-100 text-xs font-bold">এক ক্লিকেই সাহায্য চান</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/request?emergency=true')}
            className="w-full bg-white text-rose-500 font-black py-4 rounded-2xl shadow-xl hover:bg-rose-50 transition-colors flex items-center justify-center gap-2 active:scale-95"
          >
            <AlertCircle className="w-5 h-5" /> ইমারজেন্সি রিকোয়েস্ট
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard icon={<Users className="w-5 h-5" />} value={totalDonors} label="দাতা" color="text-blue-500" bg="bg-blue-50" />
        <StatCard icon={<Droplet className="w-5 h-5" />} value={totalRequests} label="অনুরোধ" color="text-rose-500" bg="bg-rose-50" />
        <StatCard icon={<Award className="w-5 h-5" />} value={livesSaved} label="জীবন" color="text-emerald-500" bg="bg-emerald-50" />
      </div>

      {/* Emergency Alert List */}
      {emergencyRequests.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
            <h3 className="text-lg font-black text-slate-800">লাইভ ইমারজেন্সি</h3>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4">
            {emergencyRequests.map(req => (
              <div key={req.id} className="min-w-[280px] bg-white rounded-3xl p-5 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 px-4 py-1 bg-red-500 text-white text-[10px] font-black rounded-bl-2xl">EMERGENCY</div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center border border-red-100">
                    <span className="font-black text-red-600 text-xl">{req.bloodGroup}</span>
                  </div>
                  <div>
                    <p className="font-black text-slate-800">{req.patientName}</p>
                    <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {formatDistanceToNow(new Date(req.createdAt))} আগে
                    </p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-xs text-slate-500 font-bold flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-500" /> {req.hospitalName}
                  </p>
                </div>
                <button 
                  onClick={() => navigate('/requests')}
                  className="w-full bg-slate-900 text-white font-black py-3 rounded-xl text-sm hover:bg-slate-800 transition-colors"
                >
                  সাহায্য করুন
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Nearby Donors */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-black text-slate-800">আশেপাশের রক্তদাতা</h3>
          <button onClick={() => navigate('/search')} className="text-sm font-black text-rose-500 flex items-center gap-1">
            সব দেখুন <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {nearbyDonors.map(donor => (
            <div key={donor.id} className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center group hover:shadow-md transition-all">
              <div className="relative mb-3">
                <img src={donor.avatar} alt={donor.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-rose-500 rounded-xl flex items-center justify-center text-white text-xs font-black border-2 border-white shadow-sm">
                  {donor.bloodGroup}
                </div>
              </div>
              <p className="font-black text-slate-800 text-sm truncate w-full">{donor.name}</p>
              <p className="text-[10px] text-slate-400 font-bold mb-3 truncate w-full">{donor.location.split(',')[0]}</p>
              <button className="w-full bg-slate-50 text-slate-600 font-black py-2 rounded-xl text-[10px] hover:bg-rose-50 hover:text-rose-500 transition-colors flex items-center justify-center gap-1">
                <Phone className="w-3 h-3" /> কল করুন
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-black text-slate-800 mb-4">অন্যান্য সেবা</h3>
        <div className="grid grid-cols-2 gap-4">
          <ActionBtn icon={<Search className="text-blue-500" />} label="দাতা খুঁজুন" bg="bg-blue-50" onClick={() => navigate('/search')} />
          <ActionBtn icon={<Droplet className="text-rose-500" fill="currentColor" />} label="রক্ত দিন" bg="bg-rose-50" onClick={() => navigate('/requests')} />
          <ActionBtn icon={<Trophy className="text-amber-500" />} label="লিডারবোর্ড" bg="bg-amber-50" onClick={() => navigate('/leaderboard')} />
          <ActionBtn icon={<BookOpen className="text-emerald-500" />} label="নির্দেশিকা" bg="bg-emerald-50" onClick={() => navigate('/guide')} />
          <ActionBtn icon={<UserPlus className="text-indigo-500" />} label="সেচ্ছাসেবী" bg="bg-indigo-50" onClick={() => navigate('/volunteer')} />
          <ActionBtn icon={<Wallet className="text-rose-600" />} label="তহবিল" bg="bg-rose-50" onClick={() => navigate('/donate-fund')} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, value, label, color, bg }: { icon: React.ReactNode, value: number, label: string, color: string, bg: string }) {
  return (
    <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex flex-col items-center text-center">
      <div className={`w-10 h-10 ${bg} ${color} rounded-xl flex items-center justify-center mb-2 shadow-inner`}>
        {icon}
      </div>
      <p className="text-xl font-black text-slate-800">{value}</p>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    </div>
  );
}

function ActionBtn({ icon, label, bg, onClick }: { icon: React.ReactNode, label: string, bg: string, onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center justify-center gap-2 p-5 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all active:scale-95 group">
      <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center mb-1 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight">{label}</span>
    </button>
  );
}
