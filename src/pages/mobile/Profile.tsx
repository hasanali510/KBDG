import React, { useState, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { LogOut, Settings, Edit3, Droplet, Calendar, Award, ShieldCheck, Heart, MapPin, ArrowRight, Activity, Trophy, Camera, Check, FileText, Download, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function Profile() {
  const { currentUser, logout, toggleDonorStatus, toggleAvailability, togglePhonePrivacy, updateUser } = useAppStore();
  const navigate = useNavigate();
  
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState(currentUser?.bio || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const idCardRef = useRef<HTMLDivElement>(null);

  if (!currentUser) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUser(currentUser.id, { avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const saveBio = () => {
    updateUser(currentUser.id, { bio: bioText });
    setIsEditingBio(false);
  };

  const requestIDCard = () => {
    updateUser(currentUser.id, { idCardStatus: 'pending' });
  };

  const downloadIDCard = async () => {
    if (!idCardRef.current) return;
    try {
      const canvas = await html2canvas(idCardRef.current, { scale: 3, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [54, 86] // Standard ID card size
      });
      pdf.addImage(imgData, 'PNG', 0, 0, 54, 86);
      pdf.save(`ID_Card_${currentUser.name}.pdf`);
    } catch (error) {
      console.error('Error generating PDF', error);
    }
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
            <img src={currentUser.avatar} alt="Profile" className="w-24 h-24 rounded-[2rem] object-cover border-4 border-white shadow-md bg-white" />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 w-10 h-10 bg-rose-500 rounded-2xl flex items-center justify-center text-white border-4 border-white shadow-sm hover:bg-rose-600 transition-colors"
            >
              <Camera className="w-5 h-5" />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handlePhotoUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
          <div className="text-center sm:text-left flex-1 min-w-0 w-full">
            <h3 className="text-2xl font-black text-slate-800 mb-1">{currentUser.name}</h3>
            <p className="text-sm text-slate-500 font-bold flex items-center justify-center sm:justify-start gap-1">
              <MapPin className="w-4 h-4 text-rose-500" /> {currentUser.location}
            </p>
            
            {/* Bio Section */}
            <div className="mt-4 w-full">
              {isEditingBio ? (
                <div className="flex flex-col gap-2">
                  <textarea 
                    value={bioText}
                    onChange={(e) => setBioText(e.target.value)}
                    placeholder="আপনার সম্পর্কে কিছু লিখুন..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-700 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 resize-none"
                    rows={3}
                  />
                  <div className="flex gap-2 justify-end">
                    <button 
                      onClick={() => setIsEditingBio(false)}
                      className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={saveBio}
                      className="p-2 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="group relative">
                  <p className="text-sm text-slate-600 italic px-2 border-l-2 border-rose-200">
                    {currentUser.bio ? `"${currentUser.bio}"` : "কোনো বায়ো যুক্ত করা হয়নি।"}
                  </p>
                  <button 
                    onClick={() => setIsEditingBio(true)}
                    className="absolute -top-2 -right-2 p-1.5 bg-slate-100 text-slate-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-50 hover:text-rose-500"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

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

      {/* ID Card Section */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-800">ভার্চুয়াল আইডি কার্ড</h3>
              <p className="text-xs text-slate-500 font-bold">আপনার রক্তদাতা পরিচয়পত্র</p>
            </div>
          </div>
        </div>

        {!currentUser.idCardStatus || currentUser.idCardStatus === 'none' ? (
          <button 
            onClick={requestIDCard}
            className="w-full bg-rose-500 text-white font-black py-3 rounded-2xl shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-colors"
          >
            আইডি কার্ডের জন্য আবেদন করুন
          </button>
        ) : currentUser.idCardStatus === 'pending' ? (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-2xl text-center font-bold text-sm">
            আপনার আবেদনটি অনুমোদনের অপেক্ষায় আছে।
          </div>
        ) : currentUser.idCardStatus === 'rejected' ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-center font-bold text-sm">
            আপনার আবেদনটি বাতিল করা হয়েছে।
          </div>
        ) : (
          <div className="space-y-4">
            {/* The ID Card */}
            <div className="flex justify-center overflow-hidden py-4">
              <div 
                ref={idCardRef}
                className="w-[216px] h-[344px] bg-white rounded-xl shadow-lg relative overflow-hidden border border-slate-200"
                style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}
              >
                {/* Header */}
                <div className="bg-rose-600 text-white text-center py-3 px-2">
                  <h4 className="font-black text-sm">রক্তদাতা পরিচয়পত্র</h4>
                  <p className="text-[8px] opacity-90">জীবন রক্ষাকারী রক্তদাতা</p>
                </div>
                
                {/* Photo */}
                <div className="flex justify-center mt-4">
                  <img src={currentUser.avatar} alt="Profile" className="w-20 h-20 rounded-full border-4 border-rose-100 object-cover bg-white" />
                </div>
                
                {/* Info */}
                <div className="text-center px-4 mt-3">
                  <h5 className="font-black text-slate-800 text-sm truncate">{currentUser.name}</h5>
                  <p className="text-[10px] text-slate-500 font-bold mt-0.5">{currentUser.phone}</p>
                  
                  <div className="mt-4 inline-block bg-rose-100 text-rose-600 font-black text-xl px-4 py-1 rounded-lg border border-rose-200">
                    {currentUser.bloodGroup}
                  </div>
                  
                  <div className="mt-4 text-left">
                    <p className="text-[8px] text-slate-400 font-bold uppercase">ঠিকানা</p>
                    <p className="text-[10px] text-slate-700 font-bold truncate">{currentUser.location}</p>
                  </div>
                </div>
                
                {/* Footer */}
                <div className="absolute bottom-0 w-full bg-slate-800 text-white text-center py-2">
                  <p className="text-[8px] font-bold">ID: BD-{currentUser.id.slice(0, 6).toUpperCase()}</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={downloadIDCard}
              className="w-full bg-slate-800 text-white font-black py-3 rounded-2xl shadow-lg hover:bg-slate-900 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" /> পিডিএফ ডাউনলোড করুন
            </button>
          </div>
        )}
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
