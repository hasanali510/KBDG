import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Droplet, MapPin, Clock, CheckCircle2, AlertCircle, Phone, Heart, XCircle, ChevronRight, MessageSquare, Share2, Facebook } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export default function Requests() {
  const { requests, currentUser, acceptRequest, completeRequest, cancelRequest } = useAppStore();
  const [filter, setFilter] = useState<'all' | 'my'>('all');
  const navigate = useNavigate();

  const handleShare = (req: any) => {
    const text = `জরুরী রক্তের প্রয়োজন! গ্রুপ: ${req.bloodGroup}, রোগী: ${req.patientName}, হাসপাতাল: ${req.hospitalName}, অবস্থান: ${req.location}. যোগাযোগ: ${currentUser?.phone || 'অ্যাপের মাধ্যমে'}. #BloodDonation #KhansamaBloodService`;
    const url = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: 'রক্তের অনুরোধ',
        text: text,
        url: url,
      }).catch(console.error);
    } else {
      // Fallback to WhatsApp
      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
    }
  };

  const filteredRequests = filter === 'all' 
    ? requests.filter(r => r.status !== 'cancelled')
    : requests.filter(r => r.requesterId === currentUser?.id || r.acceptedById === currentUser?.id);

  return (
    <div className="space-y-6 font-sans pb-20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800">রক্তের অনুরোধ</h2>
          <p className="text-sm text-slate-500 font-bold">কাউকে সাহায্য করে জীবন বাঁচান</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-[2rem] shadow-inner">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-3.5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${
            filter === 'all' ? 'bg-white text-rose-500 shadow-lg shadow-slate-200' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          সব অনুরোধ
        </button>
        <button
          onClick={() => setFilter('my')}
          className={`flex-1 py-3.5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${
            filter === 'my' ? 'bg-white text-rose-500 shadow-lg shadow-slate-200' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          আমার অনুরোধ
        </button>
      </div>

      {/* Requests List */}
      <div className="space-y-6">
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-12 text-center shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Heart className="w-10 h-10 text-rose-300" fill="currentColor" />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">বর্তমানে কোন অনুরোধ নেই</h3>
            <p className="text-sm text-slate-500 font-bold">জীবন বাঁচাতে পরে আবার চেক করুন</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredRequests.map(req => (
              <div key={req.id} className={`bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border transition-all hover:shadow-2xl relative overflow-hidden group ${
                req.isEmergency ? 'border-red-100' : 'border-slate-100'
              }`}>
                {req.isEmergency && (
                  <div className="absolute top-0 left-0 w-2 h-full bg-red-500"></div>
                )}
                
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl border-4 border-white shadow-lg ${
                      req.isEmergency ? 'bg-red-500 text-white' : 'bg-rose-500 text-white'
                    }`}>
                      {req.bloodGroup}
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800 text-xl leading-tight">{req.patientName}</h3>
                      <p className="text-[10px] text-slate-400 font-black flex items-center gap-1 mt-1 uppercase tracking-widest">
                        <Clock className="w-3 h-3" /> {formatDistanceToNow(new Date(req.createdAt))} আগে
                      </p>
                    </div>
                  </div>
                  
                  <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${
                    req.status === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                    req.status === 'accepted' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                    req.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                    'bg-slate-50 text-slate-400 border border-slate-100'
                  }`}>
                    {req.status === 'pending' ? 'অপেক্ষমান' : req.status === 'accepted' ? 'গৃহীত' : req.status === 'completed' ? 'সম্পন্ন' : 'বাতিল'}
                  </div>
                </div>

                <div className="space-y-4 mb-8 bg-slate-50/50 p-6 rounded-3xl border border-slate-100/50">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">হাসপাতাল ও অবস্থান</p>
                      <p className="text-sm font-bold text-slate-700">{req.hospitalName}, {req.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">সময় ও তারিখ</p>
                      <p className="text-sm font-bold text-slate-700">{new Date(req.dateTime).toLocaleString('bn-BD')}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                  {req.status === 'pending' && (
                    <button 
                      onClick={() => handleShare(req)}
                      className="w-full bg-slate-100 text-slate-700 font-black py-3 rounded-2xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2 active:scale-95 text-sm mb-1"
                    >
                      <Share2 className="w-4 h-4" /> শেয়ার করুন
                    </button>
                  )}

                  {req.status === 'pending' && req.requesterId !== currentUser?.id && (
                    <button 
                      onClick={() => currentUser && acceptRequest(req.id, currentUser.id)}
                      className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-slate-800 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <Droplet className="w-5 h-5" fill="currentColor" /> অনুরোধ গ্রহণ করুন
                    </button>
                  )}

                  {req.status === 'accepted' && (req.requesterId === currentUser?.id || req.acceptedById === currentUser?.id) && (
                    <button 
                      onClick={() => navigate(`/chat/${req.id}`)}
                      className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <MessageSquare className="w-5 h-5" /> চ্যাট করুন
                    </button>
                  )}

                  {req.status === 'accepted' && req.requesterId === currentUser?.id && (
                    <button 
                      onClick={() => completeRequest(req.id)}
                      className="w-full bg-emerald-500 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-emerald-600 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <CheckCircle2 className="w-5 h-5" /> সম্পন্ন হিসেবে চিহ্নিত করুন
                    </button>
                  )}
                  
                  {req.status === 'accepted' && req.acceptedById === currentUser?.id && (
                    <div className="space-y-3">
                      <div className="w-full bg-blue-50 text-blue-700 font-black py-4 rounded-2xl border border-blue-100 text-center flex items-center justify-center gap-2 text-sm">
                        <AlertCircle className="w-5 h-5" /> আপনি এই অনুরোধটি গ্রহণ করেছেন
                      </div>
                      <button 
                        onClick={() => completeRequest(req.id)}
                        className="w-full bg-emerald-500 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-emerald-600 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 active:scale-95"
                      >
                        <Droplet className="w-5 h-5" fill="currentColor" /> রক্তদান সম্পন্ন করেছেন?
                      </button>
                    </div>
                  )}

                  {req.status === 'pending' && req.requesterId === currentUser?.id && (
                    <button 
                      onClick={() => cancelRequest(req.id)}
                      className="w-full bg-white text-red-500 border-2 border-red-50 font-black py-4 rounded-2xl hover:bg-red-50 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <XCircle className="w-5 h-5" /> অনুরোধ বাতিল করুন
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
