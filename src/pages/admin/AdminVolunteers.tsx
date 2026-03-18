import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { UserCheck, UserX, Clock, Phone, User } from 'lucide-react';

export default function AdminVolunteers() {
  const { volunteerApplications, updateVolunteerStatus } = useAppStore();

  return (
    <div className="space-y-8 font-sans">
      <div>
        <h2 className="text-3xl font-black text-slate-800">সেচ্ছাসেবী আবেদনসমূহ</h2>
        <p className="text-sm text-slate-500 font-bold">নতুন সেচ্ছাসেবী নিয়োগ এবং আবেদন যাচাই করুন</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {volunteerApplications.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-12 text-center shadow-xl shadow-slate-200/40 border border-slate-100">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">কোন আবেদন পাওয়া যায়নি</h3>
            <p className="text-sm text-slate-500 font-bold">নতুন আবেদন আসলে এখানে দেখা যাবে</p>
          </div>
        ) : (
          volunteerApplications.map(app => (
            <div key={app.id} className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center font-black text-rose-500 text-xl border-2 border-rose-100">
                    {app.name[0]}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800">{app.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-bold mt-1">
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {app.phone}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(app.createdAt).toLocaleDateString('bn-BD')}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">আবেদনের কারণ</p>
                  <p className="text-sm font-bold text-slate-700 leading-relaxed">{app.reason}</p>
                </div>
              </div>

              <div className="flex flex-col justify-center gap-3 min-w-[200px]">
                <div className={`px-6 py-2 rounded-xl text-center text-[10px] font-black uppercase tracking-widest mb-2 ${
                  app.status === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                  app.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                  'bg-rose-50 text-rose-600 border border-rose-100'
                }`}>
                  {app.status === 'pending' ? 'অপেক্ষমান' : app.status === 'approved' ? 'অনুমোদিত' : 'বাতিল'}
                </div>

                {app.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => updateVolunteerStatus(app.id, 'approved')}
                      className="w-full bg-emerald-500 text-white font-black py-3 rounded-xl shadow-lg hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <UserCheck className="w-4 h-4" /> অনুমোদন দিন
                    </button>
                    <button 
                      onClick={() => updateVolunteerStatus(app.id, 'rejected')}
                      className="w-full bg-white text-rose-500 border-2 border-rose-50 font-black py-3 rounded-xl hover:bg-rose-50 transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <UserX className="w-4 h-4" /> বাতিল করুন
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
