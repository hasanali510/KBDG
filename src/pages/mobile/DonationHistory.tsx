import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Droplet, Calendar, MapPin, CheckCircle2, Clock, ChevronLeft, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { bn } from 'date-fns/locale';

export default function DonationHistory() {
  const { currentUser, donations } = useAppStore();
  const navigate = useNavigate();

  const userDonations = donations.filter(d => d.donorId === currentUser?.id);

  return (
    <div className="space-y-8 font-sans pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 active:scale-90 transition-all">
          <ChevronLeft className="w-6 h-6 text-slate-600" />
        </button>
        <div>
          <h2 className="text-2xl font-black text-slate-800">রক্তদানের ইতিহাস</h2>
          <p className="text-xs text-slate-500 font-bold">আপনার মহৎ কাজের তালিকা</p>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-rose-500/30 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-rose-100 text-xs font-black uppercase tracking-widest mb-1">মোট রক্তদান</p>
            <h3 className="text-5xl font-black">{userDonations.length} বার</h3>
          </div>
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-[2rem] flex items-center justify-center">
            <Award className="w-10 h-10 text-white" />
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-white/10 flex gap-6">
          <div>
            <p className="text-[10px] text-rose-100 font-bold uppercase">শেষ রক্তদান</p>
            <p className="text-sm font-black">
              {currentUser?.lastDonationDate 
                ? format(new Date(currentUser.lastDonationDate), 'dd MMMM, yyyy', { locale: bn })
                : 'এখনো রক্তদান করেননি'}
            </p>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-4">
        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
          <Clock className="w-5 h-5 text-rose-500" /> সাম্প্রতিক রক্তদান
        </h3>
        
        {userDonations.length > 0 ? (
          <div className="space-y-4">
            {userDonations.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((donation) => (
              <div key={donation.id} className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/40 border border-slate-100 relative overflow-hidden group">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-rose-50 rounded-2xl flex flex-col items-center justify-center border border-rose-100 group-hover:scale-110 transition-transform">
                    <span className="text-rose-600 font-black text-xl leading-none">{donation.bloodGroup}</span>
                    <Droplet className="w-4 h-4 text-rose-500 mt-1" fill="currentColor" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-black text-slate-800 text-lg">{donation.patientName}</h4>
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${
                        donation.status === 'verified' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {donation.status === 'verified' ? 'ভেরিফাইড' : 'পেন্ডিং'}
                      </span>
                    </div>
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-slate-500 font-bold flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" /> {donation.location}
                      </p>
                      <p className="text-xs text-slate-400 font-bold flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" /> {format(new Date(donation.date), 'dd MMMM, yyyy', { locale: bn })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 rounded-[2rem] p-12 text-center border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Droplet className="w-10 h-10 text-slate-300" />
            </div>
            <p className="text-slate-500 font-black">আপনি এখনো রক্তদান করেননি</p>
            <p className="text-xs text-slate-400 font-bold mt-1">রক্তদান করুন এবং একটি জীবন বাঁচান!</p>
            <button 
              onClick={() => navigate('/requests')}
              className="mt-6 bg-rose-500 text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-rose-500/20 active:scale-95 transition-all"
            >
              অনুরোধ দেখুন
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
