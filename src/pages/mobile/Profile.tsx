import { useAppStore } from '@/store/useAppStore';
import { LogOut, Settings, Edit3, Droplet, Calendar, Award, ShieldCheck, Heart, MapPin, ArrowRight, Activity, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { currentUser, logout, toggleDonorStatus, toggleAvailability, togglePhonePrivacy } = useAppStore();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-6 font-sans pb-20">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">প্রোফাইল</h2>
        <button className="p-2 bg-white rounded-full shadow-sm text-slate-500 hover:text-rose-500 transition-colors">
          <Settings className="w-6 h-6" />
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-rose-100 to-transparent rounded-bl-full opacity-50"></div>
        
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          <div className="relative">
            <img src={currentUser.avatar} alt="Profile" className="w-24 h-24 rounded-[2rem] object-cover border-4 border-white shadow-md" />
            <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-rose-500 rounded-2xl flex items-center justify-center text-white border-4 border-white shadow-sm hover:bg-rose-600 transition-colors">
              <Edit3 className="w-5 h-5" />
            </button>
          </div>
          <div className="text-center sm:text-left flex-1 min-w-0">
            <h3 className="text-2xl font-black text-slate-800 mb-1">{currentUser.name}</h3>
            <p className="text-sm text-slate-500 font-bold flex items-center justify-center sm:justify-start gap-1">
              <MapPin className="w-4 h-4 text-rose-500" /> {currentUser.location}
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-4">
              <span className="px-4 py-1.5 bg-rose-500 text-white rounded-xl text-xs font-black shadow-lg shadow-rose-500/20">
                {currentUser.bloodGroup}
              </span>
              {currentUser.role === 'admin' && (
                <span className="px-4 py-1.5 bg-indigo-500 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-500/20 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> অ্যাডমিন
                </span>
              )}
              {currentUser.isAvailable ? (
                <span className="px-4 py-1.5 bg-emerald-500 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-500/20 flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div> এভেইলেবল
                </span>
              ) : (
                <span className="px-4 py-1.5 bg-slate-400 text-white rounded-xl text-xs font-black flex items-center gap-1">
                  ব্যস্ত
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      {currentUser.badges.length > 0 && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" /> অর্জনসমূহ
          </h4>
          <div className="flex flex-wrap gap-3">
            {currentUser.badges.map((badge, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-2xl border border-amber-100 font-bold text-xs shadow-sm">
                <Award className="w-4 h-4" /> {badge}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mb-3 text-rose-500 shadow-inner">
            <Droplet className="w-7 h-7" fill="currentColor" />
          </div>
          <p className="text-3xl font-black text-slate-800">{currentUser.donationsCount}</p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">রক্তদান করেছেন</p>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-3 text-blue-500 shadow-inner">
            <Calendar className="w-7 h-7" />
          </div>
          <p className="text-lg font-black text-slate-800">
            {currentUser.lastDonationDate ? new Date(currentUser.lastDonationDate).toLocaleDateString('bn-BD') : 'নেই'}
          </p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">সর্বশেষ রক্তদান</p>
        </div>
      </div>

      {/* Settings List */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        
        {/* Donor Toggle */}
        <div className="p-6 flex items-center justify-between border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 shadow-sm">
              <Heart className="w-6 h-6" fill={currentUser.isDonor ? "currentColor" : "none"} />
            </div>
            <div>
              <p className="font-black text-slate-800">রক্তদাতার স্থিতি</p>
              <p className="text-xs text-slate-500 font-bold">আপনি কি রক্ত দিতে ইচ্ছুক?</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={currentUser.isDonor}
              onChange={toggleDonorStatus}
            />
            <div className="w-12 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
          </label>
        </div>

        {/* Availability Toggle */}
        <div className="p-6 flex items-center justify-between border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="font-black text-slate-800">এভেইলেবল স্ট্যাটাস</p>
              <p className="text-xs text-slate-500 font-bold">বর্তমানে রক্ত দিতে পারবেন?</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={currentUser.isAvailable}
              onChange={toggleAvailability}
            />
            <div className="w-12 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>

        {/* Privacy Toggle */}
        <div className="p-6 flex items-center justify-between border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="font-black text-slate-800">ফোন নম্বর গোপন রাখুন</p>
              <p className="text-xs text-slate-500 font-bold">আপনার নম্বর কি হাইড করবেন?</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={currentUser.hidePhone}
              onChange={togglePhonePrivacy}
            />
            <div className="w-12 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
          </label>
        </div>

        {/* Donation History Link */}
        <button 
          onClick={() => navigate('/donations')}
          className="w-full p-6 flex items-center justify-between border-b border-slate-50 hover:bg-rose-50/50 transition-colors text-left group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 shadow-sm group-hover:bg-rose-100 transition-colors">
              <Droplet className="w-6 h-6" />
            </div>
            <div>
              <p className="font-black text-slate-800">রক্তদানের ইতিহাস</p>
              <p className="text-xs text-slate-500 font-bold">আপনার মহৎ কাজের তালিকা দেখুন</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-rose-500 transition-colors" />
        </button>

        {/* Leaderboard Link */}
        <button 
          onClick={() => navigate('/leaderboard')}
          className="w-full p-6 flex items-center justify-between border-b border-slate-50 hover:bg-amber-50/50 transition-colors text-left group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 shadow-sm group-hover:bg-amber-100 transition-colors">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <p className="font-black text-slate-800">লিডারবোর্ড</p>
              <p className="text-xs text-slate-500 font-bold">সেরা রক্তদাতাদের তালিকা দেখুন</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-amber-500 transition-colors" />
        </button>

        {/* Admin Panel Link */}
        {currentUser.role === 'admin' && (
          <button 
            onClick={() => navigate('/admin/dashboard')}
            className="w-full p-6 flex items-center justify-between border-b border-slate-50 hover:bg-indigo-50/50 transition-colors text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 shadow-sm group-hover:bg-indigo-100 transition-colors">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="font-black text-slate-800">অ্যাডমিন ড্যাশবোর্ড</p>
                <p className="text-xs text-slate-500 font-bold">সিস্টেম পরিচালনা করুন</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
          </button>
        )}

        {/* Logout */}
        <button 
          onClick={handleLogout}
          className="w-full p-6 flex items-center justify-between hover:bg-red-50 transition-colors text-left group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 group-hover:bg-red-100 transition-colors">
              <LogOut className="w-6 h-6" />
            </div>
            <div>
              <p className="font-black text-red-600">লগ আউট</p>
              <p className="text-xs text-red-400 font-bold">অ্যাকাউন্ট থেকে বিদায় নিন</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
