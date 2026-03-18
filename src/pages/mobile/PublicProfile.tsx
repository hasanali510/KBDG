import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { ChevronLeft, MapPin, Droplet, Phone, Award, ShieldCheck, Calendar } from 'lucide-react';

export default function PublicProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { users } = useAppStore();
  
  const user = users.find(u => u.id === id);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <p className="text-slate-500 font-bold mb-4">ব্যবহারকারী খুঁজে পাওয়া যায়নি</p>
        <button onClick={() => navigate(-1)} className="bg-rose-500 text-white px-6 py-2 rounded-xl font-bold">
          ফিরে যান
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-rose-500 text-white px-4 py-4 sticky top-0 z-10 flex items-center gap-3 shadow-md">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-black">প্রোফাইল</h1>
      </div>

      <div className="p-4">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-rose-400 to-pink-500"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="relative">
              <img 
                src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=ffe4e6&color=e11d48`} 
                alt={user.name} 
                className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover bg-white"
              />
              {user.isVerified && (
                <div className="absolute bottom-0 right-0 bg-blue-500 text-white p-1.5 rounded-full border-2 border-white shadow-sm" title="Verified User">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              )}
            </div>
            
            <h2 className="text-2xl font-black text-slate-800 mt-4 flex items-center gap-2">
              {user.name}
            </h2>
            
            <div className="flex items-center gap-1.5 text-slate-500 font-medium mt-1">
              <MapPin className="w-4 h-4" />
              <span>{user.location}</span>
            </div>

            {user.bio && (
              <p className="text-center text-slate-600 mt-4 text-sm px-4 italic">
                "{user.bio}"
              </p>
            )}

            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {user.badges?.map((badge, idx) => (
                <span key={idx} className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-amber-200">
                  <Award className="w-3 h-3" /> {badge}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col items-center">
            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center text-rose-500 mb-3">
              <Droplet className="w-6 h-6" fill="currentColor" />
            </div>
            <span className="text-2xl font-black text-slate-800">{user.bloodGroup}</span>
            <span className="text-xs font-bold text-slate-400 mt-1">রক্তের গ্রুপ</span>
          </div>
          
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mb-3">
              <Award className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-slate-800">{user.donationsCount}</span>
            <span className="text-xs font-bold text-slate-400 mt-1">মোট রক্তদান</span>
          </div>
        </div>

        {/* Details */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 mt-4 space-y-4">
          <h3 className="font-black text-slate-800 border-b border-slate-100 pb-2">বিস্তারিত তথ্য</h3>
          
          {!user.hidePhone && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400">মোবাইল নম্বর</p>
                  <p className="font-bold text-slate-700">{user.phone}</p>
                </div>
              </div>
              <a href={`tel:${user.phone}`} className="bg-green-50 text-green-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-green-100 transition-colors">
                <Phone className="w-4 h-4" /> কল
              </a>
            </div>
          )}

          <div className="flex items-center gap-3 text-slate-600">
            <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400">সর্বশেষ রক্তদান</p>
              <p className="font-bold text-slate-700">
                {user.lastDonationDate ? new Date(user.lastDonationDate).toLocaleDateString('bn-BD') : 'এখনো রক্ত দেননি'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
