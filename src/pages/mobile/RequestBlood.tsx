import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Droplet, MapPin, Calendar, Phone, User, AlertTriangle, Clock, Hospital, ChevronRight } from 'lucide-react';

export default function RequestBlood() {
  const { currentUser, addRequest } = useAppStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    patientName: '',
    bloodGroup: 'A+',
    hospitalName: '',
    location: '',
    dateTime: '',
    contactNumber: '',
    isEmergency: false,
  });

  useEffect(() => {
    if (searchParams.get('emergency') === 'true') {
      setFormData(prev => ({ ...prev, isEmergency: true }));
    }
  }, [searchParams]);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    addRequest({
      requesterId: currentUser.id,
      ...formData,
    });
    
    navigate('/requests');
  };

  return (
    <div className="space-y-8 font-sans pb-20">
      <div className="flex items-center gap-5">
        <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center text-white shadow-xl transition-all duration-500 ${
          formData.isEmergency 
            ? 'bg-red-500 shadow-red-500/30 animate-pulse' 
            : 'bg-rose-500 shadow-rose-500/30'
        }`}>
          <Droplet className="w-8 h-8" fill="currentColor" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-800">রক্তের অনুরোধ</h2>
          <p className="text-sm text-slate-500 font-bold">বিস্তারিত তথ্য দিয়ে সাহায্য চান</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Emergency Toggle Card */}
        <div className={`p-6 rounded-[2.5rem] border-2 transition-all duration-500 flex items-center justify-between ${
          formData.isEmergency 
            ? 'bg-red-50 border-red-200 shadow-lg shadow-red-500/10' 
            : 'bg-white border-slate-100 shadow-xl shadow-slate-200/40'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
              formData.isEmergency ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-400'
            }`}>
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <p className={`font-black text-lg ${formData.isEmergency ? 'text-red-700' : 'text-slate-800'}`}>জরুরী অনুরোধ</p>
              <p className={`text-xs font-bold ${formData.isEmergency ? 'text-red-500' : 'text-slate-400'}`}>দাতাদের অবিলম্বে জানান</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={formData.isEmergency}
              onChange={e => setFormData({...formData, isEmergency: e.target.checked})}
            />
            <div className="w-14 h-8 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-500"></div>
          </label>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 space-y-8">
          {/* Blood Group Selection */}
          <div className="space-y-4">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">রক্তের গ্রুপ নির্বাচন করুন</label>
            <div className="grid grid-cols-4 gap-3">
              {bloodGroups.map(bg => (
                <button
                  key={bg}
                  type="button"
                  onClick={() => setFormData({ ...formData, bloodGroup: bg })}
                  className={`py-4 rounded-2xl font-black text-sm transition-all border-2 ${
                    formData.bloodGroup === bg 
                      ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/20' 
                      : 'bg-slate-50 border-slate-50 text-slate-600 hover:border-rose-200'
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Patient Name */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">রোগীর নাম</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  required
                  value={formData.patientName}
                  onChange={e => setFormData({...formData, patientName: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-slate-50 focus:border-rose-200 focus:bg-white outline-none transition-all font-bold text-slate-700"
                  placeholder="রোগীর নাম লিখুন"
                />
              </div>
            </div>

            {/* Hospital Name */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">হাসপাতালের নাম</label>
              <div className="relative">
                <Hospital className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  required
                  value={formData.hospitalName}
                  onChange={e => setFormData({...formData, hospitalName: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-slate-50 focus:border-rose-200 focus:bg-white outline-none transition-all font-bold text-slate-700"
                  placeholder="হাসপাতালের নাম লিখুন"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">অবস্থান/শহর</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  required
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-slate-50 focus:border-rose-200 focus:bg-white outline-none transition-all font-bold text-slate-700"
                  placeholder="শহর বা এলাকা লিখুন"
                />
              </div>
            </div>

            {/* Contact Number */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">যোগাযোগের নম্বর</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="tel" 
                  required
                  value={formData.contactNumber}
                  onChange={e => setFormData({...formData, contactNumber: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-slate-50 focus:border-rose-200 focus:bg-white outline-none transition-all font-bold text-slate-700"
                  placeholder="ফোন নম্বর লিখুন"
                />
              </div>
            </div>

            {/* Date & Time */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">প্রয়োজনীয় তারিখ ও সময়</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="datetime-local" 
                  required
                  value={formData.dateTime}
                  onChange={e => setFormData({...formData, dateTime: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-slate-50 focus:border-rose-200 focus:bg-white outline-none transition-all font-bold text-slate-700"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className={`w-full text-white font-black py-5 rounded-[2rem] shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 ${
              formData.isEmergency 
                ? 'bg-red-500 shadow-red-500/30 hover:bg-red-600' 
                : 'bg-slate-900 shadow-slate-900/20 hover:bg-slate-800'
            }`}
          >
            অনুরোধ জমা দিন <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </form>
    </div>
  );
}
