import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Search, Filter, MoreVertical, CheckCircle2, XCircle, Clock, AlertTriangle, MapPin, Phone, Calendar, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { bn } from 'date-fns/locale';

export default function AdminRequests() {
  const { requests, updateRequestStatus, cancelRequest } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'accepted' | 'completed' | 'cancelled'>('all');

  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         req.hospitalName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (id: string, status: 'pending' | 'accepted' | 'completed') => {
    updateRequestStatus(id, status);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('আপনি কি নিশ্চিত যে আপনি এই অনুরোধটি ডিলিট করতে চান?')) {
      cancelRequest(id);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-800">রক্তের অনুরোধ</h2>
          <p className="text-sm text-slate-500 font-bold">সব অনুরোধ পরিচালনা এবং পর্যবেক্ষণ করুন</p>
        </div>
        <button className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black shadow-xl shadow-slate-900/20 hover:shadow-slate-900/40 hover:-translate-y-0.5 transition-all active:scale-95">
          নতুন অনুরোধ যোগ করুন
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-8 border-b border-slate-100 flex flex-col lg:flex-row gap-6 justify-between items-center bg-slate-50/30">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="রোগীর নাম বা হাসপাতাল দিয়ে খুঁজুন..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border-2 border-slate-100 focus:border-rose-200 focus:ring-4 focus:ring-rose-500/5 outline-none transition-all font-bold text-slate-700"
            />
          </div>
          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            {(['all', 'pending', 'accepted', 'completed', 'cancelled'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all active:scale-95 ${
                  filterStatus === status 
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' 
                  : 'bg-white border-2 border-slate-100 text-slate-400 hover:bg-slate-50'
                }`}
              >
                {status === 'all' ? 'সব' : 
                 status === 'pending' ? 'অপেক্ষমান' : 
                 status === 'accepted' ? 'গৃহীত' : 
                 status === 'completed' ? 'সম্পন্ন' : 'বাতিল'}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest border-b border-slate-100">
                <th className="p-6 font-black">রোগীর তথ্য</th>
                <th className="p-6 font-black">হাসপাতাল ও অবস্থান</th>
                <th className="p-6 font-black">রক্তের গ্রুপ</th>
                <th className="p-6 font-black">অবস্থা</th>
                <th className="p-6 font-black">তারিখ ও সময়</th>
                <th className="p-6 font-black text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-50">
              {filteredRequests.map(req => (
                <tr key={req.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 ${req.isEmergency ? 'bg-red-50 border-red-100 text-red-500' : 'bg-rose-50 border-rose-100 text-rose-500'}`}>
                        <span className="font-black text-lg">{req.bloodGroup}</span>
                      </div>
                      <div>
                        <p className="font-black text-slate-800 text-base flex items-center gap-2">
                          {req.patientName}
                          {req.isEmergency && (
                            <span className="flex items-center gap-1 bg-red-500 text-white text-[8px] px-2 py-0.5 rounded-full animate-pulse">
                              <AlertTriangle className="w-2 h-2" /> EMERGENCY
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-slate-400 font-bold flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {req.contactNumber}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <p className="font-black text-slate-700">{req.hospitalName}</p>
                    <p className="text-xs text-slate-400 font-bold flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-500" /> {req.location}
                    </p>
                  </td>
                  <td className="p-6">
                    <span className={`px-4 py-1.5 rounded-xl font-black text-xs border inline-block ${
                      req.isEmergency ? 'bg-red-50 text-red-600 border-red-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                    }`}>
                      {req.bloodGroup}
                    </span>
                  </td>
                  <td className="p-6">
                    <span className={`px-4 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-wider border inline-flex items-center gap-2 ${
                      req.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      req.status === 'accepted' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      req.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      'bg-slate-100 text-slate-400 border-slate-200'
                    }`}>
                      {req.status === 'pending' && <Clock className="w-3 h-3" />}
                      {req.status === 'accepted' && <CheckCircle2 className="w-3 h-3" />}
                      {req.status === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                      {req.status === 'cancelled' && <XCircle className="w-3 h-3" />}
                      {req.status === 'pending' ? 'অপেক্ষমান' : 
                       req.status === 'accepted' ? 'গৃহীত' : 
                       req.status === 'completed' ? 'সম্পন্ন' : 'বাতিল'}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col">
                      <p className="font-black text-slate-700 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {format(new Date(req.dateTime), 'dd MMMM, yyyy', { locale: bn })}
                      </p>
                      <p className="text-xs text-slate-400 font-bold">
                        {format(new Date(req.dateTime), 'hh:mm a', { locale: bn })}
                      </p>
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex items-center justify-end gap-3 transition-all">
                      {req.status === 'pending' && (
                        <button 
                          onClick={() => handleStatusChange(req.id, 'accepted')}
                          className="p-3 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-2xl transition-all active:scale-90"
                          title="গ্রহণ করুন"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                      )}
                      {req.status === 'accepted' && (
                        <button 
                          onClick={() => handleStatusChange(req.id, 'completed')}
                          className="p-3 bg-emerald-100 text-emerald-600 hover:bg-emerald-200 rounded-2xl transition-all active:scale-90"
                          title="সম্পন্ন করুন"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(req.id)}
                        className="p-3 bg-red-100 text-red-600 hover:bg-red-200 rounded-2xl transition-all active:scale-90"
                        title="ডিলিট করুন"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <button className="p-3 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-2xl transition-all active:scale-90">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400 font-bold bg-slate-50/30">
          <p>{filteredRequests.length} টি এন্ট্রির মধ্যে ১ থেকে {filteredRequests.length} টি দেখানো হচ্ছে</p>
          <div className="flex gap-2">
            <button className="px-5 py-2.5 border-2 border-slate-100 rounded-xl hover:bg-white transition-all disabled:opacity-50 font-black">পূর্ববর্তী</button>
            <button className="px-5 py-2.5 bg-rose-500 text-white rounded-xl shadow-lg shadow-rose-500/20 font-black">১</button>
            <button className="px-5 py-2.5 border-2 border-slate-100 rounded-xl hover:bg-white transition-all disabled:opacity-50 font-black">পরবর্তী</button>
          </div>
        </div>
      </div>
    </div>
  );
}
